"use client"

import { useState } from "react";
import AgentClient from "../lib/AgentClient";
import { useEffectOnce } from "../lib/hooks/useEffectOnce";
import { Site } from "../lib/interfaces/agent/site";

interface BackendProps {
  agent: AgentClient;
}

const Backend: React.FC<BackendProps> = ({ agent }) => {
  const [sites, set_sites] = useState<Site[]>([]);

  useEffectOnce(() => {
    async function get_site_data() {
      
    }

    get_site_data();
  }, []);

  return (
    <div>
      <p className="font-bold text-2xl">Sophos Site Info</p>
      <div className="pt-3">
        <table className="table-auto border-separate w-full h-fit text-cscol-500 text-center">
          <thead className="sticky top-0">
            <tr>
              <th key={0} className="bg-cscol-200 text-cscol-100 p-1 text-xl font-bold">Name</th>
              <th key={1} className="bg-cscol-200 text-cscol-100 p-1 text-xl font-bold">Tenant ID</th>
              <th key={2} className="bg-cscol-200 text-cscol-100 p-1 text-xl font-bold">API Server</th>
            </tr>
          </thead>
          <tbody className="text-cscol-500 text-center">

          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Backend;