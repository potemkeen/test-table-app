import React, { useEffect, useState } from 'react'

import Table from './components/Table'
import { IUser } from './types'
import { generate } from './utils'
import { columns } from './constants'

const App: React.FC = () => {
    const [records, setRecords] = useState<IUser[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        updateData()
    }, [])

    const updateData = () => {
        setLoading(true)
        setRecords([])
        setTimeout(() => {
            setRecords(generate(1000))
            setLoading(false)
        }, 0)
    }

    console.log('Rerender App')

    return (
        <div className="App">
            <button onClick={updateData}>{loading ? 'Loading...' : 'Generate new rows'}</button>
            <Table rows={records} columns={columns} />
        </div>
    )
}

export default App
