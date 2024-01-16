import { useState } from 'react';
import { Dispatch, SetStateAction, DragEvent } from 'react';

import { ICard, IColumn } from '../../Interfaces';
import { Edit, Delete, Ok, Cross } from '../Icons';
import { deleteCard, updateCard } from '../../helpers/fetchers';

import styles from './Card.module.scss';

type Props = {
  card: ICard;
  column: IColumn;
  boardId: string;
  fetchBoard: () => Promise<void>;
  setCurrentColumn: Dispatch<SetStateAction<IColumn | null>>;
  setCurrentCard: Dispatch<SetStateAction<ICard | null>>;
  setHoveredCard: Dispatch<SetStateAction<ICard | null>>;
  setColumns: Dispatch<SetStateAction<IColumn[] | null>>;
};

export const Card = ({ card, column, boardId, fetchBoard, setCurrentColumn, setCurrentCard, setHoveredCard, setColumns }: Props) => {
  const { id: cardId } = card;
  const { id: columnId } = column;

  const [text, setText] = useState<string>(card.text);
  const [originalText, setOriginalText] = useState<string>(card.text);
  const [description, setDescription] = useState<string>(card.description);
  const [originalDescription, setOriginalDescription] = useState<string>(card.description);
  const [isEditing, setEditing] = useState<boolean>(false);

  const dragStartHandler = (e: DragEvent<HTMLDivElement>, column: IColumn, itcardem: ICard): void => {
    setCurrentColumn(column);
    setCurrentCard(card);
  }

  const dragLeaveHandler = (e: DragEvent<HTMLDivElement>): void => {
    const target = e.target as HTMLDivElement;
    target.style.boxShadow = 'none';
  }

  const dragOverHandler = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const target = e.target as HTMLDivElement;

    if (target.className === styles.card) {
      setHoveredCard(card);
      target.style.boxShadow = '0 4px 3px gray';
    }
  }

  const dropHandler = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    
    const target = e.target as HTMLDivElement;
    target.style.boxShadow = 'none';
  }

  const editHandler = (): void => {
    setOriginalText(text);
    setOriginalDescription(description);
    setEditing(true);
  }

  const saveUpdateHandler = async (): Promise<void> => {
    await updateCard(boardId, columnId, cardId, {id: cardId, text, description });
    await fetchBoard();

    setEditing(false);
  }

  const cancelHandler = (): void => {
    setText(originalText);
    setDescription(originalDescription);
    setEditing(false);
  }

  const deleteHandler = async (): Promise<void> => {
    await deleteCard(boardId, columnId, cardId);
    await fetchBoard();
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
