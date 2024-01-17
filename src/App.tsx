import { useState, useEffect, ChangeEvent } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Board } from './Components/Board/Board';
import { IBoard } from './Interfaces/IBoard';
import boardEmptyTemplate from './assets/json/boardEmptyTemplate.json';
import { createBoard, deleteBoard, getBoardById, updateBoardName } from './helpers/fetchers';

import styles from './App.module.scss';
import { Cross, Ok } from './Components/Icons';

export const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>('1');
  const [filteredBoard, setFilteredBoard] = useState<IBoard | null>(null);
  const [nameBoard, setNameBoard] = useState<string>('');
  const [idBoard, setIdBoard] = useState<string>('');
  
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  const [idBoardCreating, setIdBoardCreating] = useState<string>('');
  const [nameBoardCreating, setNameBoardCreating] = useState<string>('');
  const [changedBoardName, setChangedBoardName] = useState<string>('');
  const [actualInputValue, setActualInputValue] = useState<string>('');
  const [actualInputPlaceholder, setActualInputPlaceholder] = useState<string>('');
  

  useEffect(() => {
    fetchBoard();
  // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isCreating) {
      setActualInputValue(nameBoardCreating);
      setActualInputPlaceholder("New board name");
    }

    if (isEditing) {
      setActualInputValue(changedBoardName);
      setActualInputPlaceholder("Change board name");
    }

    if (!isCreating && !isEditing) {
      setActualInputValue(searchTerm);
      setActualInputPlaceholder("Search boards...");
    }
  }, [isCreating, isEditing, changedBoardName, nameBoardCreating, searchTerm]);

  const fetchBoard = async (): Promise<void> => {
    try {
      const fetchedBoard = await getBoardById(searchTerm);
    
      if (fetchedBoard) {
        setFilteredBoard(fetchedBoard);
        setNameBoard(fetchedBoard.name);
        setChangedBoardName(fetchedBoard.name);
        setIdBoard(fetchedBoard.id);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };

  const failFetchCallback = (): void => {
    toast.error('Sorry, try again');
    fetchBoard();
  };

  const handleBoardBtnClick = (key: string) => {
    switch (key) {
      case 'isCreating':
        setIsCreating(!isCreating);
        setIsEditing(false);
        setIsDeleting(false);
        break;
      case 'isEditing':
        setIsEditing(!isEditing);
        setIsCreating(false);
        setIsDeleting(false);
      break;
      case 'isDeleting':
        setIsDeleting(!isDeleting);
        setIsCreating(false);
        setIsEditing(false);
      break;
    
      default:
        break;
    }
  };

  const submitHandler = async (): Promise<void> => {
    try {
      if (isCreating) {
        await createBoard({...boardEmptyTemplate, id: idBoardCreating, name: nameBoardCreating});
        
        setIsCreating(false);
      }

      if (isEditing && filteredBoard) {
        setNameBoard(changedBoardName);
        
        updateBoardName(filteredBoard.id, changedBoardName, failFetchCallback);
        
        setIsEditing(false);
      }

      if (isDeleting) {
        setFilteredBoard(null);
        deleteBoard(idBoard, failFetchCallback);
        setIsDeleting(false);        
      }

    } catch (error: any) {
      toast.error(error.response?.data?.message);
    }
  };
  

  const cancelHandler = (): void => {
    if (isCreating) {      
      setIsCreating(false);
    }

    if (isEditing) {      
      setIsEditing(false);
    }

    if (isDeleting) {      
      setIsDeleting(false);      
    }    
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (isCreating) {
      setNameBoardCreating(e.target.value);
    }

    if (isEditing) {
      setChangedBoardName(e.target.value);
    }

    if (!isCreating && !isEditing && !isEditing) {
      setSearchTerm(e.target.value)
    }
  }

  const renderButtons = () => (
    <div className={styles.createWrapper}>
      <button 
        className={isCreating ? styles.btnDisable : styles.btnCreate}
        onClick={() => handleBoardBtnClick('isCreating')}
      >
        Create
      </button>
      <button 
        className={isEditing ? styles.btnDisable : styles.btnEdit}
        onClick={() => handleBoardBtnClick('isEditing')}
      >
        Edit
      </button>
      <button 
        className={isDeleting ? styles.btnDisable : styles.btnDelete}
        onClick={() => handleBoardBtnClick('isDeleting')}
      >
        Delete
      </button>
    </div>
  );

  const renderIcons = () => !isCreating && !isEditing && !isDeleting  ? 
    (
      <button 
      className={styles.btn}
      onClick={() => fetchBoard()}
    >
      Load
    </button>
    ) : (
      <div className={styles.iconWrapper}>
        <div onClick={cancelHandler}>
          <Cross className={styles.crossIcon}/>
        </div>
        <div onClick={submitHandler}>
          <Ok className={styles.okIcon} />
        </div>
      </div>
  );

  const renderInput = () => (
    <>
    {isDeleting ?
      (<p className={styles.deleteText}>
          Do you want to delete current Board?
        </p>
      ) : (<input
        className={styles.input}
        type="text"
        placeholder={actualInputPlaceholder}
        value={actualInputValue}
        onChange={handleInputChange}
      />)
    }
    
    {isCreating &&
      <input
        className={styles.input}
        type="text"
        placeholder="ID Board"
        value={idBoardCreating}
        onChange={(e) => setIdBoardCreating(e.target.value)}
      />
    }
    </>
  );
 
  return (
    <div className={styles.app}>
      <ToastContainer />
      {renderButtons()}
      <div className={styles.searchPanel}>
        {renderInput()}
        {renderIcons()}
      </div>
      { filteredBoard && 
      <Board 
        boardData={filteredBoard}
        setBoardData={setFilteredBoard}
        nameBoard={nameBoard}
        failFetchCallback={failFetchCallback}
      />}
    </div>
  );
};
