export default function Overview() {
  return (
    <div>
      <p className="font-bold text-3xl pb-4">Summary</p>
      <div className="grid grid-flow-col auto-cols-max gap-1 text-cscol-500 font-bold text-xl">
        <div className="bg-cscol-100 p-2">Site Name</div>
        <div className="bg-cscol-100 p-2">Unique Computers: 12</div>
        <div className="bg-cscol-100 p-2">Matching Computers: 11</div>
      </div>
      <p className="font-bold text-3xl py-4">Computers</p>
      <div className="grid grid-cols-3 gap-1 text-cscol-500 text-center">
        <div className="bg-cscol-200 text-cscol-100 p-1 text-xl font-bold">Name</div>
        <div className="bg-cscol-200 text-cscol-100 p-1 text-xl font-bold">VSAX</div>
        <div className="bg-cscol-200 text-cscol-100 p-1 text-xl font-bold">Sophos</div>
        <div className="bg-cscol-100 p-1 text-xl font-bold">PC1</div>
        <div className="bg-cscol-100 p-1 text-xl font-bold">YES</div>
        <div className="bg-cscol-100 p-1 text-xl font-bold">NO</div>
        <div className="bg-cscol-300 p-1 text-xl font-bold">PC2</div>
        <div className="bg-cscol-300 p-1 text-xl font-bold">YES</div>
        <div className="bg-cscol-300 p-1 text-xl font-bold">YES</div>
      </div>
    </div>
  )
}