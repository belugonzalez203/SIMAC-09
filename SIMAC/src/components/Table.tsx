import React from 'react';
import styles from '../styles/Table.module.css';

interface TableProps {
    rows: Array<Record<string, any>>;
    enumeration?: boolean;
    className?: string;
    onRowClick?: (row: Record<string, any>) => void;
}

const Table: React.FC<TableProps> = ({
                                         rows,
                                         enumeration = true,
                                         className = '',
                                         onRowClick,
                                     }) => {
    if (!rows || rows.length === 0) {
        return <div>No existen datos</div>;
    }

    const headers = Object.keys(rows[0]);

    return (
        <div className={`${styles.tableContainer}`}>
            <table className={`${styles.table} ${className}`}>
                <thead>
                <tr>
                    {enumeration && <th>#</th>}
                    {headers.map((key, idx) => (
                        <th key={`header-${idx}`}>{key}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {rows.map((row, idx) => (
                    <tr
                        key={`row-${idx}`}
                        onClick={() => onRowClick?.(row)}
                        className={onRowClick ? styles.clickableRow : ''}
                    >
                        {enumeration && <td>{idx + 1}</td>}
                        {headers.map((key) => (
                            <td key={`cell-${idx}-${key}`}>{row[key] ?? '-'}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;
