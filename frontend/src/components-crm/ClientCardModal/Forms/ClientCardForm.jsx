import React, { useState, useEffect } from 'react'
import { Form, Button, ModalFooter } from 'react-bootstrap'
import DatePicker from '../../DatePicker/DatePicker'
import calendar from '../../../assets/icons/calendar-event.svg'
import people from '../../../assets/icons/people.svg'
import search from '../../../assets/icons/search.svg'
import { postClientCardWithToken } from '../../../http/client-cards/postClientCard'
import { fetchKindergartensWithToken } from '../../../http/client-cards/getKinderGartenSearch'
import { fetchManagersWithToken } from '../../../http/client-cards/getManagers'

const ClientCardForm = ({ handleAddClientCard, closeModal }) => {
  const access = localStorage.getItem('access') // Get access token

  const maxCharacters = 100

  const [formState, setFormState] = useState({
    garden_details: '',
    charge_dates: '', // Will store the selected date
    status: '',
    manager: '',
    kindergarden: '',
    children_count: '',
    children_for_photoshoot: '',
  })

  const [errors, setErrors] = useState({})

  const [kindergarten, setKindergarten] = useState('')
  const [kindergartenResults, setKindergartenResults] = useState([])

  const [manager, setManager] = useState('')
  const [managerResults, setManagerResults] = useState([])

  const handleChange = (e) => {
    const { name, value } = e.target

    // Limit character count for 'text' field only
    if (name === 'text' && value.length > maxCharacters) return

    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleKindergarden = (e) => {
    const { value } = e.target
    setKindergarten(value)
  }

  const handleManager = (e) => {
    const { value } = e.target
    setManager(value)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const data = {
      charge_dates: '2024-12-12',
      garden_details: formState.garden_details || "Реквизитов нет",
      kindergarten: formState.kindergarden.id,
      status: formState.status || 1,
      children_count: formState.children_count || 0,
      children_for_photoshoot: formState.children_for_photoshoot || 0,
      responsible_manager: formState.manager.id
    }

    const postCard = async () => {

        const response = await postClientCardWithToken(
          access,
          data)
        if (response.ok) {
          const data = await response.json()

          handleAddClientCard(data)
          closeModal()
        } else {
          const err = await response.json()
          setErrors(err) 
          console.error(err)
        }
    }

    postCard()
  }

  useEffect(() => {
    const fetchKindergartens = async () => {
      try {
        const response = await fetchKindergartensWithToken({
          access,
          name: kindergarten,
        })
        if (response.ok) {
          const data = await response.json()
          setKindergartenResults(data.slice(0, 5))
        } else {
          const err = await response.json()          
        }
      } catch (error) {
        console.error('Error posting note:', error)
      }
    }

    if (kindergarten && kindergarten !== formState.kindergarden.name) {
      fetchKindergartens()
    } else {
      setKindergartenResults([])
    }
  }, [kindergarten])


  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetchManagersWithToken({
          access,
          name: manager,
        })
        if (response.ok) {
          const data = await response.json()
          setManagerResults(data.slice(0, 5))
        } else {
          console.error('Failed to fetch managers')
        }
      } catch (error) {
        console.error('Error posting managers:', error)
      }
    }

    if (manager && manager !== formState.manager.full_name) {
      fetchManagers()
      
    } else {
      setManagerResults([])
    }
  }, [manager])

  return (
    <Form>
      <Form.Group className="mb-3">
        <Form.Label className="text-secondary">
          Статус карточки клиента
        </Form.Label>
        <Form.Select
          name="status"
          className="shadow-none"
          style={{ width: '100%' }}
          value={formState.status}
          onChange={handleChange}
        >
          <option hidden>Выберите тип задачи</option>
          <option value="1">Открыта</option>
          <option value="2">В работе</option>
          <option value="3">Готова</option>
        </Form.Select>
        {errors.status && <div className="text-danger">{errors.status[0]}</div>}
      </Form.Group>

      <Form.Group className="mb-3">
        <div className="form-control-wrap">
          <Form.Label className="text-secondary">Выберите дату</Form.Label>
          <Form.Control
            name="charge_dates"
            className="shadow-none"
            placeholder="Не указано"
            value={formState.charge_dates}
            onChange={handleChange}
          />
          <div className="control-img">
            <img src={calendar} alt="" />
          </div>
        </div>
        {errors.charge_dates && <div className="text-danger">{errors.charge_dates[0]}</div>}
      </Form.Group>

      <Form.Group controlId="noteText" className="mb-3">
        <Form.Control
          as="textarea"
          rows={6}
          name="garden_details"
          style={{ padding: '15px', resize: 'none', height: '120px' }}
          value={formState.garden_details}
          onChange={handleChange}
          placeholder="Write a message"
        />
         {errors.garden_details && <div className="text-danger">{errors.garden_details[0]}</div>}
      </Form.Group>

      <Form.Group className="mb-3">
        <div className="form-control-wrap">
          <Form.Label className="text-secondary">Менеджер</Form.Label>
          <Form.Control
            name="manager"
            className="shadow-none"
            placeholder="Не указано"
            value={manager}
            onChange={handleManager}
          />
          <div className="control-img">
            <img src={people} alt="" />
          </div>
        </div>
        {errors.manager && <div className="text-danger">{errors.manager[0]}</div>} 
        {managerResults.length > 0 && (
          <ul className="kindergarten-suggestions">
            {managerResults.map((item, index) => (

              <li key={index}>
                <button
                  type="button"
                  onClick={() => {
                    setManagerResults([])
                    setFormState((prev) => ({ ...prev, manager: item }))
                    setManager(item.full_name)
                    
                  }}
                  style={{
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: '10px',
                    textAlign: 'left',
                    width: '100%',
                    display: 'block', // Ensures the button takes the full width
                    color: 'black',
                  }}
                >
                  {item.full_name}{' '}
                  {/* Adjust according to your response structure */}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <div className="form-control-wrap">
          <Form.Label className="text-secondary">Количество детей</Form.Label>
          <Form.Control
            name="children_count"
            className="shadow-none"
            placeholder="Не указано"
            value={formState.children_count}
            onChange={handleChange}
          />
          <div className="control-img">
            <img src={people} alt="" />
          </div>
        </div>
        {errors.children_count && <div className="text-danger">{errors.children_count[0]}</div>} 
      </Form.Group>

      <Form.Group className="mb-3">
        <div className="form-control-wrap">
          <Form.Label className="text-secondary">
            Количество детей на фотосессию
          </Form.Label>
          <Form.Control
            name="children_for_photoshoot"
            className="shadow-none"
            placeholder="Не указано"
            value={formState.children_for_photoshoot}
            onChange={handleChange}
          />
          <div className="control-img">
            <img src={people} alt="" />
          </div>
        </div>
        {errors.children_for_photoshoot && <div className="text-danger">{errors.children_for_photoshoot[0]}</div>} 
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
        {errors.kindergarten && <div className="text-danger">{errors.kindergarten[0]}</div>}
        {kindergartenResults.length > 0 && (
          <ul className="kindergarten-suggestions">
            {kindergartenResults.map((item, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => {
                    setFormState((prev) => ({ ...prev, kindergarden: item}))
                    setKindergarten(item.name)
                    setKindergartenResults([])
                  }}
                  style={{
                    cursor: 'pointer',
                    background: 'none',
                    border: 'none',
                    padding: '10px',
                    textAlign: 'left',
                    width: '100%',
                    display: 'block', // Ensures the button takes the full width
                    color: 'black',
                  }}
                >
                  {item.name}{' '}
                  {/* Adjust according to your response structure */}
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
  )
}

export default ClientCardForm
