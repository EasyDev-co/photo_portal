import React, { memo, useState } from 'react';
import styles from "../../Orders.module.css";
import PhotoCard from '../PhotoCard';
import oke from '../../../../assets/images/pngwing.com.png'
const PhotoBlock = memo(({ price, priceCalendar, blocksId, index, photos, handleRemoveBlock, onChangeHandler, inputValue, blurRef, setIsBlur, handleCheckboxChange, setIsChecked, isChecked }) => {
  
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column'
    }}>
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
                <div className={styles.checkboxInputWrap}>
                  <div className={styles.bookCheckbox}>
                    <div className={styles.bookDescr}>Фотокнига</div>
                    <label className={styles.custom_checkbox}>
                      <input
                        className=''
                        id={blocksId}
                        name={6}
                        type="checkbox"
                        // onChange={(e)=>onChangeHandler(e.target.name, 0 ,  photo.photoLineId, e.target.checked , photo.photoLineId, blocksId)}
                        onChange={(e) => handleCheckboxChange(e, photo.photoLineId)}
                      />
                      <div className={styles.checkbox}>
                        <div className={styles.checkmark}></div>
                      </div>
                    </label>
                  </div>
                  <div className={styles.bookCheckbox}>
                    <div className={styles.bookDescr}>В электронном виде</div>
                    <label className={styles.custom_checkbox}>
                      <input
                        className=''
                        id={blocksId}
                        name={7}
                        type="checkbox"
                        onChange={(e) => handleCheckboxChange(e, photo.photoLineId)}
                      />
                      <div className={styles.checkbox}>
                        <div className={styles.checkmark}></div>
                      </div>
                    </label>
                  </div>
                </div>
                <button className={styles.mainButton} onClick={() => handleRemoveBlock(blocksId, photo.photoLineId)}>Удалить блок</button>
              </div>
            }
          </div>
        ))}
      </div>
      <div className={styles.orderPromo}>
        <div className={styles.promoStringWrap}>
          <div className={styles.dot}></div>
          <div className={styles.promoInputWrapp}>
            <span className={styles.promoString}>Отправить электронную версию на электронную почту</span>
            <input
              className={styles.promoInput}
              placeholder="Электронный адрес*"
              type="text"
              name="digital"
              style={{ width: '94%' }}
            />
          </div>
        </div>
        
        <div key={index} className={styles.promoStringWrap}>
          {price.total_price >= priceCalendar.ransom_amount_for_digital_photos ?
            <div>
              <img src={oke} alt="" />
            </div>
            :
            <div className={styles.dot}></div>
          }
          <span className={styles.promoString}>При заказе от {priceCalendar.ransom_amount_for_digital_photos} рублей, вы получите все фото в электронном виде</span>
        </div>
        <div key={index} className={styles.promoStringWrap}>
          {price.total_price >= priceCalendar.ransom_amount_for_calendar ?
            <div>
              <img src={oke} alt="" />
            </div>
            :
            <div className={styles.dot}></div>
          }
          <span className={styles.promoString}>При заказе от {priceCalendar.ransom_amount_for_calendar} рублей, эл. версия всех фотографий календаря в подарок</span>
        </div>
      </div>
    </div>
  );
})

export default PhotoBlock;