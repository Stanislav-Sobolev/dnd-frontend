import { Dispatch, SetStateAction,DragEvent } from 'react';

import { IItem, IColumn } from '../Interfaces';
import '../App.css';

type Props = { 
  item: IItem; 
  column: IColumn;
  setCurrentColumn: Dispatch<SetStateAction<IColumn | null>>;
  setCurrentItem: Dispatch<SetStateAction<IItem | null>>;
  };

export const Item = ({ item, column, setCurrentColumn, setCurrentItem }: Props) => {
  const {id, text}= item;

  function dragStartHandler(e: DragEvent<HTMLDivElement>, column: IColumn, item: IItem): void {
    setCurrentColumn(column);
    setCurrentItem(item);
  }
  
  function dragLeaveHandler(e: DragEvent<HTMLDivElement>): void {
    const target = e.target as HTMLDivElement;

    target.style.boxShadow = 'none';
  }

  function dragEndHandler(e: DragEvent<HTMLDivElement>): void {
    const target = e.target as HTMLDivElement;
    target.style.boxShadow = 'none';
    
  }

  function dragOverHandler(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    

    if (target.className === 'item'){
      target.style.boxShadow = '0 4px 3px gray';
    }

  }

  function dropHandler(e: DragEvent<HTMLDivElement>, column: IColumn, item: IItem): void {
    e.preventDefault();  

    const target = e.target as HTMLDivElement;
    target.style.boxShadow = 'none';
  };

  return (
    <div 
      className='item'
      draggable={true}
      onDragStart={(e) => dragStartHandler(e, column, item)}
      onDragLeave={(e) => dragLeaveHandler(e)}
      onDragEnd={(e) => dragEndHandler(e)}
      onDragOver={(e) => dragOverHandler(e)}
      onDrop={(e) => dropHandler(e, column, item)}
    >
      {text}
    </div>
  );
};
