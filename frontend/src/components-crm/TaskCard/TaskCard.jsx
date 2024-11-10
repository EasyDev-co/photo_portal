import { Card } from 'react-bootstrap'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import burger from '../../assets/icons/card-burger.svg'
import pencilSq from '../../assets/icons/pencil-square.svg'
import trash from '../../assets/icons/trash.svg'
import styles from './TaskCard.style.css'

import { useNavigate } from 'react-router-dom'

const TaskCard = ({ data, handleShowEdit }) => {

  const types = {
    "1": "Звонок",
    "2": "Сбор оплаты + отправка ссылок",
    "3": "Принять заказ",
    "4": "Позвонить холодный/списки",
    "5": "Проверить отправку образцов, Готовые фото.",
    "6": "Теплые сады",
    "7": "Напомнить о записи",
    "8": "Позвонить по КП, Проверить смс по Вотсапп",
  }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        
        return `${day}-${month}-${year}`;
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
        maxHeight: '270px'
      }}
      onClick={()=>handleShowEdit(data.id)}
    >
      <Card.Header
        className="card-header"
        style={{ border: 'none' }}
      >
        <div className="card-header-title cursor-pointer">
          {types[data.task_type]} 
        </div>
        <OverlayTrigger
          trigger="click"
          key={'bottom'}
          placement={'bottom'}
          overlay={
            <Popover
              className="py-2 px-3"
              id={`popover-positioned-${'bottom'}`}
            >
              <div className="card-popup-btn">
                <div className=" fs-14">Редактировать</div>
                <div className="card-icon">
                  <img src={pencilSq} alt="" />
                </div>
              </div>
              <div className="  card-popup-btn">
                <div className="fs-14">Удалить</div>
                <div className="card-icon">
                  <img src={trash} alt="" />
                </div>
              </div>
            </Popover>
          }
        >
          <div className="card-burger">
            <img src={burger} alt="" />
          </div>
        </OverlayTrigger>
      </Card.Header>
      <Card.Body style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    }}>
        <Card.Text className="d-flex flex-column gap-3">
          <div className="d-flex gap-1">
            <div className="fw-400 text-secondary">Исполнитель: </div>
            <div className="fw-400">
                {data.author.full_name}
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
            <div className="fw-400">
                Выполнено
            </div>
          </div>
        </Card.Text>
        {/* <Card.Text className="d-flex flex-column gap-3">
          <div className="d-flex gap-1">
            <div className="fw-400 text-secondary">Тип задачи: </div>
            <div className="fw-400">
                Созвон
            </div>
          </div>
        </Card.Text> */}
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
