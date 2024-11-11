import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Button, Pagination} from "react-bootstrap";

import {fetchEmployeesWithTokenInterceptor} from "../../http/employees/getEmployeeList";

import EmployeeCard from "../EmployeeCard/EmployeeCard";
import EmployeeFilter from "../ClientFilter/EmployeeFilter";

const Employees = () => {
    const navigate = useNavigate();
    const access = localStorage.getItem('access');

    const [employeeList, setEmployeeList] = useState([]);
    const [selectedManagers, setSelectedManagers] = useState([]); // Состояние для выбранных менеджеров

    const itemsPerPage = 12;
    const [currentPage, setCurrentPage] = useState(1);

    const totalItems = employeeList.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginate = (array, page_number, page_size) => {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    };

    const currentItems = paginate(employeeList, currentPage, itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleManagerSelect = (managers) => {
        setSelectedManagers(managers);
        console.log("Выбранные менеджеры:", managers);
    };

    useEffect(() => {
        const fetchList = async () => {
            try {
                // Извлекаем список ID из выбранных менеджеров
                const ids = selectedManagers.map(manager => manager.id);
                const response = await fetchEmployeesWithTokenInterceptor({access, ids});
                if (response.ok) {
                    const data = await response.json();
                    setEmployeeList(data.reverse());
                } else {
                    console.error('Failed to fetch employees');
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };
        fetchList();
    }, [access, selectedManagers]);

    return (
        <div className="page-crm">
            <div className="header-title">
                <h1 className="">Сотрудники</h1>
                <div>
                    <Button onClick={() => navigate('/crm/employees/create')} className="create-btn">Создать</Button>
                </div>
            </div>
            <EmployeeFilter onManagerSelect={handleManagerSelect}/>
            <div className="d-flex flex-column justify-content-between" style={{height: '100%'}}>
                <div className="d-flex flex-wrap gap-3 align-items-stretch">
                    {employeeList.map(item => (
                        <EmployeeCard key={item.id} data={item}/>
                    ))}
                </div>
                <Pagination className="justify-content-center py-3 gap-1">
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}/>
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            active={index + 1 === currentPage}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)}
                                     disabled={currentPage === totalPages}/>
                </Pagination>
            </div>
        </div>
    );
};

export default Employees;
