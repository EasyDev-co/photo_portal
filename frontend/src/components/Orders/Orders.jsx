import styles from "./Orders.module.css";
import React, { useState } from 'react';
export const Orders = () => {
  const [blocks, setBlocks] = useState([]);

  const addBlock = () => {
    if (blocks.length < 3) {
      setBlocks([...blocks, { id: blocks.length + 1 }]);
    }
  };

  const deleteBlock = (id) => {
    const filteredBlocks = blocks.filter((block) => block.id !== id);
    setBlocks(filteredBlocks);
  };
  return (
    <div className={styles.ordersWrap}>
    <button className={styles.mainButton} onClick={addBlock}>Добавить блок</button>
    <div style={{ display: 'flex' }}>
      {blocks.map((block) => (
        <div key={block.id} style={{ width: '100px', height: '100px', backgroundColor: 'lightblue', margin: '10px' }}>
          <button onClick={() => deleteBlock(block.id)}>Удалить блок</button>
          <p>Блок {block.id}</p>
        </div>
      ))}
    </div>
  </div>
  );

};
