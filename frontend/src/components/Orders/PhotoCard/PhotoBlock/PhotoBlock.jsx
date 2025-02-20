/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/display-name */
import { memo, useEffect, useRef, useState } from 'react';
import styles from "../../Orders.module.css";
import PhotoCard from '../PhotoCard';
import galkaSvg from '../../../../assets/icons/galka.svg'
import { useSelector } from 'react-redux';

const PhotoBlock = memo(({ blocksId, index, photos, price, oke, priceCalendar, handleRemoveBlock, onChangeHandler, inputValue, blurRef, setIsBlur, handleCheckboxChange, isChecked }) => {
  const cart = useSelector(state => state.user.cart);
  const photoPrice = useSelector(state => state.user.photoPrice);
  const [currentSum, setCurrentSum] = useState(0);
  const [isDigitalChecked, setIsDigitalChecked] = useState(false);
  const currentLineId = photos[0].photoLineId
  const [manualControl, setManualControl] = useState(false); // Новый флаг для ручного управления
  const [isGalkaPhoto, setIsGalkaPhoto] = useState(false);
  const [isGalkaCalendar, setIsGalkaCalendar] = useState(false);
  const [digitalPrice, setDigitalPrice] = useState(0);
  const userData = useSelector(state => state.user.userData);
  


  useEffect(()=> {
  }, [])

  // useEffect(() => {
  //   photoPrice?.forEach(element => {
  //     if (element.photo_type === 0) {
  //       setDigitalPrice(element.price)
  //     }
  //     else return
  //   });
  // }, [])


  const prevCheckedState = useRef(isDigitalChecked);

  useEffect(() => {
    const cartItem = cart.find(item => item.photo_line_id === currentLineId);
  
    if (cartItem) {
      setCurrentSum(cartItem.total_price); 
  
      const shouldActivateCheckbox = cartItem.total_price >= priceCalendar.ransom_amount_for_digital_photos;
      const shouldActivateCheckboxCalendar = cartItem.total_price >= priceCalendar.ransom_amount_for_calendar;
      setIsGalkaPhoto(shouldActivateCheckbox)
      setIsGalkaCalendar(shouldActivateCheckboxCalendar)

      if (cartItem.total_price) {
        console.log(cartItem.total_price >= priceCalendar.ransom_amount_for_digital_photos)
      }

      // Если состояние изменилось, вызываем обновление
      if (shouldActivateCheckbox !== prevCheckedState.current && !manualControl) {
        setIsDigitalChecked(shouldActivateCheckbox);
        prevCheckedState.current = shouldActivateCheckbox;
        handleCheckboxChange({ target: { checked: shouldActivateCheckbox, name: 7 } }, currentLineId);
      }
    }
    // else console.log('hui:', currentLineId)
  }, [
    cart,
    currentLineId, 
    priceCalendar.ransom_amount_for_digital_photos, 
    manualControl
  ]);

  // Обработчик изменения чекбокса
  const handleDigitalCheckboxChange = (e, photoLineId) => {
    const { checked } = e.target;
  
    // Флаг ручного управления включается только при ручных действиях
    setManualControl(true);
    setIsDigitalChecked(checked);
    handleCheckboxChange(e, photoLineId);
  
    // Сбрасываем ручное управление, если сумма достигает порога
    if (!checked && currentSum >= priceCalendar.ransom_amount_for_digital_photos) {
      setManualControl(false);
    }
  };
  


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
                  {userData.kindergarten?.[0]?.has_photobook && (
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
                  )}
                  <div className={styles.bookCheckbox}>
                    <div className={styles.bookDescr}>В электронном виде</div>
                    <label className={styles.custom_checkbox}>
                      <input
                        className=''
                        id={blocksId}
                        name={7}
                        type="checkbox"
                        checked={isDigitalChecked}
                        // onChange={(e) => handleCheckboxChange(e, photo.photoLineId)}
                        onChange={(e) => handleDigitalCheckboxChange(e, photo.photoLineId)}
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
          {isGalkaPhoto ?
            <div>
              <img src={galkaSvg} alt="galka" style={{width: '25px', marginRight: '5px'}}/>
            </div>
            :
            <div className={styles.dot}></div>
          }
          <span className={styles.promoString}>При заказе от {priceCalendar.ransom_amount_for_digital_photos} рублей, вы получите все фото в электронном виде</span>
        </div>
        <div className={styles.promoStringWrap}>
        {isGalkaCalendar ?
            <div>
              <img src={galkaSvg} alt="galka" style={{width: '25px', marginRight: '5px'}}/>
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
