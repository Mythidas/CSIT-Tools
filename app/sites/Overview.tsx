"use client"

import React, { useState } from "react"
import AgentClient from "../lib/AgentClient"
import { useEffectOnce } from "../lib/hooks/useEffectOnce"
import { Site } from "../lib/interfaces/agent/site"
import { DeviceList } from "../lib/interfaces/agent/device"
import { ExcelFile, ExcelSheet, ExcelSheetData, ExcelStyle } from "react-xlsx-wrapper"
import Loading from "../lib/components/Loading"
import Image from "next/image"

const VSA_URL = "https://centriserve-it.vsax.net/app/main/systems/";

interface OverviewProps {
  agent: AgentClient
  site?: Site
}

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
    const column_header_style: ExcelStyle = { 
      alignment: { horizontal: "center" }, 
      font: { bold: true, sz: 16 }, 
      fill: { patternType: "solid", fgColor: { rgb: "FF83B1D8" } },
      border: { style: "thin", color: { auto: 1, rgb: "FF000000" } }
    };

    let data_set: ExcelSheetData = {
      columns: [
        { 
          title: "Device", width: { wch: 25 }, 
          style: column_header_style
        },
        { 
          title: "VSAX", width: { wch: 10 }, 
          style: column_header_style
        },
        { 
          title: "Sophos", width: { wch: 10 }, 
          style: column_header_style
        },
        { 
          title: "OS", width: { wch: 15 }, 
          style: column_header_style
        },
        { 
          title: "Last Heartbeat", width: { wch: 25 }, 
          style: column_header_style
        },
      ],
      data: []
    };

    if (device_list) {
      for (let i = 0; i < device_list?.devices.length; i++) {
        const uptime = device_list?.devices[i].uptime ? new Date(device_list?.devices[i].uptime || "").toLocaleString() : "Never"
        data_set.data.push([
          { 
            value: device_list.devices[i].name, 
            style: { 
              alignment: { horizontal: "center" },
              font: { sz: 12 } 
            }
          },
          { 
            value: device_list.devices[i].vsa_id ? "YES" : "NO", 
            style: {
              alignment: { horizontal: "center" },
              font: { sz: 12 }, 
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
            style: {
              alignment: { horizontal: "center" },
              font: { sz: 12 }, 
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
            style: { font: { sz: 12 }, alignment: { horizontal: "center" } }
          },
          { 
            value: uptime,
            style: { font: { sz: 12 }, alignment: { horizontal: "center" } }
          },
        ])
      }
    }

    return <ExcelSheet dataSet={[data_set]} name={`Devices`} />
  }

  async function live_refresh() {
    if (site) {
      set_device_list(undefined);
      const device_data = await agent.refresh_devices(site);
      set_device_list(device_data);
    }
  }

  if (!site) {
    return <div></div>
  }

  return (
    <div className="flex flex-col h-5/6">
      <div className="flex pb-4 gap-3 font-bold"> 
        <p className="text-3xl">Summary</p>
        {device_list && 
        <button className="bg-cscol-200 px-3 py-1 rounded-md text-xl" onClick={live_refresh}>Live Refresh</button>}
        {device_list && 
        <ExcelFile filename={`${site.name} - Overview`} element={<button className="bg-cscol-200 px-3 py-1 rounded-md text-xl">Export Table</button>}>
          {export_table()}
        </ExcelFile>}
      </div>
      <div className="grid grid-flow-col auto-cols-max gap-1 text-cscol-500 font-bold text-xl">
        <div className="bg-cscol-100 p-2">{site.name}</div>
        <div className="bg-cscol-100 p-2">Unique Computers: {device_list?.devices.length}</div>
        <div className={`${device_list && device_list.rogue_devices === 0 ? "bg-cscol-100" : "bg-errcol-100 text-cscol-100"} p-2`}>Matching Computers: {device_list && (device_list?.devices.length - device_list?.rogue_devices)}</div>
      </div>
      <div className="flex font-bold text-3xl py-4">
        Devices
      </div>
      {device_list && <div className="flex w-full h-5/6 overflow-y-auto">
        <table className="table-auto border-separate w-full h-fit text-cscol-500 text-center">
          <thead className="sticky top-0">
            <tr>
              <th key={0} className="bg-cscol-200 text-cscol-100 p-1 text-xl font-bold">Name</th>
              <th key={1} className="bg-cscol-200 text-cscol-100 p-1 text-xl font-bold">VSAX</th>
              <th key={2} className="bg-cscol-200 text-cscol-100 p-1 text-xl font-bold">Sophos</th>
              <th key={3} className="bg-cscol-200 text-cscol-100 p-1 text-xl font-bold">OS</th>
              <th key={3} className="bg-cscol-200 text-cscol-100 p-1 text-xl font-bold">Last Heartbeat</th>
            </tr>
          </thead>
          <tbody className="text-cscol-500 text-center">
            {device_list &&
              device_list.devices.map((device, index) => (
                <tr key={index} className="even:bg-cscol-300 odd:bg-cscol-100 text-xl font-bold">
                  <td>{device.name}</td>
                  <td className={`${device.vsa_id ? "" : "text-errcol-100"} flex items-center text-center`}>
                    {device.vsa_id ? 
                    <a className="flex m-auto text-center hover:text-cscol-400" href={`${VSA_URL}${device.vsa_id}/details`} target="_blank">
                      YES <Image className="object-contain pl-1 m-auto" height={24} width={24} src="/link-96.png" alt="" />
                    </a> : <p className="flex m-auto">NO</p> }
                  </td>
                  <td className={`${device.sophos_id ? "" : "text-errcol-100"}`}>
                    {device.sophos_id ? "YES" : "NO"}
                  </td>
                  <td>{device.os}</td>
                  <td>{device.uptime ? new Date(device.uptime).toLocaleString() : "Never"}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>}
      {!device_list && <Loading />}
    </div>
  )
}

export default Overview;