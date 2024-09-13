import React, { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import './styles/Kindergartens.scss';
import ClientFilter from "../../components-crm/ClientFilter/ClientFilter";
import ClientCard from "../../components-crm/ClientCard/ClientCard";
import { arrayOfObjects } from "../../constants/mockData"; // Импорт ваших данных
import { Pagination } from "react-bootstrap";

const Kindergartens = () => {
    const itemsPerPage = 12; // Количество карточек на странице
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
            <div className="">
                <ClientFilter />
                <div className="d-flex flex-wrap gap-3">
                    {currentItems.map(item => (
                        <ClientCard key={item.id} data={item} /> // Используйте ключ для оптимизации
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
    );
}

export default Kindergartens;