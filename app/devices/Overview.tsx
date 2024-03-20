"use client"

import React, { useState } from "react"
import AgentClient from "../lib/AgentClient"
import { useEffectOnce } from "../lib/hooks/useEffectOnce"
import { Site } from "../lib/interfaces/agent/site"
import { DeviceList } from "../lib/interfaces/agent/device"
import { ExcelFile, ExcelSheet } from "react-xlsx-wrapper"

interface OverviewProps {
  agent: AgentClient
  site?: Site
}

const multiDataSet = [
  {
    columns: [
      {title: "Headings", width: {wpx: 80}},//pixels width 
      {title: "Text Style", width: {wch: 40}},//char width 
      {title: "Colors", width: {wpx: 90}},
    ],
    data: [
      [
          {value: "Test", style: {font: {sz: "24", bold: true}}},
          {value: "Bold", style: {font: {bold: true}}},
          {value: "Red", style: {fill: {patternType: "solid", fgColor: {rgb: "FFFF0000"}}}},
      ],
      [
          {value: "H2", style: {font: {sz: "18", bold: true}}},
          {value: "underline", style: {font: {underline: true}}},
          {value: "Blue", style: {fill: {patternType: "solid", fgColor: {rgb: "FF0000FF"}}}},
      ],
      [
          {value: "H3", style: {font: {sz: "14", bold: true}}},
          {value: "italic", style: {font: {italic: true}}},
          {value: "Green", style: {fill: {patternType: "solid", fgColor: {rgb: "FF00FF00"}}}},
      ],
      [
          {value: "H4", style: {font: {sz: "12", bold: true}}},
          {value: "strike", style: {font: {strike: true}}},
          {value: "Orange", style: {fill: {patternType: "solid", fgColor: {rgb: "FFF86B00"}}}},
      ],
      [
          {value: "H5", style: {font: {sz: "10.5", bold: true}}},
          {value: "outline", style: {font: {outline: true}}},
          {value: "Yellow", style: {fill: {patternType: "solid", fgColor: {rgb: "FFFFFF00"}}}},
      ],
      [
          {value: "H6", style: {font: {sz: "7.5", bold: true}}},
          {value: "shadow", style: {font: {shadow: true}}},
          {value: "Light Blue", style: {fill: {patternType: "solid", fgColor: {rgb: "FFCCEEFF"}}}}
      ]
    ]
  }
];

const Overview: React.FC<OverviewProps> = ({ agent, site }) => {
  const [device_list, set_device_list] = useState<DeviceList | undefined>(undefined);

  useEffectOnce(() => {
    async function get_devices(_site: Site) {
      const device_data = await agent.get_devices(_site);
      set_device_list(device_data);
    }

    if (site) {
      set_device_list(undefined);
      get_devices(site);
    }
  }, [site])

  function export_table() {
    let data_set: XLSXDataSet = {
      columns: [
        { title: "Device", width: { wch: 25 } },
        { title: "VSAX", width: { wch: 10 } },
        { title: "Sophos", width: { wch: 10 } },
        { title: "OS", width: { wch: 15 } },
      ],
      data: []
    };

    if (device_list) {
      for (let i = 0; i < device_list?.devices.length; i++) {
        data_set.data.push([
          { 
            value: device_list.devices[i].name, 
            style: { 
              font: { sz: "10" } 
            }
          },
          { 
            value: device_list.devices[i].vsa_id ? "YES" : "NO", 
            style: { font: { sz: "10" }, 
              fill: { 
                patternType: device_list.devices[i].vsa_id ? "none" : "solid", 
                fgColor: { 
                  rgb: "FFFF204E"
                }
              },
            }
          },
          { 
            value: device_list.devices[i].sophos_id ? "YES" : "NO", 
            style: { font: { sz: "10" }, 
              fill: { 
                patternType: device_list.devices[i].sophos_id ? "none" : "solid", 
                fgColor: { 
                  rgb: "FFFF204E"
                }
              },
            }
          },
          { 
            value: device_list.devices[i].os, 
            style: { font: { sz: "10" } }
          },
        ])
      }
    }

    return <ExcelSheet dataSet={[data_set]} name={`${device_list?.site_name}`} />
  }

  if (!site) {
    return <div></div>
  }

  return (
    <div className="flex flex-col h-5/6">
      <div className="flex pb-4 gap-3 font-bold"> 
        <p className="text-3xl">Summary</p>
        {device_list && 
        <ExcelFile filename={`Overview - ${site.name}`} element={<button className="bg-cscol-200 px-3 py-1 rounded-md text-xl">Export Table</button>}>
          {export_table()}
        </ExcelFile>}
      </div>
      <div className="grid grid-flow-col auto-cols-max gap-1 text-cscol-500 font-bold text-xl">
        <div className="bg-cscol-100 p-2">{site.name}</div>
        <div className="bg-cscol-100 p-2">Unique Computers: {device_list?.devices.length}</div>
        <div className={`${device_list && device_list.rogue_devices === 0 ? "bg-cscol-100" : "bg-errcol-100 text-cscol-100"} p-2`}>Matching Computers: {device_list && (device_list?.devices.length - device_list?.rogue_devices)}</div>
      </div>
      <p className="font-bold text-3xl py-4">Devices</p>
      <div className="flex w-full h-5/6 overflow-y-auto">
        <table className="table-auto border-separate w-full h-full text-cscol-500 text-center">
          <thead className="sticky top-0">
            <tr>
              <th key={0} className="bg-cscol-200 text-cscol-100 p-1 text-xl font-bold">Name</th>
              <th key={1} className="bg-cscol-200 text-cscol-100 p-1 text-xl font-bold">VSAX</th>
              <th key={2} className="bg-cscol-200 text-cscol-100 p-1 text-xl font-bold">Sophos</th>
              <th key={3} className="bg-cscol-200 text-cscol-100 p-1 text-xl font-bold">OS</th>
            </tr>
          </thead>
          <tbody className="text-cscol-500 text-center">
            {device_list &&
              device_list.devices.map((device, index) => (
                <tr key={index} className="even:bg-cscol-300 odd:bg-cscol-100 text-xl font-bold">
                  <td key={(device.name + "0")}>{device.name}</td>
                  <td className={`${device.vsa_id ? "" : "text-errcol-100"}`} key={(device.name + "1")}>{device.vsa_id ? "YES" : "NO"}</td>
                  <td className={`${device.sophos_id ? "" : "text-errcol-100"}`} key={(device.name + "2")}>{device.sophos_id ? "YES" : "NO"}</td>
                  <td key={(device.name + "3")}>{device.os}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Overview;