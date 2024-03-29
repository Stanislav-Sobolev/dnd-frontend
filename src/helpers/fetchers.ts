import axios from "axios"
import {ICard} from "../Interfaces/ICard"
import {IBoard} from "../Interfaces/IBoard"

axios.defaults.baseURL = 'https://dnd-te37.onrender.com';


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

export const updateBoardName = async (boardId: string, name: string, failCallback: ()=>void): Promise<IBoard | undefined> => {
  try {
    const res = await axios.put(`/board/${boardId}`, {name});
    const boardData: IBoard = res.data;
    
    return boardData;
  } catch (error) {
    failCallback && failCallback();
  }
};

export const deleteBoard = async (boardId: string, failCallback: ()=>void): Promise<IBoard | undefined> => {
  try {
    const res = await axios.delete(`/board/${boardId}`);
    const boardData: IBoard = res.data;
    
    return boardData;
  } catch (error) {
    failCallback && failCallback();
  }
};

export const createCard = async (boardId: string, columnId: number, cardData: ICard, failCallback: ()=>void): Promise<ICard | undefined> => {
  try {
    const res = await axios.post(`/card/${boardId}/${columnId}`, cardData);
    const boardData: ICard = res.data;
      
    return boardData;
  } catch (error) {
    failCallback && failCallback();
  }
};

export const updateCard = async (boardId: string, columnId: number, cardId: number, updatedData: ICard, failCallback: ()=>void): Promise<ICard | undefined> => {
  try {
    const res = await axios.put(`/card/${boardId}/${columnId}/${cardId}`, updatedData);
    const boardData: ICard = res.data;
      
    return boardData;
  } catch (error) {
    failCallback && failCallback();
  } 
};

export const dndCard = async (
    boardId: string, 
    columnId: number, 
    cardId: number,
    toColumnId: number, 
    toCardIndexId: number,
    failCallback: ()=>void
    ): Promise<ICard | undefined> => {
      try {
        const res = await axios.patch(`/card/${boardId}/${columnId}/${cardId}/${toColumnId}/${toCardIndexId}`);
        const boardData: ICard = res.data;
        
        return boardData;
      } catch (error) {
        failCallback && failCallback();
      }
};

export const deleteCard = async (boardId: string, columnId: number, cardId: number, failCallback: ()=>void): Promise<ICard | undefined> => {
  try {
    const res = await axios.delete(`/card/${boardId}/${columnId}/${cardId}`);
    const boardData: ICard = res.data;
    
    return boardData;
  } catch (error) {
    failCallback && failCallback();
  }
};
