"use client"

import SophosClient from "./lib/SophosClient";
import { useEffectOnce } from "./lib/hooks/useEffectOnce";

export default function Home() {
  useEffectOnce(() => {
    let client: SophosClient = new SophosClient;
    client.get_devices();
  }, []);



  return (
    <main className="flex h-screen flex-col items-center bg-cscol-500">
      <div className="flex justify-center w-1/3 p-10 m-10 shadow-md font-bold text-4xl bg-cscol-100 text-cscol-500 rounded-lg">
        CSIT Tools
      </div>
      <div className="flex items-center justify-center w-1/3">
        <a href="/computers" className="text-cscol-100 bg-cscol-400 rounded-md w-full text-center shadow-md py-5 text-2xl">
          Computers
        </a>
      </div>
    </main>
  );
}