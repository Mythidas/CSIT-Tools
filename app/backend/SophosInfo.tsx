"use client"

import { useState } from "react";
import AgentClient from "../lib/AgentClient";
import { useEffectOnce } from "../lib/hooks/useEffectOnce";
import { Site } from "../lib/interfaces/agent/site";
import { ExcelFile, ExcelSheet, ExcelSheetData, ExcelStyle } from "react-xlsx-wrapper";
import Table, { TableCell, TableRow } from "../lib/components/Table";

interface SophosInfoProps {
  agent: AgentClient;
}

const SophosInfo: React.FC<SophosInfoProps> = ({ agent }) => {
  const [sites, set_sites] = useState<Site[]>([]);

  useEffectOnce(() => {
    async function get_site_data() {
      const sites = await agent.get_sophos_sites();
      set_sites(sites);
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

  const table_header_config = [
    { label: "Site", searchable: true }, 
    { label: "Tenant ID" }, 
    { label: "API Url" }
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex pb-4 gap-3 font-bold"> 
        <p className="text-3xl">Sophos Site Info</p>
        {sites.length > 0 && 
        <ExcelFile filename={`Sophos Site Info`} element={<button className="bg-cscol-200 px-3 py-1 rounded-md text-xl">Export Table</button>}>
          {export_table()}
        </ExcelFile>}
      </div>
      <Table headers={table_header_config} loading={sites.length === 0}>
        {sites.map((site, index) => {
          return (
            <TableRow 
              key={index} 
              values={[ site.name, site.sophos_id || "", site.sophos_url || "" ]}
            >
              <TableCell>{site.name}</TableCell>
              <TableCell>{site.sophos_id}</TableCell>
              <TableCell>{site.sophos_url}</TableCell>
            </TableRow>
          )
        })}
      </Table>
    </div>
  )
}

export default SophosInfo;