import { IUser, SortOrder } from './types'
import { genders, lastnames, names } from './constants'

export function sortByField<T> (arr: T[], field: keyof T, order: SortOrder = 'asc'): T[] {
    return [...arr].sort((a, b) => {
        const sortOrder = order === 'asc' ? 1 : -1
        return a[field] > b[field] ? sortOrder : a[field] < b[field] ? -sortOrder : 0
    })
}

export function uniq<T>  (arr: T[]): T[] {
    return Array.from(new Set(arr))
}

export const generate = (num: number): IUser[] => {
    const records = []
    for (let i = 0; i < num * 1000; i++) {
        const gender = genders[Math.floor(Math.random() * genders.length)]
        records.push({
            id: i + 1,
            gender,
            name: names[gender][Math.floor(Math.random() * names[gender].length)],
            lastname: lastnames[Math.floor(Math.random() * lastnames.length)],
        })
    }

    return records
}
