import { useState } from 'react';
import { Dispatch, SetStateAction, DragEvent } from 'react';

import { ICard, IColumn, IBoard } from '../../Interfaces';
import { Edit, Delete, Ok, Cross } from '../Icons';
import { deleteCard, updateCard } from '../../helpers/fetchers';

import styles from './Card.module.scss';

type Props = {
  card: ICard;
  column: IColumn;
  boardId: string;
  failFetchCallback: () => void;
  setCurrentColumn: Dispatch<SetStateAction<IColumn | null>>;
  setCurrentCard: Dispatch<SetStateAction<ICard | null>>;
  setHoveredCard: Dispatch<SetStateAction<ICard | null>>;
  setColumns: Dispatch<SetStateAction<IColumn[] | null>>;
  setBoardData: Dispatch<SetStateAction<IBoard | null>>;
};

export const Card = ({ card, column, boardId, failFetchCallback, setCurrentColumn, setCurrentCard, setHoveredCard, setColumns, setBoardData }: Props) => {
  const { id: cardId } = card;
  const { id: columnId } = column;

  const [text, setText] = useState<string>(card.text);
  const [originalText, setOriginalText] = useState<string>(card.text);
  const [description, setDescription] = useState<string>(card.description);
  const [originalDescription, setOriginalDescription] = useState<string>(card.description);
  const [isEditing, setEditing] = useState<boolean>(false);

  const classNamesToStyle = [styles.card, styles.cardDescription, styles.cardText, styles.iconWrapper, styles.editIcon, styles.deleteIcon];
  const elementById = document.getElementById(`${cardId}`);

  const dragStartHandler = (e: DragEvent<HTMLDivElement>, column: IColumn, itcardem: ICard): void => {
    setCurrentColumn(column);
    setCurrentCard(card);
  }

  const dragLeaveHandler = (e: DragEvent<HTMLDivElement>): void => {
    const target = e.target as HTMLDivElement;
    
    if (classNamesToStyle.includes(target.className) && elementById) {
      elementById.style.boxShadow = 'none';
    }
  };
  

  const dragOverHandler = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;
    
    if (classNamesToStyle.includes(target.className) && elementById) {
      setHoveredCard(card);
      elementById.style.boxShadow = '0 5px 5px rgba(0, 0, 0, 0.2)';
    }
  }

  const dropHandler = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;

    if (classNamesToStyle.includes(target.className) && elementById) {
      elementById.style.boxShadow = 'none';
    }
  }

  const editHandler = (): void => {
    setOriginalText(text);
    setOriginalDescription(description);
    setEditing(true);
  }

  const saveUpdateHandler = async (): Promise<void> => {
    setBoardData((board: IBoard | null) => {
      if (board) {
        
        const column = board.columnsData.find((col) => col.id === columnId);
        
        if (column) {
          const cardIndex = column.items.findIndex((c) => c.id === cardId);

          if (cardIndex !== -1) {
            column.items[cardIndex] = { text, description, id: cardId };
            return {...board};
          }
        }
      }
      return board;
    });

    updateCard(boardId, columnId, cardId, {id: cardId, text, description }, failFetchCallback);

    setEditing(false);
  }

  const cancelHandler = (): void => {
    setText(originalText);
    setDescription(originalDescription);
    setEditing(false);
  }

  const deleteHandler = async (): Promise<void> => {
    setBoardData((board: IBoard | null) => {
      if (board) {
        
        const column = board.columnsData.find((col) => col.id === columnId);
        
        if (column) {
          const cardIndex = column.items.findIndex((c) => c.id === cardId);

          if (cardIndex !== -1) {
            column.items.splice(cardIndex, 1);
            return {...board};
          }
        }
      }
      return board;
    });

    deleteCard(boardId, columnId, cardId, failFetchCallback);
  }

  const renderContent = () => isEditing ? (
    <>
      <input
        className={styles.cardTextInput}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <input
        className={styles.cardDescriptionInput}
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div className={styles.iconWrapper}>
        <div onClick={cancelHandler}>
          <Cross className={styles.crossIcon}/>
        </div>
        <div onClick={saveUpdateHandler}>
          <Ok className={styles.okIcon} />
        </div>
      </div>
    </>
  ) : (
    <>
      <span className={styles.cardText}>{text}</span>
      <span className={styles.cardDescription}>{description}</span>
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
      id={`${cardId}`}
      className={styles.card}
      draggable={!isEditing}
      onDragStart={(e) => dragStartHandler(e, column, card)}
      onDragLeave={(e) => dragLeaveHandler(e)}
      onDragEnd={(e) => dragLeaveHandler(e)}
      onDragOver={(e) => dragOverHandler(e)}
      onDrop={(e) => dropHandler(e)}
    >
      {renderContent()}
    </div>
  );
};
