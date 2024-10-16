import { Button, Card, Form, Badge } from "react-bootstrap";
import addButton from '../../assets/icons/icon_button-add.svg'
import DatePicker from "../DatePicker/DatePicker";
import calendar from '../../assets/icons/calendar-event.svg'
import { useState } from "react";
import './styles/OrderCard.scss'
import LocationMap from "../YMap/LocationMap";

const OrderCard = ({region, city}) => {
    const [isActive, setIsActive] = useState(false);
    const [showInfo, setShowInfo] = useState(false)
    const [showMap, setShowMap] = useState(false)

    const handleInfoShow =()=>{
        setShowInfo(prev => !prev)
    }

    const handleMapShow =()=>{
        setShowMap(prev=> !prev)
    }

    return (

        <Card className="border-0 d-flex flex-column"
            style={{
                padding: '24px',
                gap: '56px'
            }}
        >
            <Card className="border-0 p-0" style={{
                gap: '24px'
            }}>
                <Card.Header style={{
                    fontSize: '17px'
                }} className="border-0 fw-600 p-0">
                    Местонахождение
                    <div className="cursor-pointer">
                        <button  onClick={handleMapShow}> <img src={addButton} alt=""  /></button>
                    </div>
                </Card.Header>
                {showMap&&<Card.Body className="p-0 d-flex gap-3 flex-column">
                    <div className="map-wrap border " style={{
                        borderRadius: '8px'
                    }}>
                        <LocationMap
                            width={'100%'} 
                        />
                    </div>
                    <div className="d-flex gap-3">
                        <Form.Group className="flex-grow-1">
                            <Form.Label className="text-secondary" style={{ fontSize: '15px' }}>Регион</Form.Label>
                            <Form.Control className='shadow-none ps-3' placeholder={`${region}`} />
                        </Form.Group>
                        <Form.Group className="flex-grow-1">
                            <Form.Label className="text-secondary" style={{ fontSize: '15px' }}>Город</Form.Label>
                            <Form.Control className='shadow-none ps-3' placeholder={`${city}`} />
                        </Form.Group>
                        <Form.Group className="flex-grow-1">
                            <Form.Label className="text-secondary" style={{ fontSize: '15px' }}>Адрес</Form.Label>
                            <Form.Control className='shadow-none ps-3' placeholder='Не указано' />
                        </Form.Group>
                    </div>
                </Card.Body>}
            </Card>
            <Card className="border-0 p-0" style={{
                gap: '24px'
            }}>
                <Card.Header style={{
                    fontSize: '17px',
                }} className="border-0 fw-600 p-0">
                    Контактная информация
                    <div className="cursor-pointer">
                        <button  onClick={handleInfoShow}> <img src={addButton} alt=""  /></button>
                    </div>
                </Card.Header>
                {showInfo&&<Card.Body className="p-3 border" style={{
                    borderRadius: '8px'
                }}>
                    <div className="d-flex flex-column gap-3">
                        <div className="d-flex gap-3">
                            <div className="flex-grow-1 d-flex flex-column gap-3 justify-content-between">
                                <Card className="border-0 p-2">
                                    <Card.Header className="border-0 fw-600 p-0" style={{ fontSize: '17px' }}>
                                        Марк Ифанасьев
                                    </Card.Header>
                                    <Card.Title className="fs-6 text-secondary">
                                        Директор
                                    </Card.Title>
                                </Card>
                                <Card className="border-0">
                                    <Form.Group className="">
                                        <Form.Label className="text-secondary" style={{ fontSize: '15px' }}>Почта</Form.Label>
                                        <Form.Control className='shadow-none ps-3' placeholder='Не указано' />
                                    </Form.Group>
                                </Card>
                            </div>
                            <div className="flex-grow-1 d-flex flex-column gap-3">
                                <Card className="border-0">
                                    <Form.Group className="">
                                        <Form.Label className="text-secondary" style={{ fontSize: '15px' }}>Номер</Form.Label>
                                        <Form.Control className='shadow-none ps-3' placeholder='Не указано' />
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
                                            }} />
                                    </Form.Group>
                                </Card>
                            </div>
                        </div>
                        <div>
                            <Card className="border-0 gap-3">
                                <div className="fw-500 text-center" style={{
                                    fontSize: '15px'
                                }}>Логин заведующего</div>
                                <div className="d-flex gap-3">
                                    <Form.Group className="flex-grow-1">
                                        <Form.Label className="text-secondary" style={{ fontSize: '15px' }}>Логин</Form.Label>
                                        <Form.Control className='shadow-none ps-3' placeholder='Не указано' />
                                    </Form.Group>
                                    <Form.Group className="flex-grow-1">
                                        <Form.Label className="text-secondary" style={{ fontSize: '15px' }}>Пароль</Form.Label>
                                        <Form.Control className='shadow-none ps-3' placeholder='Не указано' />
                                    </Form.Group>
                                </div>
                                <Form.Group className="flex-grow-1">
                                    <Form.Label className="text-secondary" style={{ fontSize: '15px' }}>Промокод на скидку</Form.Label>
                                    <Form.Control className='shadow-none ps-3' placeholder='Не указано' />
                                </Form.Group>
                            </Card>
                        </div>
                    </div>
                </Card.Body>}
            </Card>
            <Card className="border-0 p-0" style={{
                gap: '24px'
            }}>
                <Card.Header style={{
                    fontSize: '17px',
                }} className="border-0 fw-600 p-0">
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
                            }} />
                    </Form.Group>
                    <div className="d-flex align-items-end gap-3 flex-grow-1">
                        <Form.Group className="flex-grow-1">
                            <Form.Label className="text-secondary" style={{ fontSize: '15px' }}>Пароль</Form.Label>
                            <Form.Control className='shadow-none ps-3' placeholder='Не указано' />
                        </Form.Group>
                        <Form.Check
                            type='checkbox'
                            id='1'
                            className='form-check-custom-task shadow-none'
                        />
                    </div>
                </Card.Body>
            </Card>

            <Card className="border-0 p-0" style={{
                gap: '24px'
            }}>
                <Card.Header style={{
                    fontSize: '17px',
                }} className="border-0 fw-600 p-0">
                    Фотосессии
                </Card.Header>
                <div className="d-flex justify-content-between px-4">
                    <div className="text-secondary fw-600" style={{ fontSize: '15px' }}>
                        Дата
                    </div>

                </div>
                <Card.Body className="p-0 gap-2 d-flex flex-column scroll-body" style={{
                    height: '230px'
                }}>
                    <div className="call-item pe-5" style={{ fontSize: '15px' }}>
                        26.07.2024
                    </div>
                    <div className="call-item pe-5" style={{ fontSize: '15px' }}>
                        26.07.2024
                    </div>
                    <div className="call-item pe-5" style={{ fontSize: '15px' }}>
                        26.07.2024
                    </div>
                    <div className="call-item pe-5" style={{ fontSize: '15px' }}>
                        26.07.2024
                    </div>
                </Card.Body>
            </Card>
            <Card className="border-0 p-0" style={{
                gap: '24px'
            }}>
                <Card.Header style={{
                    fontSize: '17px',
                }} className="border-0 fw-600 p-0">
                    Звонки
                </Card.Header>
                <div className="d-flex justify-content-between px-4">
                    <div className="text-secondary fw-600" style={{ fontSize: '15px' }}>
                        Дата
                    </div>
                    <div className="text-secondary fw-600 pe-5" style={{ fontSize: '15px' }}>
                        Результат
                    </div>
                </div>
                <Card.Body className="p-0 gap-2 d-flex flex-column scroll-body" style={{
                    height: '230px'
                }}>
                    <div className="call-item pe-5" style={{ fontSize: '15px' }}>
                        26.07.2024
                        <div>
                            <Badge bg="success text-black" >Записан на фотосессию</Badge>
                        </div>
                    </div>
                    <div className="call-item pe-5" style={{ fontSize: '15px' }}>
                        26.07.2024
                        <div>
                            <Badge bg="success" className="text-black" >Записан на фотосессию</Badge>
                        </div>
                    </div>
                    <div className="call-item pe-5" style={{ fontSize: '15px' }}>
                        26.07.2024
                        <div>
                            <Badge bg="warning text-black" >Отправлено коммерческое предложение</Badge>
                        </div>
                    </div>
                    <div className="call-item pe-5" style={{ fontSize: '15px' }}>
                        26.07.2024
                        <div>
                            <Badge bg="danger text-black" >Отказ</Badge>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            <Card className="border-0 p-0" style={{
                gap: '24px'
            }}>
                <Card.Header style={{
                    fontSize: '17px',
                }} className="border-0 fw-600 p-0">
                    Другое
                </Card.Header>
                <Card.Body className="p-0 d-flex flex-column gap-3">
                    <div className="d-flex gap-3">
                        <Form.Group className="flex-grow-1">
                            <Form.Label className="text-secondary" style={{ fontSize: '15px' }}>Количество детей</Form.Label>
                            <Form.Control className='shadow-none ps-3' placeholder='Не указано' />
                        </Form.Group>
                        <Form.Group className="flex-grow-1">
                            <Form.Label className="text-secondary" style={{ fontSize: '15px' }}>Количество детей на фотосессию</Form.Label>
                            <Form.Control className='shadow-none ps-3' placeholder='Не указано' />
                        </Form.Group>
                    </div>
                    <Form.Group className="flex-grow-1">
                        <Form.Label className="text-secondary" style={{ fontSize: '15px' }}>Реквизиты</Form.Label>
                        <Form.Control className='shadow-none ps-3' placeholder='Не указано' />
                    </Form.Group>
                </Card.Body>
            </Card>
        </Card>
    );
}

export default OrderCard;