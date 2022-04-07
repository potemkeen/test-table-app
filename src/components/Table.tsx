import type {} from 'react/next'
import React, { ChangeEvent, useCallback, useMemo, useState, useTransition } from 'react'
import { sortByField, uniq } from '../utils'
import { SortOrder } from '../types'
import { useDebounce } from '../hooks'
import Pagination from './Pagination'
import Highlighted from './Highlighted'
import { BUFFERED_ROWS, MAX_ROWS_PER_PAGE, ROW_HEIGHT, TOLERANCE_ROWS, VIEWPORT_HEIGHT } from '../constants'

export interface ColumnProps {
    field: string
    title: string
    sortable?: boolean
    filter?: boolean
    className?: string
}

interface TableProps {
    rows: any[] | null
    columns: ColumnProps[]
    idField?: string
}

interface SortState {
    field: string
    order: SortOrder
}

interface ColumnFilterState {
    [key: string]: string
}

const Table: React.FC<TableProps> = ({ rows, columns, idField = 'id' }) => {
    const [sorting, setSorting] = useState<SortState | null>(null)
    const [scrollOffset, setScrollOffset] = useState(0)
    const [, startTransition] = useTransition()
    const [input, setInput] = useState('')
    const [filterInput, setFilterInput] = useState('')
    const [columnFilter, setColumnFilter] = useState<ColumnFilterState>({})
    const [pageSize, setPageSize] = useState(10000)
    const [itemOffset, setItemOffset] = useState(0)

    const sortData = useCallback((field: string) => {
        if (!sorting || sorting.field !== field) {
            setSorting({ field, order: 'asc' })
            return
        }

        if (sorting.order === 'asc') {
            setSorting({ field, order: 'desc' })
        } else {
            setSorting(null)
        }
    }, [sorting])

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const rowIndex = Math.ceil(e.currentTarget.scrollTop / ROW_HEIGHT)
        const offsetRow = rowIndex - TOLERANCE_ROWS < 0 ? 0 : rowIndex - TOLERANCE_ROWS
        startTransition(() => {
            setScrollOffset(offsetRow)
        })
    }, [])

    const updateFilterInput = useDebounce((value: string) => {
        setFilterInput(value)
    }, 300)

    const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
        updateFilterInput(e.target.value)
    }, [updateFilterInput])

    const handlePageChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value)
        if (value > MAX_ROWS_PER_PAGE) {
            setPageSize(MAX_ROWS_PER_PAGE)
        } else {
            setPageSize(value || 1)
        }
    }, [])

    const filteredData = useMemo(() => {
        if (!rows) return []
        if (!filterInput) return rows
        return rows.filter((row) => {
            const value = String(filterInput).toLowerCase()
            return Object.values(row).some(v => String(v).toLowerCase().includes(value))
        })
    }, [rows, filterInput])

    const filteredByColumnData = useMemo(() => {
        return filteredData.filter((row) => Object.entries(columnFilter).every((filter) => {
            if (!filter[1]) return true
            return row[filter[0]] === filter[1]
        }))
    }, [columnFilter, filteredData])

    const sortedData = useMemo(() => {
        if (!sorting) return filteredByColumnData
        return sortByField(filteredByColumnData, sorting.field, sorting.order)
    }, [filteredByColumnData, sorting])

    const totalPages = useMemo(() => Math.max(Math.ceil(filteredByColumnData.length / pageSize), 1), [filteredByColumnData, pageSize])

    const paginatedData = useMemo(() => {
        console.log('paginated data update')
        const endItemOffset = itemOffset + pageSize

        return sortedData.slice(itemOffset, endItemOffset)
    }, [itemOffset, pageSize, sortedData])

    const virtualizedData = useMemo(() => paginatedData.slice(scrollOffset, scrollOffset + BUFFERED_ROWS), [paginatedData, scrollOffset])

    return (
        <div className="table">
            <div className="table__header">
                <div>
                    <span>Filter</span>{' '}
                    <input
                        type="text"
                        value={input}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <span>Page size</span>{' '}
                    <input
                        type="number"
                        value={pageSize}
                        min={1}
                        max={MAX_ROWS_PER_PAGE}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
            <table>
                <thead>
                <tr>
                    {columns.map((col) => (
                        <th key={col.field} className={col.className}>
                            {col.title}{' '}
                            {sorting?.field === col.field && sorting.order === 'asc' && '↑'}
                            {sorting?.field === col.field && sorting.order === 'desc' && '↓'}
                            {' '}
                            {col.sortable && <button onClick={() => sortData(col.field)}>sort</button>}
                            {col.filter && filteredData && (
                                <select onChange={(e) => {
                                    setColumnFilter(prev => ({ ...prev, [col.field]: e.target.value }))
                                }}>
                                    <option />
                                    {uniq(filteredData.map(row => row[col.field])).map((value) => (
                                        <option value={value} key={value}>{value}</option>
                                    ))}
                                </select>
                            )}
                        </th>
                    ))}
                </tr>
                </thead>
            </table>
            <div className="table__tbody-container" style={{ height: VIEWPORT_HEIGHT }} onScroll={handleScroll}>
                {rows ? (
                    <table>
                        <tbody style={{ height: paginatedData.length * ROW_HEIGHT }}>
                        {virtualizedData.map((row, index) => (
                            <tr key={row[idField]}
                                style={{ height: ROW_HEIGHT, marginTop: index === 0 ? scrollOffset * ROW_HEIGHT : 0 }}>
                                {columns.map((col) => (
                                    <td key={col.field} className={col.className}>
                                        <Highlighted text={row[col.field].toString()} highlight={filterInput} />
                                    </td>
                                ))}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : <h3 style={{ textAlign: 'center' }}>No data</h3>}
            </div>
            <div className="table__footer">
                <Pagination
                    onPageChange={(page) => setItemOffset((page - 1) * pageSize)}
                    pageCount={totalPages}
                />
                <div className="table__count-info">
                    {filteredByColumnData.length ? itemOffset + 1 : 0} to {Math.min(itemOffset + pageSize, filteredByColumnData.length)} of {filteredByColumnData.length}
                </div>
            </div>
        </div>

    )
}

export default Table