import { useState, useEffect, DragEvent, Dispatch, SetStateAction } from 'react';

import { Card } from '../Card/Card';
import cardEmptyTemplate from '../../assets/json/cardEmptyTemplate.json';
import { ICard, IColumn } from '../../Interfaces';
import styles from './Board.module.scss';
import { Plus } from '../Icons';
import { IBoard } from '../../Interfaces/IBoard';
import { createCard, dndCard } from '../../helpers/fetchers';

type Props = {
  boardData: IBoard; 
  nameBoard: string;
  failFetchCallback: () => void;
  setBoardData: Dispatch<SetStateAction<IBoard | null>>;
};

export const Board = ({boardData, nameBoard, failFetchCallback, setBoardData}: Props) => {
  const { id: boardId, columnsData } = boardData;

  const [columns, setColumns] = useState<IColumn[]| null>(null);
  const [currentColumn, setCurrentColumn] = useState<IColumn | null>(null);
  const [currentCard, setCurrentCard] = useState<ICard | null>(null);
  const [hoveredCard, setHoveredCard] = useState<ICard | null>(null);

  useEffect(() => {
    setColumns(columnsData);
  }, [columnsData]);
  
  const dragOverHandler = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  const dropCardHandler = async (e: DragEvent<HTMLDivElement>, column: IColumn): Promise<void> => {
    e.preventDefault();
    
    if (currentCard && currentColumn && columns && hoveredCard) {
      const dropIndex = column.items.indexOf(hoveredCard);
      
      setBoardData((board: IBoard | null) => {
        if (board) {
          
          const columnFrom: IColumn | undefined = board.columnsData.find((col) => col.id === currentColumn.id);
          const columnTo: IColumn | undefined = board.columnsData.find((col) => col.id === column.id);
          
          if (columnFrom && columnTo) {
            const currentCardIndex = columnFrom.items.indexOf(currentCard);
            columnFrom.items.splice(currentCardIndex, 1);

            columnTo.items.splice(dropIndex + 1, 0, currentCard);
            
            return {...board};
          }
        }
        return board;
      });

      
      dndCard(boardId, currentColumn.id, currentCard.id, column.id, dropIndex + 1, failFetchCallback);
    }

    const target = e.target as HTMLDivElement;
    target.style.boxShadow = 'none';
  };

  const addCardHandler = async (column: IColumn): Promise<void> => {
    const emptyCard: ICard = { ...cardEmptyTemplate, id: Date.now() };

    setBoardData((board: IBoard | null) => {
      if (board) {
        
        const foundColumn: IColumn | undefined = board.columnsData.find((col) => col.id === column.id);
        
        if (foundColumn) {
          foundColumn.items.push(emptyCard);
          
          return {...board};
        }
      }
      return board;
    });

    createCard(boardId, column.id, emptyCard, failFetchCallback);
  }

  return (
    <div className={styles.board}>
      <h1 className={styles.boardName}>{nameBoard}</h1>
      <div className={styles.columns}>
        {columns && columns.map(column => 
          <div key={column.id} className={styles.columnWrapper}>
            <h2 className={styles.columnTitle}>{column.title}</h2>
            <div 
              key={column.id}
              className={styles.column}
              onDragOver={(e) => dragOverHandler(e)}
              onDrop={(e) => dropCardHandler(e, column)}
            >
              
              {column.items.map(item => (
                <Card 
                  key={item.id}
                  card={item} 
                  column={column}
                  boardId={boardId}
                  failFetchCallback={failFetchCallback}
                  setCurrentColumn={setCurrentColumn}
                  setCurrentCard={setCurrentCard}
                  setHoveredCard={setHoveredCard}
                  setColumns={setColumns}
                  setBoardData={setBoardData}
                />
              ))}
              <div 
                className={styles.plusWrapper}
                onClick={() => addCardHandler(column)}
              >
                <Plus className={styles.plusIcon}/>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
