import React, { useState, useEffect } from 'react'
import { Form, Button, ModalFooter } from 'react-bootstrap'
import DatePicker from '../../DatePicker/DatePicker'
import calendar from '../../../assets/icons/calendar-event.svg'
import people from '../../../assets/icons/people.svg'
import search from '../../../assets/icons/search.svg'
import { postTaskWithToken } from '../../../http/client-cards/postTask'
import { fetchKindergartensWithToken } from '../../../http/client-cards/getKinderGartenSearch'

const TaskForm = ({ cardId, closeModal }) => {
    const access = localStorage.getItem('access') // Get access token
  const [isDateOpen, setIsDateOpen] = useState(false)

  const maxCharacters = 100

  const [formState, setFormState] = useState({
    text: '',
    date_end: '',  // Will store the selected date
    task_type: '',
    manager: '',
    garden: ''
  });

  const [kindergarten, setKindergarten] = useState("")
  const [kindergartenResults, setKindergartenResults] = useState([]);

  console.log(formState.date_end);
  

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Limit character count for 'text' field only
    if (name === 'text' && value.length > maxCharacters) return;

    setFormState((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleKindergarden =(e)=>{

    const { value } = e.target;
    setKindergarten(value);
  }

  const handleSubmit =(e)=>{
    e.preventDefault()

    const datatoFetch = {
        client_card:cardId,
        date_end: '2024-12-12',
        author:"b007b705-4f91-41ed-bbe8-90599d181ae4",
        text: formState.text
    }

    const postTask = async () => {        
        try {
          const response = await postTaskWithToken({access, data:datatoFetch}) 
          if (response.ok) {
            const data = await response.json() 

            console.log(data);
            
          } else {
            console.error('Failed to post note')
          }
        } catch (error) {
          console.error('Error posting note:', error)
        }
      }

      postTask()
  }

  useEffect(()=>{
    const fetchKindergartens = async () =>{
        try {
            const response = await fetchKindergartensWithToken({access, name:kindergarten}) 
            if (response.ok) {
                const data = await response.json();
                setKindergartenResults(data.slice(0, 5));
              console.log(data);
              
            } else {
              console.error('Failed to post note')
            }
          } catch (error) {
            console.error('Error posting note:', error)
          }
    }
    
    if(kindergarten){
        fetchKindergartens()
    } else {
        setKindergartenResults([]);
    }
  }, [kindergarten])
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
        <Form.Label className="text-secondary">Дата</Form.Label>
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

    <Form.Group className="mb-3">
    <div className="form-control-wrap">
        <Form.Label className="text-secondary">Сад</Form.Label>
        <Form.Control
            name="garden"
            className="shadow-none"
            placeholder="Не указано"
            value={kindergarten}
            onChange={handleKindergarden}
        />
        <div className="control-img">
            <img src={search} alt="" />
        </div>
    </div>
    {kindergartenResults.length > 0 && (
        <ul className="kindergarten-suggestions">
            {kindergartenResults.map((item, index) => (
                <li key={index}>
                    <button
                    type='button'
                        onClick={() => {setFormState(prev => ({ ...prev, garden: item.id })); setKindergarten(item.name); setKindergartenResults([])}}
                        style={{
                            cursor: 'pointer',
                            background: 'none',
                            border: 'none',
                            padding: '10px',
                            textAlign: 'left',
                            width: '100%',
                            display: 'block', // Ensures the button takes the full width
                            color: 'black'
                        }}
                    >
                        {item.name} {/* Adjust according to your response structure */}
                    </button>
                </li>
            ))}
        </ul>
    )}
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
