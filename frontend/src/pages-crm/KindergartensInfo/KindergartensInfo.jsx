import { Card, CardHeader, Form, Button } from "react-bootstrap";
import './styles/KindergartensInfo.scss'
import { arrayOfObjects } from "../../constants/mockData";
import DatePicker from "../../components-crm/DatePicker/DatePicker";
import calendar from '../../assets/icons/calendar-event.svg'
import { useState, useEffect } from "react";
import OrderCard from "../../components-crm/OrderCard/OrderCard";
import Notes from "../../components-crm/Notes/Notes";
import { fetchSingleClientCardsWithTokenInterceptor } from "../../http/client-cards/getClientCard";
import { useParams } from "react-router-dom";


const KindergartensInfo = () => {

    const { id } = useParams();
    const [isActive, setIsActive] = useState(false);
    const [clientCardData, setClientCardData] = useState(null); // State to store fetched client card data
    const access = localStorage.getItem('access'); // Get access token


    useEffect(() => {
        const fetchClientCard = async () => {
            try {
                const response = await fetchSingleClientCardsWithTokenInterceptor(access, id); // Use the function to fetch data
                if (response.ok) {
                    const data = await response.json(); // Parse the response JSON
                    setClientCardData(data); // Store the data in state
                    console.log(data); // Log the fetched data
                } else {
                    console.error('Failed to fetch single client card');
                }
            } catch (error) {
                console.error('Error fetching single client card:', error);
            }
        };

        fetchClientCard(); // Call the fetch function on component mount
    }, [access]);

    console.log(clientCardData);
    
if(clientCardData){
    return (
        <div className="page-crm">
            <div className="d-flex gap-3">
                <div className="d-flex flex-column gap-3">
                    <div className="d-flex gap-3">
                        <Card className="border-0 d-flex flex-column gap-2 card-shadow" style={{
                            padding: '24px',
                            width: '470px',
                            height: 'auto'
                        }}>
                            <CardHeader style={{
                                fontSize: '20px'
                            }} className="border-0 fw-600 p-0">
                                Детский сад {clientCardData.name}
                            </CardHeader>
                            <Card.Body className="fw-400 text-secondary p-0">
                                120 детей, VIP
                            </Card.Body>
                        </Card>
                        <Card className="border-0 d-flex flex-column gap-2 card-shadow" style={{
                            padding: '24px',
                            width: '470px',
                            height: 'auto'
                        }}>
                            <CardHeader style={{
                                fontSize: '20px',
                            }} className="border-0 fw-600 p-0">
                                Процент заведующих:
                            </CardHeader>
                            <CardHeader style={{
                                fontSize: '20px',

                            }} className="border-0 fw-600 p-0">
                                Скидка:
                            </CardHeader>
                        </Card>
                    </div>
                    <div className="card-shadow">
                        <Card className="border-0" style={{
                            padding: '24px',
                            gap: '24px'
                        }}>
                            <CardHeader style={{
                                fontSize: '20px',
                            }} className="border-0 fw-600 p-0">
                                Текущие задачи
                            </CardHeader>
                            <Card.Body className="p-0 gap-2 d-flex flex-column scroll-body" style={{
                                height: '240px'
                            }}>
                                {arrayOfObjects.map(elem => {
                                    return (
                                        <Card key={elem.id} className="d-flex flex-row align-items-center justify-content-between p-2 ">
                                            <div>
                                                <CardHeader style={{
                                                    fontSize: '20px',

                                                }} className="border-0 fw-500 p-0">
                                                    Название задачи
                                                </CardHeader>
                                                <Card.Body className="p-0" style={{
                                                    color: '#0a58ca'
                                                }}>
                                                    До 08.08.2024
                                                </Card.Body>
                                            </div>
                                            <div>
                                                <Form.Check
                                                    type='checkbox'
                                                    id='1'
                                                    className='form-check-custom-task shadow-none'
                                                />
                                            </div>
                                        </Card>
                                    )
                                })}

                            </Card.Body>
                        </Card>
                    </div>
                    <div className="card-shadow">
                        <Card className="border-0" style={{
                            padding: '24px',
                            gap: '24px'
                        }}>
                            <Card.Header style={{
                                fontSize: '20px',

                            }} className="border-0 fw-600 p-0">
                                Текущая фотосессия
                            </Card.Header>
                            <Card.Body className="p-0">
                                <Form className="d-flex gap-3">
                                    <Form.Group className="w-50">
                                        <DatePicker
                                            label={'Дата взаимодействия'}
                                            placeholder={'Не указано'}
                                            setIsActive={setIsActive}
                                            img={calendar}
                                            isActive={isActive}
                                            navTitles={{
                                                days: 'MMMM <i>yyyy</i>',
                                                months: 'yyyy',
                                            }} />
                                    </Form.Group>
                                    <Form.Group className="w-50">
                                        <Form.Label className="text-secondary">Дедлайн</Form.Label>
                                        <Form.Control className='shadow-none ps-3' placeholder='Не указано' />
                                    </Form.Group>
                                </Form>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="card-shadow">
                        <OrderCard region={clientCardData.region.country} city={clientCardData.region.name}/>
                    </div>
                </div>
                <div className="flex-grow-1 d-flex flex-column gap-3">
                    <Card className="border-0 d-flex flex-column gap-2 card-shadow " style={{
                        padding: '24px',
                        height: 'auto'
                    }}>
                        <div className="border" style={{
                            borderRadius: '8px'
                        }}>
                            <Card className="border-0 p-2 text-center ">

                                <Card.Header className="border-0 fw-600 p-0 justify-content-center" style={{ fontSize: '20px' }}>
                                    Марк Ифанасьев
                                </Card.Header>
                                <Card.Title className="fs-6 text-secondary">
                                    Директор
                                </Card.Title>
                            </Card>
                        </div>
                        <Card.Body className="p-0">
                            <div className="d-flex gap-1"><div className="fw-400 text-secondary">Прошлый менеджер: </div><div className="fw-400"> asdasda</div></div>
                        </Card.Body>
                        <Card.Body className="p-0">
                            <div className="d-flex gap-1"><div className="fw-400 text-secondary">Прошлый менеджер: </div><div className="fw-400"> asdasda</div></div>
                        </Card.Body>
                    </Card>
                    <Card className="border-0 d-flex flex-column gap-2 card-shadow " style={{
                        padding: '24px',
                        height: 'auto'
                    }}>
                        <Card.Header style={{
                            fontSize: '20px',

                        }} className="border-0 fw-600 p-0">
                            Заметки
                        </Card.Header>
                        <Notes />
                        <Button className='btn-filter-reset text-center'>Сбросить</Button>
                    </Card>
                    <Card className="border-0 d-flex flex-column gap-2 card-shadow " style={{
                        padding: '24px',
                        height: 'auto'
                    }}>
                        <Card.Header style={{
                            fontSize: '20px',

                        }} className="border-0 fw-600 p-0">
                            История заказов
                        </Card.Header>
                        <Card className="">
                            <Card.Header className="border-0">
                                <div>
                                    08.08.2024
                                </div>
                                <div style={{
                                    color: '#0a58ca'
                                }}>
                                    Имя Фамилия
                                </div>
                            </Card.Header>
                            <Card.Body className="py-2" style={{
                                maxWidth: '545px'
                            }}>
                                <div className="truncate text-secondary">
                                    Lorem ipsum dolor sit amet consectetur. Vel commodo nullam eu gravida porttitor ut. Faucibus sodales viverra arcu quis dignissim at tellus at posuere.
                                </div>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header className="border-0">
                                <div>
                                    08.08.2024
                                </div>
                                <div style={{
                                    color: '#0a58ca'
                                }}>
                                    Имя Фамилия
                                </div>
                            </Card.Header>
                            <Card.Body className="py-2" style={{
                                maxWidth: '545px'
                            }}>
                                <div className="truncate text-secondary">
                                    Lorem ipsum dolor sit amet consectetur. Vel commodo nullam eu gravida porttitor ut. Faucibus sodales viverra arcu quis dignissim at tellus at posuere.
                                </div>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header className="border-0">
                                <div>
                                    08.08.2024
                                </div>
                                <div style={{
                                    color: '#0a58ca'
                                }}>
                                    Имя Фамилия
                                </div>
                            </Card.Header>
                            <Card.Body className="py-2" style={{
                                maxWidth: '545px'
                            }}>
                                <div className="truncate text-secondary">
                                    Lorem ipsum dolor sit amet consectetur. Vel commodo nullam eu gravida porttitor ut. Faucibus sodales viverra arcu quis dignissim at tellus at posuere.
                                </div>
                            </Card.Body>
                        </Card>
                        <Button className='btn-filter-reset text-center'>Сбросить</Button>
                    </Card>
                    <Card className="border-0 d-flex flex-column gap-2 card-shadow " style={{
                        padding: '24px',
                        height: 'auto'
                    }}>
                        <Card.Header style={{
                            fontSize: '20px',

                        }} className="border-0 fw-600 p-0">
                            История изменений
                        </Card.Header>
                        <Card className="">
                            <Card.Header className="border-0">
                                <div>
                                    08.08.2024
                                </div>
                                <div style={{
                                    color: '#0a58ca'
                                }}>
                                    Имя Фамилия
                                </div>
                            </Card.Header>
                            <Card.Body className="py-2" style={{
                                maxWidth: '545px'
                            }}>
                                <div className="truncate text-secondary">
                                    Lorem ipsum dolor sit amet consectetur. Vel commodo nullam eu gravida porttitor ut. Faucibus sodales viverra arcu quis dignissim at tellus at posuere.
                                </div>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header className="border-0">
                                <div>
                                    08.08.2024
                                </div>
                                <div style={{
                                    color: '#0a58ca'
                                }}>
                                    Имя Фамилия
                                </div>
                            </Card.Header>
                            <Card.Body className="py-2" style={{
                                maxWidth: '545px'
                            }}>
                                <div className="truncate text-secondary">
                                    Lorem ipsum dolor sit amet consectetur. Vel commodo nullam eu gravida porttitor ut. Faucibus sodales viverra arcu quis dignissim at tellus at posuere.
                                </div>
                            </Card.Body>
                        </Card>
                        <Card>
                            <Card.Header className="border-0">
                                <div>
                                    08.08.2024
                                </div>
                                <div style={{
                                    color: '#0a58ca'
                                }}>
                                    Имя Фамилия
                                </div>
                            </Card.Header>
                            <Card.Body className="py-2" style={{
                                maxWidth: '545px'
                            }}>
                                <div className="truncate text-secondary">
                                    Lorem ipsum dolor sit amet consectetur. Vel commodo nullam eu gravida porttitor ut. Faucibus sodales viverra arcu quis dignissim at tellus at posuere.
                                </div>
                            </Card.Body>
                        </Card>
                        <Button className='btn-filter-reset text-center'>Сбросить</Button>
                    </Card>
                </div>

            </div>

        </div>
    );
}
}

export default KindergartensInfo;