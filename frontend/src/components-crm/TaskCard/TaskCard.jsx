import { Card } from 'react-bootstrap'
import burger from '../../assets/icons/card-burger.svg'
import styles from './TaskCard.style.css';
import trash from '../../assets/icons/trash.svg';

import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { deleteBasicTaskWithToken } from '../../http/client-cards/deleteBasicTask';

const TaskCard = ({ data, handleShowEdit, deleteItem }) => {
  const [isHovered, setIsHovered] = useState(false);
  const access = localStorage.getItem('access')
  console.log(data)
  function formatDate(dateString) {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${day}-${month}-${year}`
  }

  //   const navigate = useNavigate()
  const handleDelete = () => {
    const deleteTask = async () => {
      try {
        const response = await deleteBasicTaskWithToken(access, data.id) // Use the function to fetch data
        if (response.ok) {

          deleteTask(data.id)
          deleteItem(data.id)
        } else {
          console.error('Failed to delete task')
        }
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }

    deleteTask()
  }

  return (
    <Card
      className="card-shadow  employee-card"
      style={{
        width: '381px',
        borderRadius: '8px',
        border: 'none',
        padding: '24px',
        height: '100%',
        minHeight: '267px',
        maxHeight: '270px',
        cursor: 'pointer',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card.Header onClick={() => handleShowEdit(data.id)} className="card-header" style={{ border: 'none' }}>
        <div className="card-header-title">
          {data.task_type_name}
        </div>
        <div className="card-burger">
          <img src={burger} alt="" />
        </div>
      </Card.Header>
      <Card.Body
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '5px',
        }}
        onClick={() => handleShowEdit(data.id)}
      >
        <Card.Text className="d-flex flex-column gap-3">
          <div className="d-flex gap-1">
            <div className="fw-400 text-secondary">Исполнитель: </div>
            <div className="fw-400">
              {data.executor_fi}
              {/* {data.author.employee_role && data.author.employee_role === 1
                ? 'Руководитель отдела продаж'
                : data.author.employee_role === 2
                ? 'Менеджер'
                : data.author.employee_role === 3
                ? 'Исполнительный дирекотр'
                : 'Должность не указана'} */}
            </div>
          </div>
        </Card.Text>
        <Card.Text className="d-flex flex-column gap-3">
          <div className="d-flex gap-1">
            <div className="fw-400 text-secondary">Статус задачи: </div>
            <div className="fw-400">{data.task_status_name}</div>
          </div>
        </Card.Text>
        <Card.Text className="d-flex flex-column gap-3">
          <div className="d-flex gap-1">
            <div className="fw-400 text-secondary">Дата создания: </div>
            <div className="fw-400">
              {/* {formatDate(data.created_at.slice(0, 10))} */}
              {data.created_at ? formatDate(data.created_at.slice(0, 10)) : 'Дата не указана'}
            </div>
          </div>
        </Card.Text>
        <Card.Text className="d-flex flex-column gap-3">
          <div className="d-flex gap-1">
            <div className="fw-400 text-secondary">Дедлайн: </div>
            <div className="fw-400">
              
              {formatDate(data.date_end.slice(0, 10))}
            </div>
          </div>
        </Card.Text>
      </Card.Body>
      {isHovered && ( // Условное рендеринг иконки
        <button
          style={{
            position: 'absolute',
            bottom: '25px',
            right: '25px',
            cursor: 'pointer',
          }}
          onClick={handleDelete}
        >
          <img 
          style={{
            width: '20px',
          }} 
          src={trash} alt="Удалить" />
        </button>
      )}
    </Card>
  )
}

export default TaskCard
