import React, { useState, useEffect } from 'react';
import PhotoBlock from './PhotoBlock';
import styles from "../../Orders.module.css";
const Block = ({ photos,onChangeHandler,inputValue,blurRef,setIsBlur }) => {


  const [photoBlocks, setPhotoBlocks] = useState([])

  useEffect(() => {
    if (photos && photos.length > 0) {
      const blocks = [];
      for (let i = 0; i < photos.length; i += 6) {
        blocks.push(photos.slice(i, i + 6));
      }
      setPhotoBlocks(blocks);
    }
  }, [photos]);

  const handleRemoveBlock = (indexToRemove) => {
    setPhotoBlocks((prevBlocks) =>
      prevBlocks.filter((_, index) => index !== indexToRemove)
    );
  };
  return (
    <div className="block">
      {photoBlocks.map((block, index) => (
        <PhotoBlock
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
};

export default Block;