/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/display-name */
import { memo } from 'react';
import styles from "../../Orders.module.css";
import PhotoCard from '../PhotoCard';

const PhotoBlock = memo(({ blocksId, index, photos, price, oke, priceCalendar, handleRemoveBlock, onChangeHandler, inputValue, blurRef, setIsBlur, handleCheckboxChange, isChecked }) => {

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className={styles.photoCardsWrap}>
        {photos.map((photo, index) => (
          <div key={`${index}-${photo.number}`} className={styles.photoCardWrapper}>
            <PhotoCard
              blocksId={blocksId}
              photoId={photo.id}
              photo={photo.watermarked_photo_path}
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
        
        <div className={styles.promoStringWrap}>
          {price.total_price >= priceCalendar.ransom_amount_for_digital_photos ?
            <div>
              <img src={oke} alt="" />
            </div>
            :
            <div className={styles.dot}></div>
          }
          <span className={styles.promoString}>При заказе от {priceCalendar.ransom_amount_for_digital_photos} рублей, вы получите все фото в электронном виде</span>
        </div>
        <div className={styles.promoStringWrap}>
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
