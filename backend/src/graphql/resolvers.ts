import { refreshAccessToken } from "../auth/auth.service";
import { JiraToken } from "../models/JiraToken.model";
import { fetchJiraProjects, fetchJiraTickets, getUserToken, fetchAllJiraTickets, getJiraEngineers, getAllJiraUsers } from "../services/jira.services";
import axios from "axios";
import { JiraTicket } from "../types/jira.types";
import { formatEstimate } from "../utils/utils";
import { generateAIInsights, generateAISprint } from "../services/sprintPlanner.services";


function requireUserId(context: any) {
  const userId = context?.user?.id;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return userId;
}

const resolvers = {
  Query: {
    getJiraTickets: async (_: any, { projectKey }: any, context: any): Promise<JiraTicket[]> => {
      const UserId = requireUserId(context);

      const issues = await fetchAllJiraTickets(UserId, projectKey);

      console.log(issues)

      return issues.map((issue: any) => ({
        id: issue.id,
        key: issue.key,
        summary: issue.fields.summary,
        status: issue.fields.status.name,
        assignee: issue.fields.assignee?.displayName || "Unassigned",
        priority: issue.fields.priority?.name || "None",
        points: issue.fields.customfield_10016 || 0, // 🔥 important
        estimate: formatEstimate(issue.fields.timetracking),
        updated: issue.fields.updated,
        eta: issue.fields.duedate || null
      }));
    },
    getJiraStats: async (_: any, { projectKey }: any, context: any) => {
      const userId = requireUserId(context);
      console.log(projectKey)
      const issues = await fetchJiraTickets(userId, projectKey);
      return {
        total: issues.length,
        unassigned: issues.filter((i: any) => !i.fields.assignee).length,
        assigned: issues.filter((i: any) => i.fields.assignee).length,
        storyPoints: issues.reduce(
          (sum: number, i: any) => sum + (i.fields.customfield_10016 || 0),
          0
        ),
      };
    },
    getJiraProfile: async (_: any, __: any, context: any) => {
      const userId = context?.user?.id;

      const tokenData = await getUserToken(userId);

      if (!tokenData) return null;

      let { accessToken, cloudId, refreshToken } = tokenData;

      if (new Date() > tokenData.expiresAt) {
        const newTokens = await refreshAccessToken(refreshToken);

        accessToken = newTokens.access_token; // ✅ update local variable

        await JiraToken.findOneAndUpdate(
          { userId },
          {
            accessToken,
            expiresAt: new Date(Date.now() + newTokens.expires_in * 1000),
          }
        );
      }

      return {
        userId: tokenData._id,
        accountId: tokenData.userInformation.accountId,
        displayName: tokenData.userInformation.displayName,
        email: tokenData.userInformation.emailAddress,
        avatarUrl: tokenData.userInformation.avatarUrls["48x48"]
      };
    },
    getJiraProjects: async (_: any, __: any, context: any) => {
      const userId = context?.user?.id;

      if (!userId) throw new Error("Unauthorized");

      const projects = await fetchJiraProjects(userId);


      return projects.map((p: any) => ({
        id: p.id,
        key: p.key,
        name: p.name,
      }));
    },


    getJiraUsers:async(_: any, { projectKey }: any, context: any)=>{
      const userId = requireUserId(context);

      console.log(context.user)
      return await getAllJiraUsers(userId);

    },
  },

  Mutation: {
    connectJira: async () => {
      return "http://localhost:5000/auth/jira/login";
    }
  },
};

export default resolvers;
