import { useState, useEffect } from 'react';
import styles from './App.module.scss';
import { Board } from './Components/Board/Board';
import { IBoard } from './Interfaces/IBoard';

const columns = [
  { id: 1, title: 'To Do', items: [{id: 1, text: 'ToDo 1',  description: 'desk 1'}, {id: 2, text: 'ToDo 2',  description: 'desk 2'}]},
  { id: 2, title: 'In Progress', items: [{id: 3, text: 'InProgress 1',  description: 'desk 1'}, {id: 4, text: 'InProgress 2',  description: 'desk 2'}]},
  { id: 3, title: 'Done', items: [{id: 5, text: 'Done 1',  description: 'desk 1'}, {id: 6, text: 'Done 2',  description: 'desk 2'}]}
];

const columns2 = [
  { id: 4, title: 'To Do', items: [{id: 7, text: '2 ToDo 1',  description: '2esk 1'}, {id: 8, text: '2ToDo 2',  description: '2desk 2'}]},
  { id: 5, title: 'In Progress', items: [{id: 9, text: '2 InProgress 1',  description: '2desk 1'}, {id: 10, text: '2InProgress 2',  description: '2desk 2'}]},
  { id: 6, title: 'Done', items: [{id: 11, text: '2 Done 1',  description: '2desk 1'}, {id: 12, text: '2Done 2',  description: '2desk 2'}]}
];

const boardsData = [
  { id: 1, name: 'Project A', columnsData: columns },
  { id: 2, name: 'Project B', columnsData: columns2 },
];

export const App = () => {
  const [searchTerm, setSearchTerm] = useState('Project A');
  const [filteredBoard, setFilteredBoard] = useState<IBoard>(boardsData[0]);

//   // Импортируем библиотеку для хеширования
// import { createHash } from 'crypto';

// // Создаем функцию, которая хеширует идентификатор
// const hashId = (id) => {
//   const hash = createHash('sha256');
//   hash.update(String(id));
//   return hash.digest('hex');
// };

// // Использование
// const originalId = 123;
// const hashedId = hashId(originalId);
// console.log(hashedId);


  useEffect(() => {
    searchBoard();
  }, []);

  const searchBoard = () => {
    const filteredResults = boardsData.find(
      (board) => board.name.toLowerCase() === searchTerm.toLowerCase()
    );
    if (filteredResults) {
      setFilteredBoard(filteredResults);
    }
  }

  return (
    <div className={styles.app}>
      <div className={styles.searchPanel}>
        <input
          className={styles.input}
          type="text"
          placeholder="Search boards..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button 
          className={styles.btn}
          onClick={() => searchBoard()}
        >
          Load
          </button>
      </div>
      <Board boardData={filteredBoard} />
    </div>
  );
};
