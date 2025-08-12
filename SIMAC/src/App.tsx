import { Routes, Route } from 'react-router-dom';
import MainLayout from "./layout/MainLayout.tsx";
//import Sidebar from './components/Sidebar';
import TechnicianView from "./views/TechnicianView/TechnicianView.tsx";
import EquipmentView from "./views/EquipmentView/EquipmentView.tsx";
import AreaView from "./views/AreaView/AreaView.tsx";
import SparePartsView from "./views/SparePartsView/SpareParts.tsx";
import CreateEquipmentView from "./views/EquipmentView/CreateEquipmentView.tsx";
import CreateSparePartsView from "./views/SparePartsView/CreateSparePartsView.tsx";
import CreateAreaView from "./views/AreaView/CreateAreaView.tsx";
import CreateTechnicianView from "./views/TechnicianView/CreateTechnicianView.tsx";
import CreateOrderView from "./views/OrderView/CreateOrderView.tsx";
import OrderReceivedView from "./views/OrderView/OrderReceivedView.tsx"


const App = () => {
    return (
        <MainLayout>
            <Routes>
                <Route path="/tecnicos" element={<TechnicianView />} />
                <Route path="/equipos" element={<EquipmentView />} />
                <Route path="/areas" element={<AreaView />} />
                <Route path="/repuestos" element={<SparePartsView />} />

                {/*<Route path="/ordenes" element={<OrdenesView />} />
                <Route path="/horometros" element={<HorometrosView />} />
                {/* Ruta por defecto */}
                <Route path="*" element={<TechnicianView />} />
                <Route path="/equipment/create" element={<CreateEquipmentView />} />
                <Route path="/area/create" element={<CreateAreaView />} />
                <Route path="/spareParts/create" element={<CreateSparePartsView />} />
                <Route path="/technician/create" element={<CreateTechnicianView />} />
                <Route path="/order/create" element={<CreateOrderView />} />
                <Route path="/order/received" element={<OrderReceivedView />} />
            </Routes>
        </MainLayout>
    );

}

export default App;

/**
 *
 *  return (
 *         <MainLayout>
 *             <TechnicianView />
 *         </MainLayout>
 *     );
 */