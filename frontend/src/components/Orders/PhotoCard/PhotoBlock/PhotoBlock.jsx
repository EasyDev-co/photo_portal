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
                                    name={6}
                                    type="checkbox"
                                    onChange={(e)=>onChangeHandler(e.target.name, 0 ,  photo.photoLineId, e.target.checked , photo.photoLineId, blocksId)}
                                    // onChange={(e) => handleCheckboxChange(e, photo.photoLineId)}
                                />
                            </div>
                            <button className={styles.mainButton} onClick={() => handleRemoveBlock(blocksId, photo.photoLineId)}>Удалить блок</button>
                        </div>
                    }
                </div>
            ))}
            <div className={styles.orderPromo}>
              {[{
                text: "Отправить электронную версию на электронную почту",
                input: true,
              }, {
                text: "При заказе от 2000 рублей, к такой-то дате, вы получите все фото в электронном виде",
                input: false,
              }, {
                text: "При заказе от 2700 рублей, эл. версия всех фотографий календаря в подарок",
                input: false,
              }].map((promo, index) => (
                <div key={index} className={styles.promoStringWrap}>
                  <div className={styles.dot}></div>
                  {promo.input ? (
                    <div className={styles.promoInputWrapp}>
                      <span className={styles.promoString}>{promo.text}</span>
                      <input
                        className={styles.promoInput}
                        placeholder="Электронный адрес*"
                        type="text"
                        name="digital"
                        // onChange={(e) => handleInputEmailChange(e)}
                      />
                    </div>
                  ) : (
                    <span className={styles.promoString}>{promo.text}</span>
                  )}
                </div>
              ))}
            </div>
        </div>
    );
})

export default PhotoBlock;