import { useState, useEffect, DragEvent } from 'react';
import '../App.css';
import { Item } from './Item';

import { IItem, IColumn } from '../Interfaces';

type Props = { 
  columnsData: IColumn[];
  };

export const Columns = ({ columnsData }: Props) => {
  const [columns, setColumns] = useState<IColumn[]>([
        { id: 1, title: 'To Do', items: [{id: 1, text: 'ToDo 1'}, {id: 2, text: 'ToDo 2'}]},
        { id: 2, title: 'In Progress', items: [{id: 3, text: 'InProgress 1'}, {id: 4, text: 'InProgress 2'}]},
        { id: 3, title: 'Done', items: [{id: 5, text: 'Done 1'}, {id: 6, text: 'Done 2'}]}
      ]);

  const [currentColumn, setCurrentColumn] = useState<IColumn | null>(null);
  const [currentItem, setCurrentItem] = useState<IItem | null>(null);

  useEffect(() => {
    setColumns(columnsData);
  }, []);
  
  function dragOverHandler(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    

    if (target.className === 'item'){
      target.style.boxShadow = '0 4px 3px gray';
    }

  };

  function dropCardHandler(e: DragEvent<HTMLDivElement>, column: IColumn): void {
    e.preventDefault();  

    if (currentItem !== null && currentColumn !== null) {
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

  return (
    <>
      {columns.map(column => 
        <div 
          key={column.id}
          className={'column'}
          onDragOver={(e) => dragOverHandler(e)}
          onDrop={(e) => dropCardHandler(e, column)}
        >
          <div className='columnTitle'>{column.title}</div>
          {column.items.map(item => (
            <Item 
              key={item.id}
              item={item} 
              column={column}
              setCurrentColumn={setCurrentColumn}
              setCurrentItem={setCurrentItem}
            />
          ))}
        </div>
        )}
    </>
  );
}
