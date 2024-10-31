import React, { useState, useEffect } from 'react'
import { Form, Button, ModalFooter } from 'react-bootstrap'
import calendar from '../../../assets/icons/calendar-event.svg'
import people from '../../../assets/icons/people.svg'
import { postTaskWithToken } from '../../../http/client-cards/postTask'

const TaskForm = ({ cardId, closeModal, addTask }) => {
    const access = localStorage.getItem('access') // Get access token

  const [formState, setFormState] = useState({
    text: '',
    date_end: '',
    task_type: '',
    manager: '',
    garden: ''
  });

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
        author:"b007b705-4f91-41ed-bbe8-90599d181ae4",
        text: formState.text
    }

    const postTask = async () => {        
        try {
          const response = await postTaskWithToken({access, data:datatoFetch}) 
          if (response.ok) {

            const res = await response.json()
            console.log(res);
            
            addTask(res)
            closeModal()
            
          } else {
            console.error('Failed to post note')
          }
        } catch (error) {
          console.error('Error posting note:', error)
        }
      }

      postTask()
  }
  return (
    <Form>
    <Form.Group className="mb-3">
      <Form.Label className="text-secondary">Тип задачи</Form.Label>
      <Form.Select
        name="task_type"
        className="shadow-none"
        style={{ width: '100%' }}
        value={formState.task_type}
        onChange={handleChange}
      >
        <option hidden>Выберите тип задачи</option>
        <option value="1">Открыта</option>
        <option value="2">В работе</option>
        <option value="3">Готова</option>
      </Form.Select>
    </Form.Group>


    <Form.Group className="mb-3">
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
    </Form.Group>

    <Form.Group className="mb-3">
      <div className="form-control-wrap">
        <Form.Label className="text-secondary">Менеджер</Form.Label>
        <Form.Control
          name="manager"
          className="shadow-none"
          placeholder="Не указано"
          value={formState.manager}
          onChange={handleChange}
        />
        <div className="control-img">
          <img src={people} alt="" />
        </div>
      </div>
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
