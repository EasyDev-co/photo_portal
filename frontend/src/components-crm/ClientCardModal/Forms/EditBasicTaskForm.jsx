import React, { useState, useEffect } from 'react'
import { Form, Button, ModalFooter } from 'react-bootstrap'
import calendar from '../../../assets/icons/calendar-event.svg'
import people from '../../../assets/icons/people.svg'
import { patchTaskWithToken } from '../../../http/client-cards/patchTasks'
import ManagerSelectInput from './InputsField/SearchMultiplyManager'
import TypeTask from './InputsField/TypeTask'
import CardSelectInput from './InputsField/SearchClientCardField'
import DatePicker from '../../DatePicker/DatePicker'
import { deleteBasicTaskWithToken } from '../../../http/client-cards/deleteBasicTask'
import { fetchBasicSingleTaskWithTokenInterceptor } from '../../../http/client-cards/getBasicSingleTask'
import { patchBasicTaskWithToken } from '../../../http/client-cards/patchBasicTasks'
import { fetchUserDataWithTokenInterceptor } from '../../../http/user/getUserData'
import { useSelector } from 'react-redux'
import SearchSingleManager from './InputsField/SearchSingleManager'
import SearchSingleClientCard from './InputsField/SearchSingleClientCard'
import StatusTask from './InputsField/StatusTask'

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
    revision_comment: "",
    task_status_name: "",
    task_type_name: "",
    text: "",
    executor_id: "",
    review_task_status_name: "",
    kindergarten_name: "",
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
  const [userRole, setUserRole] = useState(null);
  const refresh = useSelector(state => state.user.refresh);

  useEffect(() => {
    if (!localStorage.getItem('access')) {
      return;
    }
    fetchUserDataWithTokenInterceptor(access, refresh)
      .then(res => {
        if (res.ok) {
          res.json()
            .then(res => {
              console.log(res.employee.employee_role)
              setUserRole(res.employee.employee_role);
            //   setManagedKindergarten(res.managed_kindergarten); // сохраняем managed_kindergarten
            });
        }
      });
  }, []);

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
      review_task_status: statusTextToValueMap[formState.review_task_status_name],
      revision_comment: formState.revision_comment,
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
              kindergarten_name: data.kindergarten_name,
              review_task_status_name: data.review_task_status_name || '',
              // review_task_status_name: statusValueToTextMap[data.review_task_status] || "",
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
    console.log(formState)
  }
  const handleStatusSelect = (selectedStatus) => {
    setFormState((prevState) => ({
      ...prevState,
      task_status_name: selectedStatus,
    }))
    console.log(selectedStatus)
    console.log(formState)
  }

  if (!isDataLoaded) return <div>Загрузка...</div>;

  return (
    <Form>
      <TypeTask initialType={formState.task_type_name} onSelect={handleTypeSelect} userRole={userRole} />

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
            userRole={userRole}
          />
        </div>
        {errors.date_end && (
          <div className="text-danger">{errors.date_end[0]}</div>
        )}
      </Form.Group>

      <SearchSingleManager 
        name="Исполнитель"
        onSelect={handleManagerSelect}
        userRole={userRole}
        initialManager={formState.executor_fi}
      />

      <StatusTask initialStatus={formState.task_status_name} onSelect={handleStatusSelect}/>

      {/* <Form.Group className="mb-3">
        <Form.Label className="text-secondary">Статус задачи</Form.Label>
        <Form.Select
          name="status"
          className="shadow-none"
          style={{ width: '100%' }}
          value={formState.task_status_name || '1'} // Преобразуем текст в значение
          onChange={(e) => {
            if (e.target.value !== formState.task_status_name) {
              handleChange(e) // Передаем событие e, а не значение
            }
          }}
        >
          <option value="1">Открыта</option>
          <option value="2">Выполнена</option>
        </Form.Select>
        {errors.status && <div className="text-danger">{errors.status[0]}</div>}
      </Form.Group> */}

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
          initialCard={formState.kindergarten_name}
          userRole={userRole}
        />
        {/* <SearchSingleClientCard 
          onSelect={handleCardSelect}
          errors={errors}
          name="Карточка клиента"
          initialManager={formState.kindergarten_name}
          userRole={userRole}
        /> */}
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
          disabled={userRole == 2}
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
      {userRole !== 2 && (
          <Button className="btn-filter-reset text-center" onClick={handleDelete}>
            Удалить
          </Button>
        )}
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
