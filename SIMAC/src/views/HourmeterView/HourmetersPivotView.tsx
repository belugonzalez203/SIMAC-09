import styles from '../../styles/ListView.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AddHourmeterModal from './AddHourmeterModal';
import { FaEdit} from 'react-icons/fa';
import React from 'react';

interface MaintenanceData {
    id_type_change: number;
    intervalHours: number;
    hourCurrent: number;
    hourChange: number;
    nextHourChange: number;
    hourAlert: number;
}

interface HourmeterRow {
    id_equip: number;
    area: string;
    equipmentCode: string;
    equipmentName: string;
    maintenance: {
        [maintenanceType: string]: MaintenanceData;
    };
}

function HourmetersPivotView() {
    const [hourmeters, setHourmeters] = useState<HourmeterRow[]>([]);
    const [filteredHourmeters, setFilteredHourmeters] = useState<HourmeterRow[]>([]);

    const [searchArea, setSearchArea] = useState('');
    const [searchEquipment, setSearchEquipment] = useState('');

    const [showModal, setShowModal] = useState(false);

    const [editTarget, setEditTarget] = useState<{ equipmentCode: string; maintenanceType: string } | null>(null);
    const [editValue, setEditValue] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3002/hourmeters')
            .then(response => {
                setHourmeters(response.data.data);
                setFilteredHourmeters(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching hourmeters:', error);
            });
    }, []);

    useEffect(() => {
        const filtered = hourmeters.filter((row) =>
            (row.area ?? '').toLowerCase().includes(searchArea.toLowerCase()) &&
            (
                (row.equipmentName ?? '').toLowerCase().includes(searchEquipment.toLowerCase()) ||
                (row.equipmentCode ?? '').toLowerCase().includes(searchEquipment.toLowerCase())
            )
        );
        setFilteredHourmeters(filtered);
    }, [searchArea, searchEquipment, hourmeters]);

    const groupedByArea = filteredHourmeters.reduce((acc, row) => {
        if (!acc[row.area]) acc[row.area] = [];
        acc[row.area].push(row);
        return acc;
    }, {} as Record<string, HourmeterRow[]>);

    const maintenanceTypes = Array.from(
        new Set(
            filteredHourmeters.flatMap(row => Object.keys(row.maintenance))
        )
    );

    const handleSave = async (equipmentCode: string, maintenanceType: string) => {
        try {
            const currentRow = hourmeters.find(h => h.equipmentCode === equipmentCode);
            if (!currentRow) {
                alert('Equipo no encontrado');
                return;
            }

            const id_equip = currentRow.id_equip;
            const maintenanceEntry = Object.entries(currentRow.maintenance).find(([key]) => key === maintenanceType);
            if (!maintenanceEntry) {
                alert('Tipo de mantenimiento no encontrado');
                return;
            }
            console.log('currentRow', currentRow);
            const { id_type_change } = maintenanceEntry[1] as any;
            const hour_current = parseInt(editValue);

            if (isNaN(hour_current) || hour_current < 0) {
                alert('Ingrese un número válido para las horas actuales.');
                return;
            }
            console.log('maintenanceEntry', maintenanceEntry);
            console.log({
                id_equip,
                id_type_change,
                hour_current,
            });

            await axios.put('http://localhost:3002/hourmeters', {
                id_equip,
                id_type_change,
                hour_current,
            });

            setEditTarget(null);
            setEditValue('');

            // Refrescar datos
            const res = await axios.get('http://localhost:3002/hourmeters');
            setHourmeters(res.data.data);
            setFilteredHourmeters(res.data.data);

        } catch (err) {
            console.error('Error al guardar:', err);
            alert('No se pudo guardar el cambio.');
        }
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>CONTROL DE HORÓMETROS</h2>
            <div className={styles.actions}>
                <input
                    type="text"
                    placeholder="Buscar por área"
                    value={searchArea}
                    onChange={(e) => setSearchArea(e.target.value)}
                    className={styles.searchInput}
                />
                <input
                    type="text"
                    placeholder="Buscar por equipo"
                    value={searchEquipment}
                    onChange={(e) => setSearchEquipment(e.target.value)}
                    className={styles.searchInput}
                />
                <button
                    onClick={() => setShowModal(true)}
                    className={styles.createButton}
                >
                    Nuevo Horómetro
                </button>
            </div>
            <AddHourmeterModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSuccess={() => {
                    setShowModal(false);
                    axios.get('http://localhost:3002/hourmeters')
                        .then(res => {
                            setHourmeters(res.data.data);
                            setFilteredHourmeters(res.data.data);
                        });
                }}
            />

            {Object.keys(groupedByArea).map(areaName => (
                <div key={areaName} style={{ marginBottom: '2rem' }}>
                    <h3 style={{ margin: '2rem 0 1rem', color: '#2c3e50', fontWeight: 'bold' }}>
                        ÁREA: {areaName}
                    </h3>
                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                            <tr>
                                <th style={{ borderRight: "solid", borderRightColor: "darkgray" }}>Equipo</th>
                                {maintenanceTypes.map(type => (
                                    <th key={type} colSpan={5} style={{ textAlign: "center", borderRight: "solid", borderRightColor: "darkgray" }}>{type}</th>
                                ))}

                            </tr>
                            <tr>

                                <th style={{ borderRight: "solid", borderRightColor: "darkgray" }}></th>

                                {maintenanceTypes.map(type => (
                                    <React.Fragment key={`thead-${type}`}>
                                        <th style={{ borderLeft: "solid", borderLeftColor: "darkgray" }}>Editar</th>
                                        {['Horas Actual', 'Cambio', 'Próx. Cambio', 'Alerta'].map((sub, idx) => (
                                            <th key={`${type}-${idx}`}>{sub}</th>
                                        ))}
                                    </React.Fragment>
                                ))}


                            </tr>
                            </thead>
                            <tbody>
                            {groupedByArea[areaName].map((row, index) => (
                                <tr key={index}>
                                    <td style={{ borderRight: "solid", borderRightColor: "darkgray" }}>
                                        {row.equipmentCode} {row.equipmentName}
                                    </td>

                                    {maintenanceTypes.map(type => {
                                        const m = row.maintenance[type];
                                        const isEditing = editTarget?.equipmentCode === row.equipmentCode && editTarget?.maintenanceType === type;

                                        return m ? (
                                            <React.Fragment key={`thead-${type}`}>
                                                <td style={{ textAlign: 'center' }}>
                                                    <FaEdit
                                                        className={styles.editIcon}
                                                        onClick={() => {
                                                            setEditTarget({ equipmentCode: row.equipmentCode, maintenanceType: type });
                                                            setEditValue(m.hourCurrent.toString());
                                                        }}
                                                        style={{ cursor: 'pointer' }}
                                                    />
                                                </td>

                                                {/* Celda editable de hourCurrent */}
                                                <td>
                                                    {isEditing ? (
                                                        <input
                                                            type="number"
                                                            value={editValue}
                                                            onChange={e => setEditValue(e.target.value)}
                                                            onKeyDown={e => { if (e.key === 'Enter') handleSave(row.equipmentCode, type); }}
                                                            onBlur={() => handleSave(row.equipmentCode, type)}
                                                            style={{ width: '60%', textAlign: 'center',  }}
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        m.hourCurrent
                                                    )}
                                                </td>
                                                <td>{m.hourChange}</td>
                                                <td>{m.nextHourChange}</td>
                                                <td
                                                    style={{
                                                        borderRight: "solid",
                                                        borderRightColor: "darkgray",
                                                        color: m.hourAlert <= 36 ? "red" : undefined,
                                                        fontWeight: m.hourAlert <= 36 ? "bold" : undefined
                                                    }}
                                                >
                                                    {m.hourAlert}
                                                </td>
                                            </React.Fragment>
                                        ) : (
                                            <>
                                                <td colSpan={5} style={{ textAlign: 'center', color: '#999' }}>-</td>
                                            </>
                                        );
                                    })}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default HourmetersPivotView;
