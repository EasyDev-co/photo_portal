/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/display-name */
import { memo, useEffect, useRef, useState } from 'react';
import styles from "../../Orders.module.css";
import PhotoCard from '../PhotoCard';
import galkaSvg from '../../../../assets/icons/galka.svg'
import { useSelector } from 'react-redux';
import { use } from 'react';

const PhotoBlock = memo(({ childNumber, blocksId, index, photos, price, oke, priceCalendar, handleRemoveBlock, onChangeHandler, inputValue, blurRef, setIsBlur, handleCheckboxChange, isChecked }) => {
  const cart = useSelector(state => state.user.cart);
  const allPrice = useSelector(state => state.user.total_price);
  const photoPrice = useSelector(state => state.user.photoPrice);
  const [currentSum, setCurrentSum] = useState(0);
  const [isDigitalChecked, setIsDigitalChecked] = useState(false);
  const currentLineId = photos[0].photoLineId
  const [manualControl, setManualControl] = useState(false); // Новый флаг для ручного управления
  const [isGalkaPhoto, setIsGalkaPhoto] = useState(false);
  const [isGalkaCalendar, setIsGalkaCalendar] = useState(false);
  const [digitalPrice, setDigitalPrice] = useState(0);
  const userData = useSelector(state => state.user.userData);
  const [ransomDigitalPhotos, setRansomDigitalPhotos] = useState(0)
  const [ransomCalendar, setRansomCalendar] = useState(0)
  const [isLoading, setIsLoading] = useState(true); // Новое состояние для лоадера

  // useEffect(() => {
  //   console.log(allPrice)}, [allPrice])
  useEffect(() => {
    if (!priceCalendar) {
      // console.error('priceCalendar is not provided');
      setIsLoading(true)
    } else {
      // console.log('priceCalendar:', priceCalendar);
      setIsLoading(false)
    }
  
    if (!ransomDigitalPhotos) {
      // console.error('ransomDigitalPhotos is not provided');
      setIsLoading(true)
    } else {
      // console.log('ransomDigitalPhotos:', ransomDigitalPhotos);
      setIsLoading(false)
    }
  }, [priceCalendar, ransomDigitalPhotos]);

  useEffect(()=> {
    const calculateValues = () => {
      if (!priceCalendar) {
        console.error('priceCalendar is not provided');
        return;
      }
      // Пример расчета значений в зависимости от childNumber
      switch (childNumber) {
        case 1:
          setRansomDigitalPhotos(priceCalendar.ransom_amount_for_digital_photos) // Пример значения
          setRansomCalendar(priceCalendar.ransom_amount_for_calendar) // Пример значения
          break;
        case 2:
          setRansomDigitalPhotos(priceCalendar.ransom_amount_for_digital_photos_second) // Пример значения
          setRansomCalendar(priceCalendar.ransom_amount_for_calendar_second) // Пример значения
          break;
        case 3:
          setRansomDigitalPhotos(priceCalendar.ransom_amount_for_digital_photos_third) // Пример значения
          setRansomCalendar(priceCalendar.ransom_amount_for_calendar_third) // Пример значения
          break;
        default:
          setRansomDigitalPhotos(0)
          setRansomCalendar(0)
          console.warn('Invalid childNumber');
      }

    };

    calculateValues();
  }, [childNumber, priceCalendar])

  // useEffect(() => {
  //   photoPrice?.forEach(element => {
  //     if (element.photo_type === 0) {
  //       setDigitalPrice(element.price)
  //     }
  //     else return
  //   });
  // }, [])


  const prevCheckedState = useRef(isDigitalChecked);
  // useEffect(() => {
  //   console.log('prevCheckedState:', prevCheckedState)
  // }, [prevCheckedState])

  useEffect(() => {
    // if (ransomDigitalPhotos === 0 || ransomCalendar === 0) {
    //   console.log('ransomDigitalPhotos or ransomCalendar not loaded yet');
    //   return; // Прекращаем выполнение, если данные не загружены
    // }
    const cartItem = cart.find(item => item.photo_line_id === currentLineId);
    // console.log(cartItem)
  
    // if (cartItem) {
      // setCurrentSum(cartItem.total_price);
  
      const shouldActivateCheckbox =
    ransomDigitalPhotos !== undefined &&
    ransomDigitalPhotos !== null &&
    ransomDigitalPhotos !== '' &&
    ransomDigitalPhotos !== 0 &&
    allPrice >= ransomDigitalPhotos;

  const shouldActivateCheckboxCalendar =
    ransomCalendar !== undefined &&
    ransomCalendar !== null &&
    ransomCalendar !== '' &&
    ransomCalendar !== 0 &&
    allPrice >= ransomCalendar;
    // const shouldActivateCheckbox = allPrice >= ransomDigitalPhotos;
    //   const shouldActivateCheckboxCalendar = allPrice >= ransomCalendar;


      setIsGalkaPhoto(shouldActivateCheckbox)
      setIsGalkaCalendar(shouldActivateCheckboxCalendar)

      // console.log("all_price", allPrice)
      // console.log("ransomDigitalPhotos", ransomDigitalPhotos)

      // if (allPrice) {
      //   console.log("check", allPrice >= ransomDigitalPhotos)
      // }

      // Если состояние изменилось, вызываем обновление
      if (shouldActivateCheckbox !== prevCheckedState.current && !manualControl) {
        setIsDigitalChecked(shouldActivateCheckbox);
        prevCheckedState.current = shouldActivateCheckbox;
        handleCheckboxChange({ target: { checked: shouldActivateCheckbox, name: 7 } }, currentLineId);
      }

    // }
    // else console.log('hui:', currentLineId)
  }, [
    // allPrice, ransomDigitalPhotos, handleCheckboxChange
    allPrice, ransomDigitalPhotos, ransomCalendar, handleCheckboxChange, manualControl, cart, currentLineId
]);

  // Обработчик изменения чекбокса
  const handleDigitalCheckboxChange = (e, photoLineId) => {
    const { checked } = e.target;
  
    // Флаг ручного управления включается только при ручных действиях
    setManualControl(true);
    setIsDigitalChecked(checked);
    handleCheckboxChange(e, photoLineId);
  
    // Сбрасываем ручное управление, если сумма достигает порога
    if (!checked && allPrice >= ransomDigitalPhotos) {
      setManualControl(false);
    }
  };
  
  if (isLoading) {
    return <h1>Загрузка...</h1>; // Компонент лоадера
  }

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
          <span className={styles.promoString}>При заказе от {ransomDigitalPhotos} рублей, вы получите все фото в электронном виде</span>
        </div>
        <div className={styles.promoStringWrap}>
        {isGalkaCalendar ?
            <div>
              <img src={galkaSvg} alt="galka" style={{width: '25px', marginRight: '5px'}}/>
            </div>
            :
            <div className={styles.dot}></div>
          }
          <span className={styles.promoString}>При заказе от {ransomCalendar} рублей, эл. версия всех фотографий календаря в подарок</span>
        </div>
      </div>
    </div>
  );
})

export default PhotoBlock;
