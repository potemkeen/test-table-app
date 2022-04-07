import React from 'react'

export interface ColumnProps {
    field: string
    title: string
}

type TableRow = {
    id: string | number
}

interface TableProps<T> {
    rows: T[] | null
    columns: ColumnProps[]
}

function Table<T> ({ }: TableProps<T extends TableRow>) {
    return (
        <div style={{ height: '500px', overflow: 'scroll' }}>
            <table>
                <thead>
                <tr>
                    {columns.map((col) => <th>{col.title}</th>)}
                </tr>
                </thead>
                <tbody>
                {rows ? rows.slice(0, 2500).map((row) => (
                    <tr key={row.id}>
                        {columns.map((col) => <td>{row.qwe}</td>)}
                    </tr>
                )) : <h3 style={{ textAlign: 'center' }}>No data provided</h3>}
                </tbody>
            </table>
        </div>
    )
}

export default Table