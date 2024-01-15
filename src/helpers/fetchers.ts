import axios from "axios"
import {IItem} from "../Interfaces/IItem"
import {IBoard} from "../Interfaces/IBoard"

axios.defaults.baseURL = 'http://localhost:3000';


export const getBoardById = async (boardId: string): Promise<IBoard> => {
    const res = await axios.get(`/board/${boardId}`);
    const boardData: IBoard = res.data;
    
    return boardData;
};


export const createBoard = async (boardData: IBoard): Promise<IBoard> => {
    const res = await axios.post('/board', boardData);
    const board: IBoard = res.data;
    
    return board;    
};

export const updateBoardName = async (boardId: string, name: string): Promise<IBoard> => {
    const res = await axios.put(`/board/${boardId}`, {name});
    const boardData: IBoard = res.data;
    
    return boardData;
};

export const deleteBoard = async (boardId: string): Promise<IBoard> => {
    const res = await axios.delete(`/board/${boardId}`);
    const boardData: IBoard = res.data;
    
    return boardData;
};

export const createCard = async (boardId: string, columnId: number, cardData: IItem): Promise<IItem> => {
    const res = await axios.post(`/card/${boardId}/${columnId}`, cardData);
    const boardData: IItem = res.data;
    
    return boardData;
};

export const updateCard = async (boardId: string, columnId: number, cardId: number, updatedData: IItem): Promise<IItem> => {
    const res = await axios.put(`/card/${boardId}/${columnId}/${cardId}`, updatedData);
    const boardData: IItem = res.data;
    
    return boardData;
};

export const deleteCard = async (boardId: string, columnId: number, cardId: number): Promise<IItem> => {
    const res = await axios.delete(`/card/${boardId}/${columnId}/${cardId}`);
    const boardData: IItem = res.data;
    
    return boardData;
};
