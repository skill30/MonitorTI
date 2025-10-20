import Header from "../Main/Header";
import Sidebar from "../Main/Sidebar";
import GraficoVLAN from "../Main/GraficoVLAN";
import GraficoBar from "../Main/GraficoBar";
import GraficoLinea from "../Main/GraficoLinea";
import GraficoEquipos from "../Main/GraficoEquipos";

export default function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen bg-gray-100">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6 auto-rows-[40vh]">
         <GraficoVLAN />
         <GraficoBar />
         <GraficoLinea />
         <GraficoEquipos />
       </main>
      </div>
    </div>
  );
}
