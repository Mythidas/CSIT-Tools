"use client"

import { useState } from "react"
import AgentClient from "../lib/AgentClient"
import { useEffectOnce } from "../lib/hooks/useEffectOnce"
import { Site } from "../lib/interfaces/agent/site"
import { DeviceList } from "../lib/interfaces/agent/device"
import React from "react"

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
      set_device_list({ site_name: site.name, devices: [], rogue_devices: 0 });
      get_devices(site);
    }
  }, [site])

  if (!site) {
    return <div></div>
  }

  return (
    <div className="flex flex-col h-5/6">
      <p className="font-bold text-3xl pb-4">Summary</p>
      <div className="grid grid-flow-col auto-cols-max gap-1 text-cscol-500 font-bold text-xl">
        <div className="bg-cscol-100 p-2">{site.name}</div>
        <div className="bg-cscol-100 p-2">Unique Computers: {device_list?.devices.length}</div>
        <div className={`${device_list && device_list.rogue_devices === 0 ? "bg-cscol-100" : "bg-errcol-100 text-cscol-100"} p-2`}>Matching Computers: {device_list && (device_list?.devices.length - device_list?.rogue_devices)}</div>
      </div>
      <p className="font-bold text-3xl py-4">Computers</p>
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