import { Button, Pagination } from "react-bootstrap";
import './styles/Calendar.scss';
import { useState } from "react";
import CalendarPicker from "../../components-crm/CalendarPicker/CalendarPicker";
import { Form } from "react-bootstrap";
import camera from '../../assets/icons/camera.svg'
import phone from '../../assets/icons/telephone.svg'
import PhotoshootCard from "../../components-crm/PhotoshootCard/PhotoshootCard";
import { arrayOfObjects } from "../../constants/mockData";
import BarChart from "../../components-crm/Chart/Chart";
import { Card } from "react-bootstrap";

const Calendar = () => {
    const [isActive, setIsActive] = useState(true);

    const itemsPerPage = 6; // Количество карточек на странице
    const [currentPage, setCurrentPage] = useState(1);

    const totalItems = arrayOfObjects.length; // Общее количество карточек
    const totalPages = Math.ceil(totalItems / itemsPerPage); // Общее количество страниц

    // Функция для получения карточек на текущей странице
    const paginate = (array, page_number, page_size) => {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    };

    const currentItems = paginate(arrayOfObjects, currentPage, itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    return (
        <div className="page-crm">
            <div className="header-title">
                <h1 className="">Клиенты</h1>
                <div>
                    <Button className="create-btn">Создать</Button>
                </div>

            </div>
            <div className="d-flex column-gap-4 flex-wrap">
                <CalendarPicker
                    inline
                    setIsActive={setIsActive}
                    isActive={isActive}
                />
                <div className="schedule__list flex-grow-1">
                    <div className="d-flex pb-4 align-items-center justify-content-between">
                        <h2>
                            Фотосессии на 18.07.2024
                        </h2>
                        <div className="d-flex align-items-center gap-3">
                            <div>
                                <img src={camera} alt="" />
                            </div>
                            <Form className="shadow-none">
                                <Form.Check // prettier-ignore
                                    type="switch"
                                    id="custom-switch"
                                    className="shadow-none"
                                />
                            </Form>
                            <div>
                                <img src={phone} alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="d-flex flex-column justify-content-between" style={{ height: '90%' }}>
                        <div className="d-flex flex-column gap-2">
                            {currentItems.map(item => (
                                <PhotoshootCard key={item.id} />
                            ))}
                        </div>
                        <Pagination className="justify-content-center py-3 gap-1">
                            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                            {[...Array(totalPages)].map((_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                    active={index + 1 === currentPage}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}
                            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                        </Pagination>
                    </div>
                </div>

            </div>
            <div className="d-flex gap-3 pt-3 flex-wrap">
                <div className="calendar_chart-wrap">
                    <BarChart />
                </div>
                <div className="calendar_chart-wrap">
                    <BarChart />
                </div>
                <div className="d-flex gap-3 flex-column flex-grow-1 ">
                    <div className="shadow-container">
                        <Card className="border-0">
                            <Card.Header className="border-0 fw-600 fs-5 justify-content-center">
                                Марк Ифанасьев
                            </Card.Header>
                            <Card.Title className="text-secondary fs-6 text-center">
                                Количество детей
                            </Card.Title>
                            <Card.Body className="fs-1 text-center fw-600">
                                325
                            </Card.Body>
                        </Card>
                    </div>
                    <div className="shadow-container">
                        <Card className="border-0">
                            <Card.Header className="border-0 fw-600 fs-5 justify-content-center">
                                Марк Ифанасьев
                            </Card.Header>
                            <Card.Title className="text-secondary fs-6 text-center">
                                Количество детей
                            </Card.Title>
                            <Card.Body className="fs-1 text-center fw-600">
                                325
                            </Card.Body>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Calendar;