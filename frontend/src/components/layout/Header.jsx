import { useQuery } from "@apollo/client/react";
import { useDispatch, useSelector } from "react-redux";
import ProjectSelector from "../common/ProjectSelector";
import { GET_PROFILE } from "../../graphql/queries";
import { setSampleMode } from "../../store/projectSlice";

export default function Header() {
  const dispatch = useDispatch();
  const sampleMode = useSelector((state) => state.project.sampleMode);
  const { data, loading } = useQuery(GET_PROFILE, {
    fetchPolicy: "cache-first",
  });


  function handleJiraConnection() {
  const authBaseUrl = import.meta.env.DEV ? "http://localhost:5000" : "";
  
  // window.location.href = `${authBaseUrl}/auth/jira/login`;
  }

  return (
    <div className="flex flex-wrap justify-between items-center gap-3 p-4 border-b bg-white">
      
      {/* LEFT */}
      <ProjectSelector />

      {/* RIGHT */}
      <div className="flex flex-wrap items-center justify-end gap-3">
      {!sampleMode && (
        <button
          onClick={() => dispatch(setSampleMode(true))}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
        >
          View sample data
        </button>
      )}
      {loading ? (
        <span className="text-sm text-gray-500">Loading Jira profile...</span>
      ) : data?.getJiraProfile ? (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
            <img
              src={data.getJiraProfile.avatarUrl}
              alt="profile"
              className="w-full h-full object-cover"
            />
          </div>

          <h1 className="font-sm whitespace-nowrap">
            {data.getJiraProfile.displayName}
          </h1>

        </div>
      ) : (
        <button
          onClick={handleJiraConnection}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          Connect Jira
        </button>
      )}
      </div>
    </div>
  );
}
