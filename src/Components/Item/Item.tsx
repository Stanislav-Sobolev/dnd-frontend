import React, { useState } from 'react';
import { Dispatch, SetStateAction, DragEvent, ChangeEvent } from 'react';

import { IItem, IColumn } from '../../Interfaces';
import { Edit, Delete, Ok, Cross } from '../Icons';

import styles from './Item.module.scss';

type Props = {
  item: IItem;
  column: IColumn;
  setCurrentColumn: Dispatch<SetStateAction<IColumn | null>>;
  setCurrentItem: Dispatch<SetStateAction<IItem | null>>;
  setColumns: Dispatch<SetStateAction<IColumn[] | null>>;
};

export const Item = ({ item, column, setCurrentColumn, setCurrentItem, setColumns }: Props) => {
  const { id } = item;
  const [text, setText] = useState(item.text);
  const [originalText, setOriginalText] = useState(item.text);
  const [description, setDescription] = useState(item.description);
  const [originalDescription, setOriginalDescription] = useState(item.description);
  const [isEditing, setEditing] = useState(false);

  function dragStartHandler(e: DragEvent<HTMLDivElement>, column: IColumn, item: IItem): void {
    setCurrentColumn(column);
    setCurrentItem(item);
  }

  function dragLeaveHandler(e: DragEvent<HTMLDivElement>): void {
    
    const target = e.target as HTMLDivElement;
    target.style.boxShadow = 'none';
  }

  function dragOverHandler(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();
    const target = e.target as HTMLDivElement;

    if (target.className === styles.item) {
      target.style.boxShadow = '0 4px 3px gray';
    }
  }

  function dropHandler(e: DragEvent<HTMLDivElement>): void {
    e.preventDefault();

    const target = e.target as HTMLDivElement;
    target.style.boxShadow = 'none';
  }

  function editHandler(): void {
    setOriginalText(text);
    setOriginalDescription(description);
    setEditing(true);
  }

  function saveHandler(): void {
    setColumns((prevColumns) => {
      if (!prevColumns) return prevColumns;

      return prevColumns.map((col) =>
        col.id === column.id
          ? {
              ...col,
              items: col.items.map((el) =>
                el.id === item.id
                  ? { ...el, text: text, description: description }
                  : el
              ),
            }
          : col
      );
    });

    setEditing(false);
  }

  function cancelHandler(): void {
    setText(originalText);
    setDescription(originalDescription);
    setEditing(false);
  }

  function deleteHandler(): void {
    setColumns((prevColumns) => {
      if (!prevColumns) return prevColumns;

      return prevColumns.map((col) =>
        col.id === column.id
          ? {
              ...col,
              items: col.items.filter((el) => el.id !== item.id),
            }
          : col
      );
    });
  }

  const renderContent = isEditing ? (
    <>
      <input
        className={styles.itemText}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        className={styles.itemDescription}
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className={styles.iconWrapper}>
        <div onClick={cancelHandler}>
          <Cross className={styles.crossIcon}/>
        </div>
        <div onClick={saveHandler}>
          <Ok className={styles.okIcon} />
        </div>
      </div>
    </>
  ) : (
    <>
      <span className={styles.itemText}>{text}</span>
      <span className={styles.itemDescription}>{description}</span>
      <div className={styles.iconWrapper}>
        <div onClick={editHandler}>
          <Edit className={styles.editIcon} />
        </div>
        <div onClick={deleteHandler}>
          <Delete className={styles.deleteIcon} />
        </div>
      </div>
    </>
  );

  return (
    <div
      className={styles.item}
      draggable={true}
      onDragStart={(e) => dragStartHandler(e, column, item)}
      onDragLeave={(e) => dragLeaveHandler(e)}
      onDragEnd={(e) => dragLeaveHandler(e)}
      onDragOver={(e) => dragOverHandler(e)}
      onDrop={(e) => dropHandler(e)}
    >
      {renderContent}
    </div>
  );
};
