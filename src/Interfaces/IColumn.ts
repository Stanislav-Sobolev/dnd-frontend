import {IItem} from './IItem'

export interface IColumn { 
    id: number; 
    title: string; 
    items: IItem[]; 
}