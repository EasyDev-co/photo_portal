import { Button, Card, Form, Badge } from 'react-bootstrap'
import addButton from '../../assets/icons/icon_button-add.svg'
import DatePicker from '../DatePicker/DatePicker'
import calendar from '../../assets/icons/calendar-event.svg'
import { useState } from 'react'
import './styles/OrderCard.scss'
import LocationMap from '../YMap/LocationMap'
import { patchClientCardWithToken } from '../../http/client-cards/patchClientCard'
import ClientModal from '../ClientCardModal/ClientModal'
import CallForm from '../ClientCardModal/Forms/CallForm'
import deleteIcon from '../../assets/icons/trash.svg'
import { deleteCallWithToken } from '../../http/client-cards/deleteCall'

const OrderCard = ({
  region,
  city,
  itemName,
  id,
  historyCalls,
  managerInfo,
  photoThemes,
  address,
  children_count,
  children_for_photoshoot,
  garden_details,
  responsible_manager,
  addCall,
  deleteItemCall
}) => {
  const [isActive, setIsActive] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [showModalCall, setShowModalCall] = useState(false)
  const access = localStorage.getItem('access')

  const [regionData, setRegionData] = useState({
    id: id || null,
    name: itemName || null,
    region: { country: region || '', name: city || '', address: address || '' },
  })
  const [managerData, setManagerData] = useState(managerInfo || {})
  const [childrenData, setChildrenData] = useState({
    children_count: children_count || '',
    children_for_photoshoot: children_for_photoshoot || '',
    garden_details: garden_details || ''
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
    return date.toLocaleDateString('ru-RU', options)
  }

  const handleShowCall = () => {
    setShowModalCall(true)
  }
  const handleCloseCall = () => {
    setShowModalCall(false)
  }

  const handleDeleteCall = (callId)=>{
    const deleteCall = async () => {
        try {
          const response = await deleteCallWithToken(access, callId) // Use the function to fetch data
          if (response.ok) {

            deleteItemCall(callId);
          } else {
            console.error('Failed to delete task')
          }
        } catch (error) {
          console.error('Error deleting task:', error)
        }
      }
  
      deleteCall()
  }


  const handleInfoShow = () => {
    setShowInfo((prev) => !prev)
  }

  const handleMapShow = () => {
    setShowMap((prev) => !prev)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target

    setRegionData((prevData) => ({
      ...prevData,
      region: {
        ...prevData.region,
        [name]: value,
      },
    }))
  }

  const handleManagerChange = (e) => {
    const { name, value } = e.target
    setManagerData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleChildrenChange = (e) => {
    const { name, value } = e.target
    setChildrenData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handlePatchClientCard = () => {
    const data = {
      address: regionData.region.address || "Не указано ",
      city: regionData.region.name || "Не указано ",
      children_count: childrenData.children_count,
      children_for_photoshoot: childrenData.children_for_photoshoot,
      garden_details:childrenData.garden_details
    }
    const patchClientCard = async () => {
      try {
        const response = await patchClientCardWithToken(access, id, data)
        if (response.ok) {
          const data = await response.json()
        } else {
          console.error('Failed to patch single client card')
        }
      } catch (error) {
        console.error('Error patch single client card:', error)
      }
    }
    patchClientCard()
  }

  return (
    <div>
      <ClientModal
        title="Создать звонок"
        show={showModalCall}
        handleClose={handleCloseCall}
      >
        <CallForm responsible_manager={responsible_manager} closeModal={handleCloseCall} cardId={id} addCall={addCall} />
      </ClientModal>
      <Card
        className="border-0 d-flex flex-column"
        style={{
          padding: '24px',
          gap: '56px',
        }}
      >
        <Card
          className="border-0 p-0"
          style={{
            gap: '24px',
          }}
        >
          <Card.Header
            style={{
              fontSize: '17px',
            }}
            className="border-0 fw-600 p-0"
          >
            Местонахождение
            <div className="cursor-pointer">
              <button onClick={handleMapShow}>
                {' '}
                <img src={addButton} alt="" />
              </button>
            </div>
          </Card.Header>
          {showMap && (
            <Card.Body className="p-0 d-flex gap-3 flex-column">
              <div
                className="map-wrap border "
                style={{
                  borderRadius: '8px',
                }}
              >
                <LocationMap width={'100%'} />
              </div>
              <div className="d-flex gap-3">
                <Form.Group className="flex-grow-1">
                  <Form.Label
                    className="text-secondary"
                    style={{ fontSize: '15px' }}
                  >
                    Регион
                  </Form.Label>
                  <Form.Control
                    className="shadow-none ps-3"
                    placeholder="Не указано"
                    name="country"
                    value={regionData.region.country}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="flex-grow-1">
                  <Form.Label
                    className="text-secondary"
                    style={{ fontSize: '15px' }}
                  >
                    Город
                  </Form.Label>
                  <Form.Control
                    className="shadow-none ps-3"
                    placeholder="Не указано"
                    name="name"
                    value={regionData.region.name}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group className="flex-grow-1">
                  <Form.Label
                    className="text-secondary"
                    style={{ fontSize: '15px' }}
                  >
                    Адрес
                  </Form.Label>
                  <Form.Control
                    className="shadow-none ps-3"
                    placeholder="Не указано"
                    name="address"
                    value={regionData.region.address}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </div>
              <div>
                <Button className="create-btn" onClick={handlePatchClientCard}>
                  Обновить
                </Button>
              </div>
            </Card.Body>
          )}
        </Card>
        <Card
          className="border-0 p-0"
          style={{
            gap: '24px',
          }}
        >
          <Card.Header
            style={{
              fontSize: '17px',
            }}
            className="border-0 fw-600 p-0"
          >
            Контактная информация
            <div className="cursor-pointer">
              <button onClick={handleInfoShow}>
                {' '}
                <img src={addButton} alt="" />
              </button>
            </div>
          </Card.Header>
          {showInfo && (
            <Card.Body
              className="p-3 border"
              style={{
                borderRadius: '8px',
              }}
            >
              <div className="d-flex flex-column gap-3">
                <div className="d-flex gap-3">
                  <div className="flex-grow-1 d-flex flex-column gap-3 justify-content-between">
                    <Card className="border-0 p-2">
                      <Card.Header
                        className="border-0 fw-600 p-0"
                        style={{ fontSize: '17px' }}
                      >
                        <p style={{ textTransform: 'capitalize' }}>
                          {managerInfo.first_name} {managerInfo.last_name}
                        </p>
                      </Card.Header>
                      <Card.Title className="fs-6 text-secondary">
                        Директор
                      </Card.Title>
                    </Card>
                    <Card className="border-0">
                      <Form.Group className="">
                        <Form.Label
                          className="text-secondary"
                          style={{ fontSize: '15px' }}
                        >
                          Почта
                        </Form.Label>
                        <Form.Control
                          className="shadow-none ps-3"
                          name="email"
                          placeholder="Не указано"
                          value={managerData.email || ''}
                          onChange={handleManagerChange}
                        />
                      </Form.Group>
                    </Card>
                  </div>
                  <div className="flex-grow-1 d-flex flex-column gap-3">
                    <Card className="border-0">
                      <Form.Group className="">
                        <Form.Label
                          className="text-secondary"
                          style={{ fontSize: '15px' }}
                        >
                          Номер
                        </Form.Label>
                        <Form.Control
                          className="shadow-none ps-3"
                          placeholder="Не указано"
                          name="phone_number"
                          value={managerData.phone_number || ''}
                          onChange={handleManagerChange}
                        />
                      </Form.Group>
                    </Card>
                    <Card className="border-0">
                      <Form.Group className="" style={{ fontSize: '15px' }}>
                        <DatePicker
                          label={'День рождения заведующего'}
                          placeholder={'Не указано'}
                          setIsActive={setIsActive}
                          img={calendar}
                          isActive={isActive}
                          navTitles={{
                            days: 'MMMM <i>yyyy</i>',
                            months: 'yyyy',
                          }}
                        />
                      </Form.Group>
                    </Card>
                  </div>
                </div>
                <div>
                  <Card className="border-0 gap-3">
                    <div
                      className="fw-500 text-center"
                      style={{
                        fontSize: '15px',
                      }}
                    ></div>
                    <Form.Group className="flex-grow-1">
                      <Form.Label
                        className="text-secondary"
                        style={{ fontSize: '15px' }}
                      >
                        Промокод на скидку
                      </Form.Label>
                      <Form.Control
                        className="shadow-none ps-3"
                        placeholder="Не указано"
                        name="promocode"
                        value={managerData.promocode || ''}
                        onChange={handleManagerChange}
                      />
                    </Form.Group>
                  </Card>
                </div>
              </div>
            </Card.Body>
          )}
        </Card>
        <Card
          className="border-0 p-0"
          style={{
            gap: '24px',
          }}
        >
          <Card.Header
            style={{
              fontSize: '17px',
            }}
            className="border-0 fw-600 p-0"
          >
            Сбор заказа
          </Card.Header>
          <Card.Body className="p-0 d-flex gap-3">
            <Form.Group className="flex-grow-1">
              <DatePicker
                label={'День рождения заведующего'}
                placeholder={'Не указано'}
                setIsActive={setIsActive}
                img={calendar}
                isActive={isActive}
                navTitles={{
                  days: 'MMMM <i>yyyy</i>',
                  months: 'yyyy',
                }}
              />
            </Form.Group>
            <div className="d-flex align-items-end gap-3 flex-grow-1">
              <Form.Group className="flex-grow-1">
                <Form.Label
                  className="text-secondary"
                  style={{ fontSize: '15px' }}
                >
                  Пароль
                </Form.Label>
                <Form.Control
                  className="shadow-none ps-3"
                  placeholder="Не указано"
                />
              </Form.Group>
              <Form.Check
                type="checkbox"
                id="1"
                className="form-check-custom-task shadow-none"
              />
            </div>
          </Card.Body>
        </Card>

        <Card
          className="border-0 p-0"
          style={{
            gap: '24px',
          }}
        >
          <Card.Header
            style={{
              fontSize: '17px',
            }}
            className="border-0 fw-600 p-0"
          >
            Фотосессии
          </Card.Header>
          <div className="d-flex justify-content-between px-4">
            <div className="text-secondary fw-600" style={{ fontSize: '15px' }}>
              Дата
            </div>
          </div>
          <Card.Body
            className="p-0 gap-2 d-flex flex-column scroll-body"
            style={{
              height: '230px',
            }}
          >
            {photoThemes.all_photo_themes.length > 0 ? (
              photoThemes.all_photo_themes.map((item, i) => {
                return (
                  <div
                    key={i}
                    className="call-item pe-5"
                    style={{ fontSize: '15px' }}
                  >
                    {formatDate(item.date_start)}
                  </div>
                )
              })
            ) : (
              <p>Фотосессий нет</p>
            )}
          </Card.Body>
        </Card>
        <Card
          className="border-0 p-0"
          style={{
            gap: '24px',
          }}
        >
          <Card.Header
            style={{
              fontSize: '17px',
            }}
            className="border-0 fw-600 p-0"
          >
            Звонки
            <div className="cursor-pointer">
              <button onClick={handleShowCall}>
                {' '}
                <img src={addButton} alt="" />
              </button>
            </div>
          </Card.Header>
          <div className="d-flex justify-content-between px-4">
            <div className="text-secondary fw-600" style={{ fontSize: '15px' }}>
              Дата
            </div>
            <div
              className="text-secondary fw-600 pe-5"
              style={{ fontSize: '15px' }}
            >
              Результат
            </div>
          </div>
          <Card.Body
            className="p-0 gap-2 d-flex flex-column scroll-body"
            style={{
              height: '230px',
            }}
          >
            {historyCalls &&
              historyCalls.map((item, i) => {
                console.log(item)
                return (
                  <div
                    key={i}
                    className="call-item pe-2"
                    style={{ fontSize: '15px' }}
                  >
                    {formatDate(item.created_at)}
                    <div className='call-status'>
                      <div>
                        {item.call_status==1 ? (<Badge bg="danger text-black">Отказ</Badge>) 
                        : item.call_status==2 ? (<Badge bg="success text-black">Записан на фотосессию</Badge>) 
                        : (<Badge bg="warning text-black">Отправлено коммерческое предложение</Badge>)}
                      </div>
                      <button onClick={() => handleDeleteCall(item.id)}>
                        <img 
                        className='delete-icon_call' 
                        src={deleteIcon} 
                        alt='Мусорная корзина'
                        ></img>
                      </button>
                    </div>
                  </div>
                )
              })}
          </Card.Body>
        </Card>

        <Card
          className="border-0 p-0"
          style={{
            gap: '24px',
          }}
        >
          <Card.Header
            style={{
              fontSize: '17px',
            }}
            className="border-0 fw-600 p-0"
          >
            Другое
          </Card.Header>
          <Card.Body className="p-0 d-flex flex-column gap-3">
            <div className="d-flex gap-3">
              <Form.Group className="flex-grow-1">
                <Form.Label
                  className="text-secondary"
                  style={{ fontSize: '15px' }}
                >
                  Количество детей
                </Form.Label>
                <Form.Control
                  className="shadow-none ps-3"
                  placeholder="Не указано"
                  name="children_count"
                  onChange={handleChildrenChange}
                  value={childrenData.children_count}
                />
              </Form.Group>
              <Form.Group className="flex-grow-1">
                <Form.Label
                  className="text-secondary"
                  style={{ fontSize: '15px' }}
                >
                  Количество детей на фотосессию
                </Form.Label>
                <Form.Control
                  className="shadow-none ps-3"
                  placeholder="Не указано"
                  value={childrenData.children_for_photoshoot}
                  onChange={handleChildrenChange}
                  name="children_for_photoshoot"
                />
              </Form.Group>
            </div>
            <Form.Group className="flex-grow-1">
              <Form.Label className="text-secondary" style={{ fontSize: '15px' }}>
                Реквизиты
              </Form.Label>
              <Form.Control
                className="shadow-none ps-3"
                placeholder="Не указано"
                name="garden_details"
                value={childrenData.garden_details}
                onChange={handleChildrenChange}
              />
            </Form.Group>
          </Card.Body>
          <div>
                <Button className="create-btn" onClick={handlePatchClientCard}>
                  Обновить
                </Button>
              </div>
        </Card>
      </Card>
      </div>
  )
}

export default OrderCard
