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
import { fetchBasicSingleTaskWithTokenInterceptor } from '../../../http/client-cards/getBasicSingleTask'

const EditBasicTaskForm = ({
  taskId,
  closeModal,
  editTask,
  deleteItem,
}) => {
  const access = localStorage.getItem('access') // Get access token

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' }
    return date.toLocaleDateString('ru-RU', options)
  }

  const statusMap = {
    "Открыта": "1",
    "Выполнена": "2"
  }

  const [formState, setFormState] = useState({
    author_fi:"",
    client_card: "",
    created_at: "",
    date_end: "",
    executor_fi: "",
    id: "",
    revision_comment: null,
    task_status_name: "",
    task_type_name: "",
    text: "",
  })

  

  const [errors, setErrors] = useState({})
  const [isActive, setIsActive] = useState(false)
  const [isDataLoaded, setIsDataLoaded] = useState(false);

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

  const handleDateChange = (formattedDate) => {
    setFormState((prevState) => ({
        ...prevState,
        date_end: formattedDate,
    }));
};

  const handleDelete = () => {
    const deleteTask = async () => {
      try {
        const response = await deleteBasicTaskWithToken(access, taskId) // Use the function to fetch data
        if (response.ok) {
          setFormState({
            author_fi:"",
            client_card: "",
            created_at: "",
            date_end: "",
            executor_fi: "",
            id: "",
            revision_comment: null,
            task_status_name: "",
            task_type_name: "",
            text: "",
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

  const handleStatusChange = (e) => {
    const selectedValue = e.target.value;
    const statusText = selectedValue === "1" ? "Открыта" : "Выполнена";
    setFormState((prevState) => ({
      ...prevState,
      task_status_name: statusText
    }));
  }

  const handleSubmit = (e) => {

    //СДЕЛАТЬ ОБРАБОТЧИК СТАТУСОВ И ТИПОВ ДЛЯ ОТПРАВКИ НА БЭК
    e.preventDefault()

    const data = {
      date_end: reformatDate(formState.date_end),
      text: formState.text,
      task_type: formState.task_type,
      manager: formState.manager,
      status: statusMap[formState.task_status_name],
      // status: formState.status,
      clientCard: formState.clientCard,
    }

    const patchTask = async () => {
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

    patchTask()
  }


  useEffect(() => {
    if (taskId) {
      const fetchTask = async () => {
        try {
          const response = await fetchBasicSingleTaskWithTokenInterceptor({
            access,
            taskId,
          }) // Use the function to fetch data
          if (response.ok) {
            const data = await response.json() // Parse the response JSON
            console.log(data)
            setFormState({
              author_fi: data.author_fi || '',
              client_card: data.client_card || '',
              created_at: formatDate(data.created_at) || '',
              date_end: formatDate(data.date_end) || '',
              executor_fi: data.executor_fi || '',
              id: data.id || '',
              revision_comment: data.revision_comment || '',
              task_status_name: data.task_status_name || '',
              task_type_name: data.task_type_name || '',
              text: data.text || '',
            })
            setIsDataLoaded(true)
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
      task_type_name: selectedType,
    }))
  }

  if (!isDataLoaded) return <div>Загрузка...</div>;

  return (
    <Form>
      <TypeTask initialType={formState.task_type_name} onSelect={handleTypeSelect} />

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
            onDateChange={handleDateChange}
            value={formState.date_end}
          />
        </div>
        {errors.date_end && (
          <div className="text-danger">{errors.date_end[0]}</div>
        )}
      </Form.Group>

      <ManagerSelectInput
        access={access}
        multiplyObject={false}
        onSelect={handleManagerSelect}
        errors={errors}
        name="Исполнитель"
        initialManager={formState.executor_fi}
      />

      <Form.Group className="mb-3">
        <Form.Label className="text-secondary">Статус задачи</Form.Label>
        <Form.Select
          name="status"
          className="shadow-none"
          style={{ width: '100%' }}
          // value={formState.status || '1'}
          value={statusMap[formState.task_status_name] || "1"}
          onChange={handleStatusChange}
          // onChange={(e) => {
          //   if (e.target.value !== formState.status) {
          //     handleChange(e)
          //   }
          // }}
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
          initialCard={formState.client_card}
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
