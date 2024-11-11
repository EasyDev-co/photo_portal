import React, { useState, useEffect } from 'react'
import { Form, Button, ModalFooter } from 'react-bootstrap'
import calendar from '../../../assets/icons/calendar-event.svg'
import people from '../../../assets/icons/people.svg'
import { patchTaskWithToken } from '../../../http/client-cards/patchTasks'
import { fetchsingleTaskWithTokenInterceptor } from '../../../http/client-cards/getSingleTask'
import { deleteTaskWithToken } from '../../../http/client-cards/deleteTask'
import ManagerSelectInput from './InputsField/SearchManagerField'
import TypeTask from './InputsField/TypeTask'
import CardSelectInput from './InputsField/SearchClientCardField'
import DatePicker from '../../DatePicker/DatePicker'
import { deleteBasicTaskWithToken } from '../../../http/client-cards/deleteBasicTask'

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
    status: '',
    clientCard: '',
  })

  const [errors, setErrors] = useState({})
  const [isActive, setIsActive] = useState(false)

  const handleManagerSelect = (selectedManager) => {
    setFormState((prevState) => ({
      ...prevState,
      manager: selectedManager,
    }))
  }
  const handleCardSelect = (selectedCard) => {
    setFormState((prevState) => ({
      ...prevState,
      clientCard: selectedCard,
    }))
  }

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
        const response = await deleteBasicTaskWithToken(access, taskId) // Use the function to fetch data
        if (response.ok) {
          setFormState({
            text: '',
            date_end: '',
            task_type: '',
            manager: '',
            status: '',
          })
          closeModal()
          deleteTask(taskId)
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
      task_type: formState.task_type,
      manager: formState.manager,
      status: formState.status,
      clientCard: formState.clientCard,
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

  const handleTypeSelect = (selectedType) => {
    setFormState((prevState) => ({
      ...prevState,
      task_type: selectedType,
    }))
  }
  useEffect(() => {
    console.log(formState)
  }, [formState])

  return (
    <Form>
      <TypeTask onSelect={handleTypeSelect} />

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

      <ManagerSelectInput
        access={access}
        multiplyObject={false}
        onSelect={handleManagerSelect}
        errors={errors}
        name="Исполнитель"
      />

      <Form.Group className="mb-3">
        <Form.Label className="text-secondary">Статус задачи</Form.Label>
        <Form.Select
          name="status"
          className="shadow-none"
          style={{ width: '100%' }}
          value={formState.status || '1'}
          onChange={(e) => {
            if (e.target.value !== formState.status) {
              handleChange(e) // Передаем событие e, а не значение
            }
          }}
        >
          <option value="1">Открыта</option>
          <option value="2">Выполнена</option>
        </Form.Select>
        {errors.status && <div className="text-danger">{errors.status[0]}</div>}
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

      <div>
        <CardSelectInput
          access={access}
          multiplyObject={false}
          onSelect={handleCardSelect}
          errors={errors}
          name="Карточка клиента"
        />
      </div>

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
