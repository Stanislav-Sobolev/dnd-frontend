import { useState, useEffect, DragEvent } from 'react';

import { Item } from '../Item/Item';
import { IItem, IColumn } from '../../Interfaces';
import styles from './Board.module.scss';
import { Plus } from '../Icons';
import { IBoard } from '../../Interfaces/IBoard';

type Props = {
  boardData: IBoard; 
};

export const Board = ({boardData}: Props) => {
  const { columnsData } = boardData;

  const [columns, setColumns] = useState<IColumn[]| null>(null);
       

  const [currentColumn, setCurrentColumn] = useState<IColumn | null>(null);
  const [currentItem, setCurrentItem] = useState<IItem | null>(null);

  useEffect(() => {
    setColumns(columnsData);
  }, [columnsData]);
  
  function dragOverHandler(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
  };

  function dropCardHandler(e: DragEvent<HTMLDivElement>, column: IColumn): void {
    e.preventDefault();  

    if (currentItem && currentColumn && columns) {
      column.items.push(currentItem);
      const currentIndex = currentColumn.items.indexOf(currentItem);
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

function addCardHandler(column: IColumn): void {
  setColumns((prevColumns) => {
    if (!prevColumns) return prevColumns;

    return prevColumns.map((col) =>
      col.id === column.id
        ? {
            ...col,
            items: [
              ...col.items,
              { id: Date.now(), text: 'text', description: 'description' },
            ],
          }
        : col
    );
  });
}


  return (
    <div className={styles.columnWrapper}>
      {columns && columns.map(column => 
        <div 
          key={column.id}
          className={styles.column}
          onDragOver={(e) => dragOverHandler(e)}
          onDrop={(e) => dropCardHandler(e, column)}
        >
          <div className={styles.columnTitle}>{column.title}</div>
          {column.items.map(item => (
            <Item 
              key={item.id}
              item={item} 
              column={column}
              setCurrentColumn={setCurrentColumn}
              setCurrentItem={setCurrentItem}
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
        )}
    </div>
  );
};
