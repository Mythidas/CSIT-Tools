'use client'

import { useRef, useState } from "react";
import AgentClient from "../lib/AgentClient";
import Dropdown, { DropdownItem } from "../lib/components/Dropdown";
import Overview from "./Overview";
import { useEffectOnce } from "../lib/hooks/useEffectOnce";
import { Site } from "../lib/interfaces/agent/site";

export default function Computers() {
  const [site_list, set_site_list] = useState<DropdownItem[]>([]);
  const [selected_tab, set_selected_tab] = useState<string>("Overview");
  const [selected_site, set_selected_site] = useState<Site | undefined>(undefined);

  const agent_client = useRef<AgentClient>(new AgentClient);

  useEffectOnce(() => {
    // Load site information to populate dropdown list
    function convert_vsax_client_list_to_dropdown(sites: Site[]): DropdownItem[] {
      let covnvert_list: DropdownItem[] = [];
      for (let i = 0; i < sites.length; i++) {
        covnvert_list.push({ label: sites[i].name, id: sites[i].vsa_id.toString() });
      }
      return covnvert_list;
    }
    
    async function load_sites() {
      const vsa_site_list = await agent_client.current.get_sites();
      if (vsa_site_list) set_site_list(convert_vsax_client_list_to_dropdown(vsa_site_list));
    }

    load_sites();
  }, [])

  async function on_site_changed(item: DropdownItem) {
    set_selected_site((await agent_client.current.get_sites()).find(site => site.name === item.label));
  }

  function on_tab_selected(tab: string) {
    set_selected_tab(tab);
  }

  return (
    <main className="flex h-screen overflow-hidden flex-col items-center bg-cscol-500">
      { /* Nav Bar */ }
      <div className="flex justify-between w-full h-20 p-3 font-bold text-2xl text-accol-100 bg-cscol-200 text-cscol-100">
        <div>
          <Dropdown items={site_list} on_item_changed={on_site_changed} />
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
          <li className={`p-5 w-full text-center shadow-md cursor-pointer hover:bg-cscol-300 ${selected_tab === "Overview" && "bg-cscol-400 text-cscol-100 hover:bg-cscol-400"}`} onClick={() => on_tab_selected("Overview")}>
            Overview
          </li>
        </ul>
        { /* Main Page */ }
        <div className="py-5 px-10 w-full h-full shadow-[inset_0_-2px_6px_rgba(0,0,0,0.4)]">
          {selected_tab === "Overview" && <Overview agent={agent_client.current} site={selected_site} />}
        </div>
      </div>
    </main>
  );
}