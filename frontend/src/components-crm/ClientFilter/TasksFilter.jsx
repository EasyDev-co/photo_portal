/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Form from 'react-bootstrap/Form'
import './styles/ClientFilter.scss'
import DatePicker from '../DatePicker/DatePicker'
import { useEffect, useState } from 'react'
import calendar from '../../assets/icons/calendar-event.svg'
import { localUrl } from '../../constants/constants'
import ManagerSelectInput from '../ClientCardModal/Forms/InputsField/SearchManagerField'
import TypeTask from '../ClientCardModal/Forms/InputsField/TypeTask'

const TasksFilter = () => {
  const [isActive, setIsActive] = useState(false)
  // const [managers, setManagers] = useState([]);
  const [errors, setErrors] = useState({});
  const [formState, setFormState] = useState({
    charge_dates: '', // Will store the selected date
    task_type: '',
    manager: ''
})

  const access = localStorage.getItem('access')

  const handleManagerSelect = (selectedManager) => {
    setFormState((prevState) => ({
      ...prevState,
      manager: selectedManager,
  }));
};
  const handleTypeSelect = (selectedType) => {
    setFormState((prevState) => ({
        ...prevState,
        task_type: selectedType,
    }));
  };

const handleChange = (e) => {
  const {name, value} = e.target

  setFormState((prevState) => ({
      ...prevState,
      [name]: value,
  }))
}

  return (
    <div>
      <div className="d-flex align-items-center gap-3">
        <Form className="d-flex column-gap-3 flex-wrap mb-3">
        <TypeTask onSelect={handleTypeSelect} />

          <Form.Group>
            <DatePicker
              label={'Дата взаимодействия'}
              placeholder={'Не указано'}
              setIsActive={setIsActive}
              img={calendar}
              isActive={isActive}
              navTitles={{
                days: 'MMMM <i>yyyy</i>',
                months: 'yyyy',
              }}
            />
          </Form.Group>
          <ManagerSelectInput
                access={access}
                multiplyObject={true}
                onSelect={handleManagerSelect}
                errors={errors}
                name='Менеджер'
              />
        </Form>
      </div>
    </div>
  )
}

export default TasksFilter
