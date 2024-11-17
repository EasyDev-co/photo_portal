import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Pagination } from "react-bootstrap";
import { fetchAllTaskWithTokenInterceptor } from "../../http/client-cards/getAllTasks";
import TaskCard from "../../components-crm/TaskCard/TaskCard";
import ClientModal from "../../components-crm/ClientCardModal/ClientModal";
import BasicTaskForm from "../../components-crm/ClientCardModal/Forms/BasicTaskForm";
import EditBasicTaskForm from "../../components-crm/ClientCardModal/Forms/EditBasicTaskForm";
import TasksFilter from "../../components-crm/ClientFilter/TasksFilter";

const Tasks = () => {
    const navigate = useNavigate()
    const access = localStorage.getItem('access')
    const [tasksList, setTasksList] = useState([])
    const itemsPerPage = 12; // Количество карточек на странице
    const [currentPage, setCurrentPage] = useState(1);
    const totalItems = tasksList.length; // Общее количество карточек
    const totalPages = Math.ceil(totalItems / itemsPerPage); // Общее количество страниц
    const [isOpen, setIsOpen] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [editId, setEditId] = useState("");
    const [filters, setFilters] = useState({});


    const handleFilterChange = (newFilters) => {
      console.log(newFilters)
      setFilters(newFilters);
      console.log("Фильтры обновлены:", newFilters);
  };

    const handleShowModal = () => {
      setIsOpen(true)
    }
    const handleCloseModal = () => {
      setIsOpen(false)
    }

    const editTask = (updatedTask) => {
      console.log(updatedTask)
      setTasksList((prevTasks) =>
          prevTasks.map((task) =>
              task.id === updatedTask.id ? updatedTask : task
          )
      );
      const fetchAllTasks = async () => {
        try {
          const response = await fetchAllTaskWithTokenInterceptor({access, filters})
          if (response.ok) {
            const data = await response.json() // Parse the JSON response
            console.log(data.reverse())
            setTasksList(data.reverse()) // Update state with fetched data
          } else {
            console.error('Failed to fetch client cards')
          }
        } catch (error) {
          console.error('Error fetching client cards:', error)
        }
      }

      
      fetchAllTasks()
      console.log(tasksList)
  };

    const handleShowEdit = (id) => {
      console.log('open')
      setEditId(id)
      setShowEdit(true)
    }
    const handleCloseEdit = () => {
      setShowEdit(false)
    }

      const deleteTask = (taskId) => {
        const updatedTasks = tasksList.filter(item => item.id !== taskId);
        setTasksList(updatedTasks)
    }

    // Функция для получения карточек на текущей странице
    const paginate = (array, page_number, page_size) => {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    };

    const currentItems = paginate(tasksList, currentPage, itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const fetchAllTasks = async () => {
          try {
            const response = await fetchAllTaskWithTokenInterceptor({access, filters})
            if (response.ok) {
              const data = await response.json() // Parse the JSON response
              console.log(data.reverse())
              setTasksList(data.reverse()) // Update state with fetched data
            } else {
              console.error('Failed to fetch client cards')
            }
          } catch (error) {
            console.error('Error fetching client cards:', error)
          }
        }

        
        fetchAllTasks()
      }, [access, filters]);
      useEffect(() => {
        console.log(tasksList);
      }, [tasksList])

    return (
        <div className="page-crm"  
        >
            <ClientModal
                title="Добавить задачу"
                show={isOpen}
                handleClose={handleCloseModal}
            >
                <BasicTaskForm closeModal={handleCloseModal} setTasksList={setTasksList}/>
            </ClientModal>
            <ClientModal
                title="Редактировать задачу"
                show={showEdit}
                handleClose={handleCloseEdit}
            >
                <EditBasicTaskForm
                closeModal={handleCloseEdit} 
                deleteItem={deleteTask} 
                taskId={editId} 
                editTask={editTask}/>
            </ClientModal>
            <div className="header-title">
                <h1 className="">Задачи</h1>
                <div>
                    <Button onClick={handleShowModal} className="create-btn">Создать</Button>
                </div>
            </div>
            <TasksFilter onFilterChange={handleFilterChange} />
            <div className="d-flex flex-column justify-content-between"  style={{ height: '100%' }}>
            <div className="d-flex flex-wrap gap-3 align-items-stretch">
                {tasksList.map(item => (
                    <TaskCard handleShowEdit={handleShowEdit} key={item.id} data={item} deleteItem={deleteTask}/>
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

export default Tasks