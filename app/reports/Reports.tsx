import AgentClient from "../lib/AgentClient";

interface ReportsProps {
  agent: AgentClient;
}

const Reports: React.FC<ReportsProps> = ({ agent }) => {
  return (
    <div>
      Reports
    </div>
  )
}

export default Reports;