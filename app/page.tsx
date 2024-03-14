export default function Home() {
  return (
    <main className="flex h-screen flex-col items-center bg-bgcol-300">
      <div className="flex justify-center w-1/3 p-10 m-10 shadow-md font-bold text-4xl bg-bgcol-200 rounded-lg">
        CSIT Tools
      </div>
      <div className="flex items-center justify-center w-1/3">
        <a href="/computers" className="text-accol-100 bg-bgcol-200 rounded-md w-full text-center shadow-md py-5 text-2xl">
          Computers
        </a>
      </div>
    </main>
  );
}