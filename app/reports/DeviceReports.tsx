import AgentClient from "../lib/AgentClient";

interface DeviceReportsProps {
  agent: AgentClient;
}

const DeviceReports: React.FC<DeviceReportsProps> = ({ agent }) => {
  return (
    <div className="flex flex-col">
      <button>Generate Reports</button>
      <button>List Reports</button>
    </div>
  )
}

export default DeviceReports;