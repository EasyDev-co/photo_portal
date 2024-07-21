import React, { useState } from 'react';
import styles from "../../Orders.module.css";
import PhotoCard from '../PhotoCard';
const PhotoBlock = ({blocksId, index, photos, handleRemoveBlock, onChangeHandler, inputValue, blurRef, setIsBlur,handleCheckboxChange,setIsChecked, isChecked }) => {

    return (
        <div className={styles.photoCardsWrap}>
            {photos.map((photo, index) => (
                <PhotoCard
                    blocksId={blocksId}
                    photoId={photo.id}
                    photo={photo.photo}
                    key={index}
                    number={photo.number}
                    onChangeHandler={onChangeHandler}
                    inputValue={inputValue}
                    blurRef={blurRef}
                    setIsBlur={setIsBlur}
                    photoLineId={photo.photoLineId}
                    isChecked={isChecked}
                />
            ))}
            <div>
                <div className={styles.bookCheckbox}>
                    <div className={styles.bookDescr}>Фотокнига</div>
                    <input
                        id={blocksId}
                        name="checkbox"
                        type="checkbox"
                        onChange={(e) => handleCheckboxChange(e)}
                    />
                </div>
                <button className={styles.mainButton} onClick={() => handleRemoveBlock(index)}>Удалить блок</button>
            </div>
        </div>
    );
};

export default PhotoBlock;