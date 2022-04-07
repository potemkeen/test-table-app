export type SortOrder = 'asc' | 'desc'

export type Gender = 'male' | 'female'

export interface IUser {
    id: number
    name: string
    lastname: string
    gender: Gender
}
