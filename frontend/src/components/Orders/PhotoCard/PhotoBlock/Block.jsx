import React, { useState, useEffect, memo } from 'react';
import PhotoBlock from './PhotoBlock';
import { useDispatch } from 'react-redux';
import { patchPhotoLine } from '../../../../http/photo/patchPhotoLine';
import styles from '../PhotoCard.module.css'
import { removePhotos } from '../../../../store/authSlice';

const Block = ({ setlineLenght, addPhoto, price, priceCalendar, orderValue, setOrderValue, onChangeHandler, inputValue, blurRef, setIsBlur, handleCheckboxChange, setIsChecked, isChecked }) => {

  const [photoBlocks, setPhotoBlocks] = useState([]);
  const dispatch = useDispatch();
  const accessStor = localStorage.getItem('access');

  useEffect(() => {
    setlineLenght(photoBlocks.length)
  }, [photoBlocks])

  useEffect(() => {
    if (addPhoto && addPhoto.length > 0) {
      const blocks = [];
      for (let i = 0; i < addPhoto.length; i += 6) {
        blocks.push(addPhoto.slice(i, i + 6));
      }
      setPhotoBlocks(blocks);
      // console.log(photoBlocks)
    }
  }, [addPhoto]);

  useEffect(() => {
    console.log(photoBlocks)
  }, [photoBlocks])

  const handleRemoveBlock = async (indexToRemove, id) => {
    try {
      const res = await patchPhotoLine(accessStor, { "parent": null }, id);
      localStorage.setItem('deadline', '')
      const data = await res.json();
      setPhotoBlocks((prevBlocks) => {
        const newBlocks = prevBlocks.filter((_, index) => index !== indexToRemove);
        return newBlocks;
      });
      dispatch(removePhotos(id))
      sessionStorage.setItem('photoline', null)
    } catch (err) {
      console.error('Ошибка:', err);
    }
  };

  return (
    <div className={styles.block}>
      {photoBlocks?.map((block, index) => (
        <PhotoBlock
          price={price}
          priceCalendar={priceCalendar}
          blocksId={index}
          isChecked={isChecked}
          setIsChecked={setIsChecked}
          handleCheckboxChange={handleCheckboxChange}
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
}

export default Block;
