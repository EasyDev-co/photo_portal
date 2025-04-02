/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/display-name */
import { memo, useEffect, useRef, useState } from 'react'
import styles from '../../Orders.module.css'
import PhotoCard from '../PhotoCard'
import galkaSvg from '../../../../assets/icons/galka.svg'
import { useSelector } from 'react-redux'
import { use } from 'react'
import question from '../../../../assets/images/Auth/question.svg'

const PhotoBlock = memo(
  ({
    childNumber,
    blocksId,
    index,
    photos,
    price,
    oke,
    priceCalendar,
    handleRemoveBlock,
    onChangeHandler,
    inputValue,
    blurRef,
    setIsBlur,
    handleCheckboxChange,
    isChecked,
  }) => {
    const cart = useSelector((state) => state.user.cart)
    // const photoPrice = useSelector(state => state.photoPrice);
    const allPrice = useSelector((state) => state.user.total_price)
    const photoPrice = useSelector((state) => state.user.photoPrice)
    const currentSum = cart.length > 0 ? cart[cart.length - 1].all_price : null
    // const [currentSum, setCurrentSum] = useState(0);
    const [isDigitalChecked, setIsDigitalChecked] = useState(false)
    const currentLineId = photos[0].photoLineId
    const [manualControl, setManualControl] = useState(false) // Новый флаг для ручного управления
    const [isGalkaPhoto, setIsGalkaPhoto] = useState(false)
    const [isGalkaCalendar, setIsGalkaCalendar] = useState(false)
    const [digitalPrice, setDigitalPrice] = useState(0)
    const userData = useSelector((state) => state.user.userData)
    const [ransomDigitalPhotos, setRansomDigitalPhotos] = useState(0)
    const [ransomCalendar, setRansomCalendar] = useState(0)
    const [isLoading, setIsLoading] = useState(true) // Новое состояние для лоадера
    const [isLoading2, setIsLoading2] = useState(true)
    const [hoveredIndexDigital, setHoveredIndexDigital] = useState(null);
    const [hoveredIndexBook, setHoveredIndexBook] = useState(null);

    const roleHasPhotobook =
      userData?.role === 1
        ? userData?.kindergarten?.[0]?.has_photobook
        : userData?.managed_kindergarten?.has_photobook

    // useEffect(() => {
    //   console.log(allPrice)}, [allPrice])
    useEffect(() => {
      if (!priceCalendar) {
        // console.error('priceCalendar is not provided');
        setIsLoading(true)
        console.log(userData)
      } else {
        // console.log('priceCalendar:', priceCalendar);
        setIsLoading(false)
      }

      if (!ransomDigitalPhotos) {
        // console.error('ransomDigitalPhotos is not provided');
        setIsLoading(true)
        console.log(userData)
      } else {
        // console.log('ransomDigitalPhotos:', ransomDigitalPhotos);
        setIsLoading(false)
        console.log(userData)
      }
    }, [priceCalendar, ransomDigitalPhotos])

    useEffect(() => {
      const calculateValues = () => {
        if (!priceCalendar) {
          console.error('priceCalendar is not provided')
          return
        }
        // Пример расчета значений в зависимости от childNumber
        switch (childNumber) {
          case 1:
            setRansomDigitalPhotos(
              priceCalendar.ransom_amount_for_digital_photos,
            ) // Пример значения
            setRansomCalendar(priceCalendar.ransom_amount_for_calendar) // Пример значения
            break
          case 2:
            setRansomDigitalPhotos(
              priceCalendar.ransom_amount_for_digital_photos_second,
            ) // Пример значения
            setRansomCalendar(priceCalendar.ransom_amount_for_calendar_second) // Пример значения
            break
          case 3:
            setRansomDigitalPhotos(
              priceCalendar.ransom_amount_for_digital_photos_third,
            ) // Пример значения
            setRansomCalendar(priceCalendar.ransom_amount_for_calendar_third) // Пример значения
            break
          default:
            setRansomDigitalPhotos(0)
            setRansomCalendar(0)
            console.warn('Invalid childNumber')
        }
      }

      calculateValues()
    }, [childNumber, priceCalendar])

    useEffect(() => {
      // Проверяем, есть ли данные в photoPrice
      if (photoPrice && photoPrice.length > 0) {
        // Если данные есть, выполняем ваш код
        photoPrice.forEach((element) => {
          if (element.photo_type === 0) {
            setDigitalPrice(element.price)
          }
        })
        setIsLoading2(false) // Выключаем загрузку
      } else {
        // Если данных нет, включаем загрузку
        setIsLoading2(true)
      }
    }, [photoPrice]) // Добавляем photoPrice в зависимости, чтобы эффект срабатывал при его изменении

    const prevCheckedState = useRef(isDigitalChecked)
    useEffect(() => {
      console.log('prevCheckedState:', prevCheckedState)
      console.log('has_photobook:', roleHasPhotobook)
      console.log('photoPrice:', photoPrice)
    }, [prevCheckedState])

    useEffect(() => {
      const cartItem = cart?.find(
        (item) => item.photo_line_id === currentLineId,
      )

      if (cartItem?.is_digital == true) {
        setIsDigitalChecked(true)
      }
    }, [])
    //Из-за того что стоит if (cartItem) мы не затрагиваем нется бесконечный рендер
    useEffect(() => {
      // if (ransomDigitalPhotos === 0 || ransomCalendar ==второго и третьего ребенка,
      // и на них не ставятся галочки, если if убрать, ьто нач= 0) {
      //   console.log('ransomDigitalPhotos or ransomCalendar not loaded yet');
      //   return; // Прекращаем выполнение, если данные не загружены
      // }
      const cartItem = cart.find((item) => item.photo_line_id === currentLineId)

      console.log('cartItem', cartItem)
      // console.log('условие', !cartItem?.is_free_digitals && allPrice >= 25)

      // if (cartItem?.is_free_digitals == false && allPrice > 25) {
      //   setCurrentSum(allPrice - 25);
      // }
      // else {
      //   setCurrentSum(allPrice);
      // }
      // console.log('is_free_digitals', cartItem?.is_free_digital)
      // console.log('currentSum', currentSum)

      const shouldActivateCheckbox =
        ransomDigitalPhotos !== undefined &&
        ransomDigitalPhotos !== null &&
        ransomDigitalPhotos !== '' &&
        ransomDigitalPhotos !== 0 &&
        // (currentSum >= ransomDigitalPhotos || cartItem?.is_free_digitals)
        currentSum >= ransomDigitalPhotos

      console.log('currentSum', currentSum)

      const shouldActivateCheckboxCalendar =
        ransomCalendar !== undefined &&
        ransomCalendar !== null &&
        ransomCalendar !== '' &&
        ransomCalendar !== 0 &&
        // (currentSum >= ransomDigitalPhotos || cartItem?.is_free_calendar)
        currentSum >= ransomCalendar

      setIsGalkaPhoto(shouldActivateCheckbox)
      setIsGalkaCalendar(shouldActivateCheckboxCalendar)

      // Если состояние изменилось, вызываем обновление
      if (
        shouldActivateCheckbox !== prevCheckedState.current &&
        !manualControl
      ) {
        console.log('изменения запущены', manualControl)
        setIsDigitalChecked(shouldActivateCheckbox)
        prevCheckedState.current = shouldActivateCheckbox
        console.log('shouldActivateCheckbox', shouldActivateCheckbox)
        handleCheckboxChange(
          { target: { checked: shouldActivateCheckbox, name: 7 } },
          currentLineId,
        )
      }

      // }
      // else console.log('hui:', currentLineId)
    }, [
      allPrice,
      ransomDigitalPhotos,
      ransomCalendar,
      handleCheckboxChange,
      manualControl,
      cart,
      currentLineId,
    ])
    // useEffect(() => {
    //   console.log('manualControl', manualControl);
    //   // Здесь можно выполнить дополнительные действия, которые зависят от manualControl
    // }, [manualControl, currentLineId]);
    // Обработчик изменения чекбокса
    const handleDigitalCheckboxChange = (e, photoLineId) => {
      const { checked } = e.target
      console.log('checked manual in pb', checked)
      const cartItem = cart.find((item) => item.photo_line_id === photoLineId)
      // Флаг ручного управления включается только при ручных действиях
      setManualControl(true)
      setIsDigitalChecked(checked)
      console.log('manualControl', manualControl)

      handleCheckboxChange(e, photoLineId)
      setManualControl(false)

      // Сбрасываем ручное управление, если сумма достигает порога
      if (!checked && currentSum >= ransomDigitalPhotos) {
        // if (!checked && (currentSum >= ransomDigitalPhotos || cartItem?.is_free_digitals)) {
        setManualControl(false)
      }
    }

    if (isLoading) {
      return <h1>Загрузка...</h1> // Компонент лоадера
    }
    if (isLoading2) {
      return <h1>Загрузка...</h1> // Компонент лоадера
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className={styles.photoCardsWrap}>
          {photos.map((photo, index) => (
            <div
              key={`${index}-${photo.number}`}
              className={styles.photoCardWrapper}
            >
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
              {index === 5 && (
                <div className={styles.widgetDelete}>
                  <div className={styles.checkboxInputWrap}>
                    {roleHasPhotobook && (
                      <div className={styles.signature}>
                        <div className={styles.bookCheckbox}>
                          <div className={styles.bookDescr}>Фотокнига</div>
                          <img
                            className={styles.question}
                            src={question}
                            alt="question"
                            onMouseEnter={() => setHoveredIndexBook(true)}
                            onMouseLeave={() => setHoveredIndexBook(false)}
                          ></img>
                          <label className={styles.custom_checkbox}>
                            <input
                              className=""
                              id={blocksId}
                              name={6}
                              type="checkbox"
                              // onChange={(e)=>onChangeHandler(e.target.name, 0 ,  photo.photoLineId, e.target.checked , photo.photoLineId, blocksId)}
                              onChange={(e) =>
                                handleCheckboxChange(e, photo.photoLineId)
                              }
                            />
                            <div className={styles.checkbox}>
                              <div className={styles.checkmark}></div>
                            </div>
                          </label>
                          
                        </div>
                        <p className={`${styles.signatureText} ${!hoveredIndexBook ? styles.hovered : ''}`}>
                          2-4 разворота книги, все кадры, формат 20х30
                        </p>
                      </div>
                    )}
                    <div className={styles.signature}>
                      <div className={styles.bookCheckbox}>
                        <div className={styles.bookDescr}>
                          В электронном виде:{' '}
                          {digitalPrice.length > 3
                            ? digitalPrice.slice(0, -3)
                            : digitalPrice}{' '}
                          рублей
                        </div>
                        <img
                          className={styles.question}
                          src={question}
                          alt="question"
                          onMouseEnter={() => setHoveredIndexDigital(true)}
                          onMouseLeave={() => setHoveredIndexDigital(false)}
                        ></img>
                        <label className={styles.custom_checkbox}>
                          <input
                            className=""
                            id={blocksId}
                            name={7}
                            type="checkbox"
                            checked={isDigitalChecked}
                            onChange={(e) =>
                              handleDigitalCheckboxChange(e, photo.photoLineId)
                            }
                          />
                          <div className={styles.checkbox}>
                            <div className={styles.checkmark}></div>
                          </div>
                        </label>
          
                      </div>
                      <p className={`${styles.signatureText} ${!hoveredIndexDigital ? styles.hovered : ''}`}>
                        Электронная платная версия всех кадров
                      </p>
                    </div>
                  </div>
                  {/* <button className={styles.mainButton} onClick={() => handleRemoveBlock(blocksId, photo.photoLineId)}>Удалить блок</button> */}
                </div>
              )}
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
            {isGalkaPhoto ? (
              <div>
                <img
                  src={galkaSvg}
                  alt="galka"
                  style={{ width: '25px', marginRight: '5px' }}
                />
              </div>
            ) : (
              <div className={styles.dot}></div>
            )}
            <span className={styles.promoString}>
              При заказе от {ransomDigitalPhotos} рублей, вы получите все фото в
              электронном виде
            </span>
          </div>
          <div className={styles.promoStringWrap}>
            {isGalkaCalendar ? (
              <div>
                <img
                  src={galkaSvg}
                  alt="galka"
                  style={{ width: '25px', marginRight: '5px' }}
                />
              </div>
            ) : (
              <div className={styles.dot}></div>
            )}
            <span className={styles.promoString}>
              При заказе от {ransomCalendar} рублей, эл. версия всех фотографий
              календаря в подарок
            </span>
          </div>
        </div>
      </div>
    )
  },
)

export default PhotoBlock
