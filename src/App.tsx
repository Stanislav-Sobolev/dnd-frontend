import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import styles from './App.module.scss';
import { Item } from './Components/Item/Item';

import { IItem, IColumn } from './Interfaces';
import { Columns } from './Components/Columns/Columns';

export const App = () => {
  const columns = [
        { id: 1, title: 'To Do', items: [{id: 1, text: 'ToDo 1',  description: 'desk 1'}, {id: 2, text: 'ToDo 2',  description: 'desk 2'}]},
        { id: 2, title: 'In Progress', items: [{id: 3, text: 'InProgress 1',  description: 'desk 1'}, {id: 4, text: 'InProgress 2',  description: 'desk 2'}]},
        { id: 3, title: 'Done', items: [{id: 5, text: 'Done 1',  description: 'desk 1'}, {id: 6, text: 'Done 2',  description: 'desk 2'}]}
      ];

  return (
    <div className={styles.app}>
      <Columns columnsData={columns}/>
    </div>
  );
}

