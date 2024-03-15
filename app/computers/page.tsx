'use client'

import { useRef, useState } from "react";
import VSAXClient from "../lib/VSAXClient";
import Dropdown, { DropdownItem } from "../lib/components/Dropdown";
import Overview from "./Overview";
import Detailed from "./Detailed";
import { useEffectOnce } from "../lib/hooks/useEffectOnce";
import { Site } from "../lib/interfaces/vsax/site";

export default function Computers() {
  const [site_list, set_site_list] = useState<DropdownItem[]>([]);
  const [selected_tab, set_selected_tab] = useState<string>("Overview");

  const vsax_client = useRef<VSAXClient>(new VSAXClient);

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
      const vsa_site_list = await vsax_client.current.get_sites();
      set_site_list(convert_vsax_client_list_to_dropdown(vsa_site_list));
    }

    load_sites();
  }, [])

  function on_site_changed(item: DropdownItem) {
    console.log(item.id);
  }

  function on_tab_selected(tab: string) {
    set_selected_tab(tab);
  }

  return (
    <main className="flex h-screen flex-col items-center bg-cscol-500">
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
          <li className={`p-5 w-full text-center shadow-md cursor-pointer hover:bg-cscol-300 ${selected_tab === "Detailed" && "bg-cscol-400 text-cscol-100 hover:bg-cscol-400"}`} onClick={() => on_tab_selected("Detailed")}>
            Detailed
          </li>
        </ul>
        { /* Main Page */ }
        <div className="py-5 px-10 w-full h-full shadow-[inset_0_-2px_6px_rgba(0,0,0,0.4)]">
          {selected_tab === "Overview" && <Overview />}
          {selected_tab === "Detailed" && <Detailed />}
        </div>
      </div>
    </main>
  );
}