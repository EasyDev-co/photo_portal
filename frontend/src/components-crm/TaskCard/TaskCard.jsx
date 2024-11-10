import { Card } from 'react-bootstrap'
import burger from '../../assets/icons/card-burger.svg'
import styles from './TaskCard.style.css'

import { useNavigate } from 'react-router-dom'

const TaskCard = ({ data, handleShowEdit }) => {

  function formatDate(dateString) {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${day}-${month}-${year}`
  }

  console.log(data)
  //   const navigate = useNavigate()

  return (
    <Card
      className="card-shadow  employee-card"
      style={{
        width: '381px',
        borderRadius: '8px',
        border: 'none',
        padding: '24px',
        height: '100%',
        maxHeight: '270px',
      }}
      onClick={() => handleShowEdit(data.id)}
    >
      <Card.Header className="card-header" style={{ border: 'none' }}>
        <div className="card-header-title cursor-pointer">
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
              {formatDate(data.created_at.slice(0, 10))}
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
    </Card>
  )
}

export default TaskCard
