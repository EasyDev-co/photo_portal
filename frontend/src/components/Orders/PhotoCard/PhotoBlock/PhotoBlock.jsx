/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/display-name */
import { memo, useEffect, useState } from 'react';
import styles from "../../Orders.module.css";
import PhotoCard from '../PhotoCard';
import galkaSvg from '../../../../assets/icons/galka.svg'
import { useSelector } from 'react-redux';

const PhotoBlock = memo(({ blocksId, index, photos, price, oke, priceCalendar, handleRemoveBlock, onChangeHandler, inputValue, blurRef, setIsBlur, handleCheckboxChange, isChecked }) => {

  const cart = useSelector(state => state.user.cart);

  const [currentSum, setCurrentSum] = useState(0);
  const [isDigitalChecked, setIsDigitalChecked] = useState(false);

  const photoLineId = photos[0].photoLineId

  useEffect(() => {
    console.log(photoLineId)
  }, [photoLineId])

  // Получаем данные из cart для текущей фотолинии
  useEffect(() => {
    const currentPhotoLine = cart.find(item => item.photo_line_id === photoLineId);

    if (currentPhotoLine) {
      const totalPrice = parseFloat(currentPhotoLine.total_price);
      setCurrentSum(totalPrice);
      console.log(currentSum)
      // Проверяем, должна ли галочка быть активной
      const shouldActivateCheckbox = totalPrice >= priceCalendar.ransom_amount_for_digital_photos;

      if (shouldActivateCheckbox && !isDigitalChecked) {
        setIsDigitalChecked(true);
        handleCheckboxChange({ target: { checked: true, name: 7 } }, blocksId);
      } else if (!shouldActivateCheckbox && isDigitalChecked) {
        setIsDigitalChecked(false);
        handleCheckboxChange({ target: { checked: false, name: 7 } }, blocksId);
      }
    }
  }, [cart]);

  // }, [cart, priceCalendar.ransom_amount_for_digital_photos, handleCheckboxChange, isDigitalChecked]);

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
                {/* <button className={styles.mainButton} onClick={() => handleRemoveBlock(blocksId, photo.photoLineId)}>Удалить блок</button> */}
              </div>
            }
          </div>
        ))}
      </div>
      <div className={styles.orderPromo}>
        {/* <div className={styles.promoStringWrap}>
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
        </div> */}
        
        <div className={styles.promoStringWrap}>
          {price.total_price >= priceCalendar.ransom_amount_for_digital_photos ?
            <div>
              {/* <img src={galkaSvg} alt="galka" /> */}
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
