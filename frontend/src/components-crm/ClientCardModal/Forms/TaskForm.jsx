import React, { useState, useEffect } from 'react'
import { Form, Button, ModalFooter } from 'react-bootstrap'
import calendar from '../../../assets/icons/calendar-event.svg'
import people from '../../../assets/icons/people.svg'
import { postTaskWithToken } from '../../../http/client-cards/postTask'
import DatePicker from '../../DatePicker/DatePicker'
import TasksFilter from '../../ClientFilter/TasksFilter'

const TaskForm = ({ cardId, closeModal, addTask }) => {
    const access = localStorage.getItem('access') // Get access token
    const [isActive, setIsActive] = useState(false)

  const [formState, setFormState] = useState({
    text: '',
    date_end: '',
    task_type: '',
    manager: '',
    garden: ''
  });

  useEffect(() => {
    console.log(formState)
  }, [formState])

  const [errors, setErrors] = useState({})

  const handleTypeSelect = (selectedType) => {
    setFormState((prevState) => ({
        ...prevState,
        task_type: selectedType,
    }));
};

  function reformatDate(dateStr) {
    const [day, month, year] = dateStr.split('.');
    return `${year}-${month}-${day}`;
}
  
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit =(e)=>{
    e.preventDefault()

    const datatoFetch = {
        client_card:cardId,
        date_end: reformatDate(formState.date_end),
        text: formState.text
    }

    const postTask = async () => {        

          const response = await postTaskWithToken({access, data:datatoFetch}) 
          if (response.ok) {

            const res = await response.json()
            console.log(res);
            
            addTask(res)
            closeModal()
            
          } else {
            const err = await response.json()
            setErrors(err)
            console.error('Failed to post note')
          }

      }

      postTask()
  }
  return (
    <Form>
    {/* <TasksFilter onSelect={handleTypeSelect} /> */}


    <Form.Group className="mb-3">
        {/* <DatePicker
                label={'Выберите дату'}
                placeholder={'Не указано'}
                setIsActive={setIsActive}
                img={calendar}
                isActive={isActive}
                navTitles={{
                  days: 'MMMM <i>yyyy</i>',
                  months: 'yyyy',
                }}
              /> */}
      <div className="form-control-wrap">
        <Form.Label className="text-secondary">Выберите дату</Form.Label>
        <Form.Control
          name="date_end"
          className="shadow-none"
          placeholder="Не указано"
          value={formState.date_end}
          onChange={handleChange}
        />
        <div className="control-img">
          <img src={calendar} alt="" />
        </div>
      </div>
      {errors.date_end && <div className="text-danger">{errors.date_end[0]}</div>}
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


    <ModalFooter style={{ padding: '5px' }}>
      <Button className="btn-filter-reset text-center" onClick={closeModal}>
        Отмена
      </Button>
      <Button
        className="create-btn"
        style={{ padding: '7px 12px' }}
        onClick={handleSubmit}
      >
        Добавить
      </Button>
    </ModalFooter>
  </Form>
);
};

export default TaskForm
