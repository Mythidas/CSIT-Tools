export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center bg-cscol-500">
      <div className="flex justify-center w-1/3 p-10 m-10 shadow-md font-bold text-4xl bg-cscol-100 text-cscol-500 rounded-lg">
        CSIT Tools
      </div>
      <div className="flex flex-col items-center w-1/3 h-full gap-3">
        <a href="/sites" className="text-cscol-100 bg-cscol-400 rounded-md w-full text-center shadow-md py-5 text-2xl">
          Sites
        </a>
        <a href="/reports" className="text-cscol-100 bg-cscol-400 rounded-md w-full text-center shadow-md py-5 text-2xl">
          Reports
        </a>
      </div>
    </main>
  );
}