"use client"

import { useRef, useState } from "react";
import AgentClient from "../lib/AgentClient";
import { useEffectOnce } from "../lib/hooks/useEffectOnce";
import SophosInfo from "./SophosInfo";

export default function Sites() {
  const [selected_tab, set_selected_tab] = useState<string>("Sophos Info");

  const agent_client = useRef<AgentClient>(new AgentClient);

  useEffectOnce(() => {
    async function load_sites() {
      await agent_client.current.get_sites();
    }

    load_sites();
  }, [])

  return (
    <main className="flex h-screen overflow-hidden flex-col items-center bg-cscol-500">
      { /* Nav Bar */ }
      <div className="flex justify-between w-full h-20 p-3 font-bold text-2xl text-accol-100 bg-cscol-200 text-cscol-100">
        <div>
        </div>
        <div className="flex items-center">
          <a className="hover:text-cscol-400" href="/">
            Home
          </a>
        </div>
      </div>
      { /* Body */ }
      <div className="flex w-full h-full">
        { /* Side Bar */ }
        <ul className="flex items-center flex-col w-2/12 h-full bg-cscol-100 text-cscol-500 text-lg font-bold">
          <li className={`p-5 w-full text-center shadow-md cursor-pointer hover:bg-cscol-300 ${selected_tab === "Sophos Info" && "bg-cscol-400 text-cscol-100 hover:bg-cscol-400"}`} onClick={() => set_selected_tab("Sophos Info")}>
            Sophos Info
          </li>
        </ul>
        { /* Main Page */ }
        <div className="py-5 px-10 w-full h-full shadow-[inset_0_-2px_6px_rgba(0,0,0,0.4)]">
          {selected_tab === "Sophos Info" && <SophosInfo agent={agent_client.current} />}
        </div>
      </div>
    </main>
  )
}