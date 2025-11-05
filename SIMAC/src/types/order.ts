export type Order = {
    id_order: number;
    id_tech: number;
    id_equip: number;
    id_class: number;
    id_type: number;
    priority: string;
    work_requested: string;
    date_delivery: string | null;
    code_equip?: string;
    name_equip?: string;
    name_area?: string;
    code_tech?: string;
    name_tech?: string;
};