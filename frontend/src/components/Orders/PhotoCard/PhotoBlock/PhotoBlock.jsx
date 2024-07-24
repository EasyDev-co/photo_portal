import React, { memo, useState } from 'react';
import styles from "../../Orders.module.css";
import PhotoCard from '../PhotoCard';
const PhotoBlock = memo(({ blocksId, index, photos, handleRemoveBlock, onChangeHandler, inputValue, blurRef, setIsBlur, handleCheckboxChange, setIsChecked, isChecked }) => {

    return (
        <div key={index} className={styles.photoCardsWrap}>
            {photos.map((photo, index) => (
                <div key={index} className={styles.photoCardWrapper}>
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
                    {index === 5 &&
                        <div className={styles.widgetDelete}>
                            <div className={styles.bookCheckbox}>
                                <div className={styles.bookDescr}>Фотокнига</div>
                                <input
                                    id={blocksId}
                                    name="checkbox"
                                    type="checkbox"
                                    onChange={(e) => handleCheckboxChange(e)}
                                />
                            </div>
                            <button className={styles.mainButton} onClick={() => handleRemoveBlock(blocksId, photo.photoLineId)}>Удалить блок</button>
                        </div>
                    }
                </div>
            ))}
        </div>
    );
})

export default PhotoBlock;