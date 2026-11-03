import { ApolloLink, Observable } from "@apollo/client";
import { getOperationAST } from "graphql";

export const SAMPLE_PROJECT_KEY = "SAMPLE";

function dateInDays(days) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function hoursAgo(hours) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function avatar(initials, color) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" rx="24" fill="${color}"/><text x="24" y="30" text-anchor="middle" font-family="sans-serif" font-size="16" fill="white">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const project = {
  __typename: "JiraProject",
  id: "sample-project",
  key: SAMPLE_PROJECT_KEY,
  name: "Sample Product Delivery",
};

const engineers = [
  {
    __typename: "Engineer",
    id: "sample-engineer-1",
    name: "Maya Shah",
    role: "Frontend",
    capacity: 14,
    avatar: avatar("MS", "#2563eb"),
    jiraAccountId: "sample-maya",
  },
  {
    __typename: "Engineer",
    id: "sample-engineer-2",
    name: "Leo Chen",
    role: "Backend",
    capacity: 11,
    avatar: avatar("LC", "#7c3aed"),
    jiraAccountId: "sample-leo",
  },
  {
    __typename: "Engineer",
    id: "sample-engineer-3",
    name: "Ava Morgan",
    role: "QA",
    capacity: 11,
    avatar: avatar("AM", "#059669"),
    jiraAccountId: "sample-ava",
  },
];

const tickets = [
  {
    id: "sample-ticket-101",
    key: "SAMPLE-101",
    summary: "Build the customer onboarding flow",
    status: "In Progress",
    assignee: "Maya Shah",
    priority: "High",
    points: 5,
    estimate: "2d",
    updated: hoursAgo(2),
    eta: dateInDays(3),
  },
  {
    id: "sample-ticket-102",
    key: "SAMPLE-102",
    summary: "Create the account management API",
    status: "To Do",
    assignee: "Leo Chen",
    priority: "Highest",
    points: 8,
    estimate: "3d",
    updated: hoursAgo(5),
    eta: dateInDays(5),
  },
  {
    id: "sample-ticket-103",
    key: "SAMPLE-103",
    summary: "Test the registration journey",
    status: "In Review",
    assignee: "Ava Morgan",
    priority: "Medium",
    points: 3,
    estimate: "1d",
    updated: hoursAgo(8),
    eta: null,
  },
  {
    id: "sample-ticket-104",
    key: "SAMPLE-104",
    summary: "Add profile settings",
    status: "To Do",
    assignee: "Maya Shah",
    priority: "Medium",
    points: 5,
    estimate: "2d",
    updated: hoursAgo(12),
    eta: dateInDays(6),
  },
  {
    id: "sample-ticket-105",
    key: "SAMPLE-105",
    summary: "Resolve checkout validation errors",
    status: "Blocked",
    assignee: "Unassigned",
    priority: "High",
    points: 8,
    estimate: "3d",
    updated: hoursAgo(16),
    eta: dateInDays(2),
  },
  {
    id: "sample-ticket-106",
    key: "SAMPLE-106",
    summary: "Improve notification delivery",
    status: "In Progress",
    assignee: "Leo Chen",
    priority: "Medium",
    points: 3,
    estimate: "1d",
    updated: hoursAgo(20),
    eta: null,
  },
  {
    id: "sample-ticket-107",
    key: "SAMPLE-107",
    summary: "Add end-to-end payment tests",
    status: "To Do",
    assignee: "Ava Morgan",
    priority: "Medium",
    points: 5,
    estimate: "2d",
    updated: hoursAgo(28),
    eta: dateInDays(8),
  },
  {
    id: "sample-ticket-108",
    key: "SAMPLE-108",
    summary: "Investigate slow search results",
    status: "To Do",
    assignee: "Unassigned",
    priority: "Highest",
    points: 5,
    estimate: "2d",
    updated: hoursAgo(32),
    eta: dateInDays(4),
  },
  {
    id: "sample-ticket-109",
    key: "SAMPLE-109",
    summary: "Update dashboard accessibility",
    status: "To Do",
    assignee: "Maya Shah",
    priority: "Low",
    points: 3,
    estimate: "1d",
    updated: hoursAgo(40),
    eta: null,
  },
  {
    id: "sample-ticket-110",
    key: "SAMPLE-110",
    summary: "Add audit events for account changes",
    status: "To Do",
    assignee: "Leo Chen",
    priority: "High",
    points: 5,
    estimate: "2d",
    updated: hoursAgo(48),
    eta: dateInDays(10),
  },
].map((ticket) => ({ __typename: "JiraTicket", ...ticket }));

