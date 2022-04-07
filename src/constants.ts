import { Gender } from './types'
import { ColumnProps } from './components/Table'

export const ROW_HEIGHT = 50
export const VISIBLE_ROWS = 10
export const VIEWPORT_HEIGHT = VISIBLE_ROWS * ROW_HEIGHT
export const TOLERANCE_ROWS = 5
export const BUFFERED_ROWS = TOLERANCE_ROWS * 2 + VISIBLE_ROWS
export const MAX_CONTAINER_HEIGHT = 32000000
export const MAX_ROWS_PER_PAGE = MAX_CONTAINER_HEIGHT / ROW_HEIGHT

export const genders: Gender[] = ['male', 'female']
export const names = {
    male: ['Liam', 'Noah', 'Oliver', 'Elijah', 'William', 'James', 'Benjamin', 'Lucas', 'Henry', 'Alexander'],
    female: ['Olivia', 'Emma', 'Ava', 'Charlotte', 'Sophia', 'Amelia', 'Isabella', 'Mia', 'Evelyn', 'Harper'],
}
export const lastnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez']

export const columns: ColumnProps[] = [
    { field: 'id', title: 'ID', sortable: true, className: 'small-col' },
    { field: 'gender', title: 'Gender', sortable: true, filter: true  },
    { field: 'name', title: 'Name', sortable: true, filter: true },
    { field: 'lastname', title: 'Lastname', sortable: true, filter: true  },
]
