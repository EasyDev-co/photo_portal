import React, { useState, useEffect } from 'react'
import { Form, Button, ModalFooter } from 'react-bootstrap'
import calendar from '../../../assets/icons/calendar-event.svg'
import people from '../../../assets/icons/people.svg'
import { patchTaskWithToken } from '../../../http/client-cards/patchTasks'
import ManagerSelectInput from './InputsField/SearchManagerField'
import TypeTask from './InputsField/TypeTask'
import CardSelectInput from './InputsField/SearchClientCardField'
import DatePicker from '../../DatePicker/DatePicker'
import { deleteBasicTaskWithToken } from '../../../http/client-cards/deleteBasicTask'
import { fetchBasicSingleTaskWithTokenInterceptor } from '../../../http/client-cards/getBasicSingleTask'
import { patchBasicTaskWithToken } from '../../../http/client-cards/patchBasicTasks'

const EditBasicTaskForm = ({
  taskId,
  closeModal,
  editTask,
  deleteItem,
}) => {
  console.log(taskId)
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
  const typeMap = {
    "Звонок": "1",
    "Сбор оплаты+ отправка ссылок": "2",
    "Принять заказ": "3",
    "Позвонить холодный/списки": "4",
    "Проверить отправку образцов, Готовые фото.": "5",
    "Теплые сады": "6",
    "Напомнить о записи": "7",
    "Позвонить по КП, Проверить смс по Вотсапп": "8"
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
    executor_id: "",
    review_task_status_name: "",
  });

  const statusTextToValueMap = {
    Доработать: "1",
    Провалить: "2",
    Принять: "3",
  };
  const statusValueToTextMap = {
    "1": "Принять",
    "2": "Провалить",
    "3": "Доработать",
  };
  

  const [errors, setErrors] = useState({})
  const [isActive, setIsActive] = useState(false)
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const handleManagerSelect = (selectedManager) => {
    console.log(selectedManager)
    setFormState((prevState) => ({
      ...prevState,
      executor_id: selectedManager.id
    }))
  }
  const handleCardSelect = (selectedCard) => {
    setFormState((prevState) => ({
      ...prevState,
      clientCard: selectedCard,
    }))
    console.log(selectedCard);
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

const handleStatusChange = (e) => {
  const selectedValue = e.target.value;
  console.log(selectedValue);
  setFormState((prevState) => ({
    ...prevState,
    task_status_name: selectedValue, // Сохраняем значение (число)
  }));
  console.log(formState);
}
useEffect(() => {
  console.log(formState);
}, [formState])

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

  const handleSubmit = (e) => {

    //СДЕЛАТЬ ОБРАБОТЧИК СТАТУСОВ И ТИПОВ ДЛЯ ОТПРАВКИ НА БЭК
    e.preventDefault()

    const data = {
      date_end: reformatDate(formState.date_end),
      text: formState.text,
      task_type: formState.task_type_name,
      executor: formState.executor_id,
      // status: statusMap[formState.task_status_name],
      task_status: formState.task_status_name,
      client_card	: formState.client_card,
      // review_task_status: statusTextToValueMap[formState.review_task_status_name],
    }

    console.log(data);
    //revision_comment!!!!

    const patchTask = async () => {
      const response = await patchBasicTaskWithToken(access, data, taskId)
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
    console.log(formState);
  }, [formState]);

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
              task_status_name: statusMap[data.task_status_name] || '',
              task_type_name: typeMap[data.task_type_name] || '',
              text: data.text || '',
              // review_task_status_name: data.review_task_status_name || '',
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
    console.log(selectedType)
    console.log(formState.task_type_name)
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
          value={statusMap[formState.task_status_name] || '1'} // Преобразуем текст в значение
          onChange={(e) => {
            const selectedText = Object.keys(statusMap).find(
              (key) => statusMap[key] === e.target.value
            ); // Находим текст по значению
            setFormState((prevState) => ({
              ...prevState,
              task_status_name: selectedText, // Сохраняем текстовое значение
            }));
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
          initialCard={formState.client_card}
        />
      </div>

      <Form.Group className="mb-3">
        <Form.Label className="text-secondary">Оценка задачи</Form.Label>
        <Form.Select
          name="review_task_status"
          className="shadow-none"
          style={{ width: '100%' }}
          // value={formState.review_task_status_name || ""}
          value={
            Object.keys(statusTextToValueMap).includes(formState.review_task_status_name)
              ? statusTextToValueMap[formState.review_task_status_name]
              : ""
          }
          onChange={(e) => {
            const selectedText = e.target.options[e.target.selectedIndex].text; // Получаем текст выбранного варианта
            setFormState((prev) => ({
              ...prev,
              review_task_status_name: selectedText,
              revision_comment: selectedText === "Доработать" ? formState.revision_comment : "", // Очищаем, если выбор изменился
            }));
          }}
          // value={
          //   Object.keys(statusTextToValueMap).includes(formState.review_task_status_name)
          //     ? statusTextToValueMap[formState.review_task_status_name]
          //     : ""
          // }
          // onChange={(e) => {
          //   const selectedText = e.target.options[e.target.selectedIndex].text; // Получаем текст выбранного варианта
          //   setFormState((prev) => ({
          //     ...prev,
          //     review_task_status_name: selectedText,
          //   }));
          // }}
        >
          <option value="">-- Выберите статус --</option>
          <option value="1">Доработать</option>
          <option value="2">Провалить</option>
          <option value="3">Принять</option>
        </Form.Select>
        {errors.review_task_status_name && (
          <div className="text-danger">{errors.review_task_status_name[0]}</div>
        )}
      </Form.Group>
      {formState.review_task_status_name === "Доработать" && (
        <Form.Group controlId="revisionComment" className="mb-3">
          <Form.Label className="text-secondary">Описание доработок</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            name="revision_comment"
            style={{ padding: '15px', resize: 'none', height: '100px' }}
            value={formState.revision_comment}
            onChange={(e) => {
              const { value } = e.target;
              setFormState((prev) => ({
                ...prev,
                revision_comment: value,
              }));
            }}
            placeholder="Опишите необходимые доработки"
          />
          {errors.revision_comment && (
            <div className="text-danger">{errors.revision_comment[0]}</div>
          )}
        </Form.Group>
      )}


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
