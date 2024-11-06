import React, { useState, useEffect } from 'react'
import { Form, Button, ModalFooter } from 'react-bootstrap'
import calendar from '../../../assets/icons/calendar-event.svg'
import people from '../../../assets/icons/people.svg'
import { postCallWithToken } from '../../../http/client-cards/postCalls'

const CallForm = ({ cardId, closeModal, responsible_manager, addTask }) => {
    const access = localStorage.getItem('access') // Get access token

  const [formState, setFormState] = useState({
    text: '',
    date_call: '',
    call_status: '',
    responsible_manager: responsible_manager,
    garden: ''
  });

  const [errors, setErrors] = useState({})

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
        created_at: reformatDate(formState.date_call),
        author: formState.responsible_manager,
        call_status: formState.call_status,
    }

    const postCall = async () => {        

          const response = await postCallWithToken ({access, data:datatoFetch}) 
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

      postCall()
      console.log(responsible_manager)
  }
  return (
    <Form>
    <Form.Group className="mb-3">
      <Form.Label className="text-secondary">Статус</Form.Label>
      <Form.Select
        name="call_status"
        className="shadow-none"
        style={{ width: '100%' }}
        value={formState.call_status}
        onChange={handleChange}
      >
        <option hidden>Выберите тип задачи</option>
        <option value={1}>Отказ</option>
        <option value={2}>Записан на фотосессию</option>
        <option value={3}>Отправлено КП</option>
      </Form.Select>
      {errors.call_status && <div className="text-danger">{errors.call_status[0]}</div>}
    </Form.Group>


    <Form.Group className="mb-3">
      <div className="form-control-wrap">
        <Form.Label className="text-secondary">Выберите дату</Form.Label>
        <Form.Control
          name="date_call"
          className="shadow-none"
          placeholder="Не указано"
          value={formState.date_call}
          onChange={handleChange}
        />
        <div className="control-img">
          <img src={calendar} alt="" />
        </div>
      </div>
      {errors.date_call && <div className="text-danger">{errors.date_call[0]}</div>}
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

export default CallForm
