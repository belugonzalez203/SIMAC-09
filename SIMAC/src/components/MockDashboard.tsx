
import { areas, technicians, equipment, spareParts } from "../mocks/data";

export const MockDashboard = () => {
    return (
        <div className="pt-20 space-y-8">
            <section>
                <h2 className="text-xl font-bold mb-2">Áreas</h2>
                <ul className="list-disc pl-4">
                    {areas.map(area => (
                        <li key={area.id_area}>{area.name_area}</li>
                    ))}
                </ul>
                <div className="bg-red-500 text-white p-4">
                    Tailwind está funcionando
                </div>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-2">Técnicos</h2>
                <ul className="list-disc pl-4">
                    {technicians.map(t => (
                        <li key={t.id_tech}>
                            {t.name_tech} – {t.contact_tech} (Área: {areas.find(a => a.id_area === t.area_id)?.name_area})
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-2">Equipos</h2>
                <ul className="list-disc pl-4">
                    {equipment.map(eq => (
                        <li key={eq.id_equipment}>
                            {eq.name_equipment} – Datos: {eq.brand} ({eq.model} - {eq.chassis})
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2 className="text-xl font-bold mb-2">Repuestos</h2>
                <ul className="list-disc pl-4">
                    {spareParts.map(r => (
                        <li key={r.id}>
                            {r.name} – Cantidad: {r.quantity}
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
};
