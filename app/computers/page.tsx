'use client'

import Dropdown from "../components/Dropdown";
import VSAXClient from "../lib/VSAXClient";

export default function Computers() {
  async function on_click() {
    let vsa: VSAXClient = new VSAXClient;
    const sites = await vsa.get_sites();
  }

  return (
    <main className="flex h-screen flex-col items-center bg-bgcol-100">
      { /* Nav Bar */ }
      <div className="flex justify-between w-full p-5 font-bold text-2xl text-accol-100 bg-bgcol-300">
        <div>
          <Dropdown />
        </div>
        <div>
          <a href="/">
            Home
          </a>
        </div>
      </div>
      { /* Body */ }
      <div className="flex w-full h-full">
        { /* Side Bar */ }
        <div className="flex items-center flex-col w-2/12 h-full py-5 px-10 bg-bgcol-200">
          Side Bar
        </div>
        { /* Main Page */ }
        <div className="py-5 px-10 w-full h-full shadow-[inset_0_-2px_4px_rgba(0,0,0,0.6)]">
          Main Page
        </div>
      </div>
    </main>
  );
}