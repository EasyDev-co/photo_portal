import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Pagination } from "react-bootstrap";

import { fetchEmployeeskWithTokenInterceptor } from "../../http/employees/getEmployeeList";

import EmployeeCard from "../EmployeeCard/EmployeeCard";

const Employees = () => {
    const navigate = useNavigate()
    const access = localStorage.getItem('access')

    const [employeeList, setEmployeeList] = useState([])

    const itemsPerPage = 12; // Количество карточек на странице
    const [currentPage, setCurrentPage] = useState(1);

    const totalItems = employeeList.length; // Общее количество карточек
    const totalPages = Math.ceil(totalItems / itemsPerPage); // Общее количество страниц

    // Функция для получения карточек на текущей странице
    const paginate = (array, page_number, page_size) => {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    };

    const currentItems = paginate(employeeList, currentPage, itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(()=>{
        const fetchList = async () => {
            try {
              const response = await fetchEmployeeskWithTokenInterceptor({access})
              if (response.ok) {
                const data = await response.json() // Parse the JSON response
                setEmployeeList(data.reverse()) // Update state with fetched data
              } else {
                console.error('Failed to fetch client cards')
              }
            } catch (error) {
              console.error('Error fetching client cards:', error)
            }
          }


          fetchList()
    }, [access])

    return (
        <div className="page-crm"  style={{
            height: '100vh'
        }}>
            <div className="header-title">
                <h1 className="">Сотрудники</h1>
                <div>
                    <Button onClick={()=>navigate('/crm/employees/create')} className="create-btn">Создать</Button>
                </div>
               
            </div>
            <div className="d-flex flex-column justify-content-between"  style={{ height: '100%' }}>
            <div className="d-flex flex-wrap gap-3 align-items-stretch">
    {employeeList.map(item => (
        <EmployeeCard key={item.id} data={item}/>
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

export default Employees