const totalPoints = tickets.reduce((sum, ticket) => sum + ticket.points, 0);
const capacity = engineers.reduce((sum, engineer) => sum + engineer.capacity, 0);
const unassigned = tickets.filter((ticket) => ticket.assignee === "Unassigned").length;

const stats = {
  __typename: "getJiraStats",
  total: String(tickets.length),
  unassigned: String(unassigned),
  assigned: String(tickets.length - unassigned),
  storyPoints: String(totalPoints),
};

const insights = {
  __typename: "AIInsights",
  sprintEstimate: Math.ceil(totalPoints / capacity),
  headline: "The sample backlog fits into two sprints.",
  confidence: "Illustrative",
  workload: `${totalPoints} points across ${tickets.length} tickets; the team has ${capacity} points of capacity per sprint.`,
  risk: "Two high-priority tickets are unassigned.",
  recommendation: "Assign owners and review the proposed sprint split before planning.",
  blockers: [
    "Two high-priority tickets need owners.",
    "The backlog exceeds one sprint of team capacity.",
  ],
  nextActions: [
    "Assign the two unowned tickets.",
    "Review the example sprint plan with the team.",
  ],
};

const sprintAssignments = [
  [[0, 0], [1, 1], [2, 2], [3, 0], [4, 2], [5, 1]],
  [[6, 2], [7, 1], [8, 0], [9, 1]],
];

const sprints = sprintAssignments.map((assignments, index) => {
  const plannedTickets = assignments.map(([ticketIndex, engineerIndex]) => ({
    ...tickets[ticketIndex],
    assignee: engineers[engineerIndex].name,
    jiraAccountId: engineers[engineerIndex].jiraAccountId,
  }));

  return {
    __typename: "Sprint",
    sprintNumber: index + 1,
    totalPoints: plannedTickets.reduce((sum, ticket) => sum + ticket.points, 0),
    capacity,
    engineers: engineers.map((engineer) => engineer.name),
    tickets: plannedTickets,
  };
});

function requireSampleProject(projectKey) {
  if (projectKey !== SAMPLE_PROJECT_KEY) {
    throw new Error(`Unknown sample project: ${projectKey}`);
  }
}

function getSampleField(field, variables) {
  switch (field) {
    case "__typename":
      return "Query";
    case "getJiraProfile":
      return {
        __typename: "User",
        accountId: "sample-user",
        displayName: "Sample User",
        email: null,
        avatarUrl: avatar("SU", "#475569"),
        userId: "sample-user",
      };
    case "getJiraProjects":
      return [project];
    case "getJiraUsers":
      if (variables.projectKey) requireSampleProject(variables.projectKey);
      return engineers.map((engineer) => ({
        __typename: "JiraUser",
        name: engineer.name,
        accountId: engineer.jiraAccountId,
        avatar: engineer.avatar,
      }));
    case "getJiraTickets":
      requireSampleProject(variables.projectKey);
      return tickets;
    case "getJiraStats":
      requireSampleProject(variables.projectKey);
      return stats;
    case "getAIInsights":
      requireSampleProject(variables.projectKey);
      return insights;
    case "getEngineers":
      requireSampleProject(variables.projectKey);
      return engineers;
    case "generateSprintPlan":
      requireSampleProject(variables.projectKey);
      return sprints;
    default:
      throw new Error(`No sample data is available for ${field}.`);
  }
}

export function createSampleLink() {
  return new ApolloLink((operation) => new Observable((observer) => {
    const definition = getOperationAST(
      operation.query,
      operation.operationName || undefined
    );

    if (!definition || definition.operation !== "query") {
      throw new Error("Jira changes are unavailable in sample mode.");
    }

    const data = {};
    for (const selection of definition.selectionSet.selections) {
      if (selection.kind !== "Field") {
        throw new Error("Sample queries must select fields directly.");
      }

      data[selection.alias?.value || selection.name.value] = getSampleField(
        selection.name.value,
        operation.variables
      );
    }

    observer.next({ data });
    observer.complete();
  }));
}
