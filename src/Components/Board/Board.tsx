import { useState, useEffect, DragEvent } from 'react';

import { Card } from '../Card/Card';
import cardEmptyTemplate from '../../assets/json/cardEmptyTemplate.json';
import { ICard, IColumn } from '../../Interfaces';
import styles from './Board.module.scss';
import { Plus } from '../Icons';
import { IBoard } from '../../Interfaces/IBoard';
import { createCard } from '../../helpers/fetchers';

type Props = {
  boardData: IBoard; 
  nameBoard: string;
  fetchBoard: () => Promise<void>;
};

export const Board = ({boardData, nameBoard, fetchBoard}: Props) => {
  const { id: boardId, columnsData } = boardData;

  const [columns, setColumns] = useState<IColumn[]| null>(null);
  const [currentColumn, setCurrentColumn] = useState<IColumn | null>(null);
  const [currentCard, setCurrentCard] = useState<ICard | null>(null);

  useEffect(() => {
    setColumns(columnsData);
  }, [columnsData]);
  
  const dragOverHandler = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
  };

  const dropCardHandler = (e: DragEvent<HTMLDivElement>, column: IColumn): void => {
    e.preventDefault();  

    if (currentCard && currentColumn && columns) {
      column.items.push(currentCard);
      const currentIndex = currentColumn.items.indexOf(currentCard);
      currentColumn.items.splice(currentIndex, 1);

      setColumns(columns.map(el =>{
        if (el.id === column.id) {
          return column
        }
        if (el.id === currentColumn.id) {
          return currentColumn
        }
        return el;

      }))
      
    }
    const target = e.target as HTMLDivElement;
    target.style.boxShadow = 'none';
  };

  const addCardHandler = async (column: IColumn): Promise<void> => {

    await createCard(boardId, column.id, cardEmptyTemplate);
    await fetchBoard();

    // setColumns((prevColumns) => {
    //   if (!prevColumns) return prevColumns;

    //   return prevColumns.map((col) =>
    //     col.id === column.id
    //       ? {
    //           ...col,
    //           items: [
    //             ...col.items,
    //             { id: Date.now(), text: 'text', description: 'description' },
    //           ],
    //         }
    //       : col
    //   );
    // });
  }

  return (
    <div className={styles.board}>
      <h1 className={styles.boardName}>{nameBoard}</h1>
      <div className={styles.columns}>
        {columns && columns.map(column => 
          <div className={styles.columnWrapper}>
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
                  fetchBoard={fetchBoard}
                  setCurrentColumn={setCurrentColumn}
                  setCurrentCard={setCurrentCard}
                  setColumns={setColumns}
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
