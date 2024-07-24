import React, { useState, useEffect, memo } from 'react';
import PhotoBlock from './PhotoBlock';
import { useSelector } from 'react-redux';
import { patchPhotoLine } from '../../../../http/patchPhotoLine';
import styles from '../PhotoCard.module.css'
const Block = memo(({ addPhoto, orderValue, setOrderValue, lineLenght, onChangeHandler, inputValue, blurRef, setIsBlur, handleCheckboxChange, setIsChecked, isChecked }) => {

  const [photoBlocks, setPhotoBlocks] = useState([]);
  const accessStor = localStorage.getItem('access');
  useEffect(() => {
    if (addPhoto && addPhoto.length > 0) {
      const blocks = [];
      for (let i = 0; i < addPhoto.length; i += 6) {
        
        blocks.push(addPhoto.slice(i, i + 6));
      }
      // console.log('New blocks:', blocks);
      setPhotoBlocks(blocks);
    }
  }, [addPhoto]);

  const handleRemoveBlock = async (indexToRemove, id) => {
    try {
      const res = await patchPhotoLine(accessStor, { "parent": null }, id);
      const data = await res.json();
      setPhotoBlocks((prevBlocks) => {
        const newBlocks = prevBlocks.filter((_, index) => index !== indexToRemove);
        return newBlocks;
      });

    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  return (
    <div className={styles.block}>
      {photoBlocks?.map((block, index) => (
        <PhotoBlock
          blocksId={index}
          isChecked={isChecked}
          setIsChecked={setIsChecked}
          handleCheckboxChange={handleCheckboxChange}
          index={index}
          key={index}
          photos={block}
          onChangeHandler={onChangeHandler}
          setIsBlur={setIsBlur}
          blurRef={blurRef}
          inputValue={inputValue}
          handleRemoveBlock={handleRemoveBlock}
        />
      ))}
    </div>
  );
})

export default Block;