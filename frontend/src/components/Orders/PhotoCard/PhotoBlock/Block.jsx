import React, { useState, useEffect, memo } from 'react';
import PhotoBlock from './PhotoBlock';
import { useSelector } from 'react-redux';
import { patchPhotoLine } from '../../../../http/patchPhotoLine';

const Block = ({ orderValue, setOrderValue, lineLenght, onChangeHandler, inputValue, blurRef, setIsBlur, handleCheckboxChange, setIsChecked, isChecked }) => {

  const [photoBlocks, setPhotoBlocks] = useState([])
  const addPhoto = useSelector(state => state.user.photos);
  const accessStor = localStorage.getItem('access');
  const idP = localStorage.getItem('idP');
  useEffect(() => {
    if (addPhoto && addPhoto.length > 0) {
      const blocks = [];
      for (let i = 0; i < addPhoto.length; i += 6) {
        blocks.push(addPhoto.slice(i, i + 6));
      }
      setPhotoBlocks(blocks);
    }
  }, [addPhoto, photoBlocks]);

  const handleRemoveBlock = async (indexToRemove, id) => {
    patchPhotoLine(accessStor, { "parent": null }, id)
      .then(res => res.json())
      .then(res =>{ 
        setPhotoBlocks((prevBlocks) => {
          const newBlocks = prevBlocks.filter((_, index) => index !== indexToRemove);
          return newBlocks;
        });
      })
      .catch(err => console.error('Ошибка:', err));
  };

  return (
    <div className="block">
      {photoBlocks.slice(0, lineLenght).map((block, index) => (
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
}

export default Block;