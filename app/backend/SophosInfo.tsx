"use client"

import { useState } from "react";
import AgentClient from "../lib/AgentClient";
import { useEffectOnce } from "../lib/hooks/useEffectOnce";
import { Site } from "../lib/interfaces/agent/site";
import { ExcelFile, ExcelSheet, ExcelSheetData, ExcelStyle } from "react-xlsx-wrapper";

interface SophosInfoProps {
  agent: AgentClient;
}

const SophosInfo: React.FC<SophosInfoProps> = ({ agent }) => {
  const [sites, set_sites] = useState<Site[]>([]);

  useEffectOnce(() => {
    async function get_site_data() {
      const sites = await agent.get_sophos_sites();
      set_sites(sites);
      console.log(sites);
    }

    get_site_data();
  }, []);

  function export_table() {
    const column_header_style: ExcelStyle = { 
      alignment: { horizontal: "center" }, 
      font: { bold: true, sz: 16 }, 
      fill: { patternType: "solid", fgColor: { rgb: "FF83B1D8" } },
      border: { style: "thin", color: { auto: 1, rgb: "FF000000" } }
    };

    let data_set: ExcelSheetData = {
      columns: [
        { 
          title: "Site", width: { wch: 40 }, 
          style: column_header_style
        },
        { 
          title: "Tenant ID", width: { wch: 40 }, 
          style: column_header_style
        },
        { 
          title: "API Server", width: { wch: 40 }, 
          style: column_header_style
        },
      ],
      data: []
    };

    if (sites.length > 0) {
      for (let i = 0; i < sites.length; i++) {
        data_set.data.push([
          { 
            value: sites[i].name, 
            style: { 
              font: { sz: 12 } 
            }
          },
          { 
            value: sites[i].sophos_id || "", 
            style: { font: { sz: 12 } }
          },
          { 
            value: sites[i].sophos_url || "",
            style: { font: { sz: 12 } }
          },
        ])
      }
    }

    return <ExcelSheet dataSet={[data_set]} name={`Sophos Sites`} />
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex pb-4 gap-3 font-bold"> 
        <p className="text-3xl">Sophos Site Info</p>
        {sites.length > 0 && 
        <ExcelFile filename={`Sophos Site Info`} element={<button className="bg-cscol-200 px-3 py-1 rounded-md text-xl">Export Table</button>}>
          {export_table()}
        </ExcelFile>}
      </div>
      <div className="flex w-full h-5/6 overflow-y-auto">
        <table className="table-auto border-separate w-full h-fit text-cscol-500 text-center">
          <thead className="sticky top-0">
            <tr>
              <th key={0} className="bg-cscol-200 text-cscol-100 p-1 text-xl font-bold">Site</th>
              <th key={1} className="bg-cscol-200 text-cscol-100 p-1 text-xl font-bold">Tenant ID</th>
              <th key={2} className="bg-cscol-200 text-cscol-100 p-1 text-xl font-bold">API Server</th>
            </tr>
          </thead>
          <tbody className="text-cscol-500 text-center">
            {sites && sites.map((site, index) => {
              return (
                <tr key={index} className="even:bg-cscol-300 odd:bg-cscol-100 text-xl font-bold">
                  <td>{site.name}</td>
                  <td>{site.sophos_id}</td>
                  <td>{site.sophos_url}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SophosInfo;