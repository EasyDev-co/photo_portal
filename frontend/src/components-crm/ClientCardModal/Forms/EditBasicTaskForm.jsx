import React, { useState, useEffect } from 'react'
import { Form, Button, ModalFooter } from 'react-bootstrap'
import calendar from '../../../assets/icons/calendar-event.svg'
import people from '../../../assets/icons/people.svg'
import { patchTaskWithToken } from '../../../http/client-cards/patchTasks'
import { fetchsingleTaskWithTokenInterceptor } from '../../../http/client-cards/getSingleTask'
import { deleteTaskWithToken } from '../../../http/client-cards/deleteTask'
import DatePicker from '../../DatePicker/DatePicker'

const EditBasicTaskForm = ({
  taskId,
  closeModal,
  formatDate,
  editTask,
  deleteItem,
}) => {
  const access = localStorage.getItem('access') // Get access token

  const [formState, setFormState] = useState({
    text: '',
    date_end: '',
    task_type: '',
    manager: '',
  })

  const [errors, setErrors] = useState({})
  const [isActive, setIsActive] = useState(false)

  function reformatDate(dateStr) {
    const [day, month, year] = dateStr.split('.')
    return `${year}-${month}-${day}`
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleDelete = () => {
    const deleteTask = async () => {
      try {
        const response = await deleteTaskWithToken(access, taskId) // Use the function to fetch data
        if (response.ok) {
          setFormState({
            text: '',
            date_end: '',
            task_type: '',
            manager: '',
          })
          closeModal()
          deleteItem(taskId)
        } else {
          console.error('Failed to delete task')
        }
      } catch (error) {
        console.error('Error deleting task:', error)
      }
    }

    deleteTask()
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = {
      date_end: reformatDate(formState.date_end),
      text: formState.text,
    }

    const postTask = async () => {
      const response = await patchTaskWithToken(access, data, taskId)
      if (response.ok) {
        const res = await response.json()
        editTask(res)
        closeModal()
      } else {
        const err = await response.json()
        setErrors(err)
        console.error('Failed to post note')
      }
    }

    postTask()
  }

  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        try {
          const response = await fetchsingleTaskWithTokenInterceptor({
            access,
            taskId,
          }) // Use the function to fetch data
          if (response.ok) {
            const data = await response.json() // Parse the response JSON
            setFormState({
              text: data.text || '',
              date_end: formatDate(data.date_end) || '',
              task_type: data.task_type || '',
              manager: '',
            })
          } else {
            console.error('Failed to fetch task')
          }
        } catch (error) {
          console.error('Error fetching task:', error)
        }
      }
      fetchTask()
    }
  }, [access, taskId])
  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label className="text-secondary">Тип задачи</Form.Label>
        <Form.Select
          name="status"
          className="shadow-none"
          style={{ width: '100%' }}
          value={formState.status || '1'}
          onChange={(e) => {
            const newValue = e.target.value
            if (newValue !== formState.status) {
              handleChange(newValue)
            }
          }}
        >
          <option value="1">Звонок</option>
          <option value="2">Сбор оплаты + отправка ссылок</option>
          <option value="3">Принять заказ</option>
          <option value="4">Позвонить холодный/списки</option>
          <option value="5">Проверить отправку образцов, Готовые фото</option>
          <option value="6">Теплые сады</option>
          <option value="7">Напомнить о записи</option>
          <option value="8">Позвонить по КП, Проверить смс по Вотсапп</option>
        </Form.Select>
        {errors.status && <div className="text-danger">{errors.status[0]}</div>}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label className="text-secondary">Статус задачи</Form.Label>
        <Form.Select
          name="task_type"
          className="shadow-none"
          style={{ width: '100%' }}
          value={formState.task_type}
          onChange={handleChange}
        >
          <option hidden>Выберите статус задачи</option>
          <option value="1">Открыта</option>
          <option value="2">В работе</option>
          <option value="3">Готова</option>
        </Form.Select>
        {errors.task_type && (
          <div className="text-danger">{errors.task_type[0]}</div>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <div className="form-control-wrap">
          <DatePicker
            label={'Дедлайн'}
            placeholder={'Не указно'}
            img={calendar}
            isActive={isActive}
            setIsActive={setIsActive}
            navTitles={{
              days: 'MMMM <i>yyyy</i>',
              months: 'yyyy',
            }}
          />
        </div>
        {errors.charge_dates && (
          <div className="text-danger">{errors.charge_dates[0]}</div>
        )}
      </Form.Group>

      <Form.Group controlId="noteText" className="mb-3">
        <Form.Control
          as="textarea"
          rows={6}
          name="text"
          style={{ padding: '15px', resize: 'none', height: '120px' }}
          value={formState.text}
          onChange={handleChange}
          placeholder="Write a message"
        />
        {errors.text && <div className="text-danger">{errors.text[0]}</div>}
      </Form.Group>

      <Form.Group className="mb-3">
                <div className="form-control-wrap">
                    <Form.Label className="text-secondary">
                        Карточка клиента
                    </Form.Label>
                    <Form.Control
                        name="children_for_photoshoot"
                        className="shadow-none"
                        placeholder="Не указано"
                        value={formState.children_for_photoshoot}
                        onChange={handleChange}
                    />
                    <div className="control-img">
                        <img src={people} alt=""/>
                    </div>
                </div>
                {errors.children_for_photoshoot &&
                    <div className="text-danger">{errors.children_for_photoshoot[0]}</div>}
            </Form.Group>

      <ModalFooter style={{ padding: '5px' }}>
        <Button className="btn-filter-reset text-center" onClick={handleDelete}>
          Удалить
        </Button>
        <Button
          className="create-btn"
          style={{ padding: '7px 12px' }}
          onClick={handleSubmit}
        >
          Обновить
        </Button>
      </ModalFooter>
    </Form>
  )
}

export default EditBasicTaskForm
