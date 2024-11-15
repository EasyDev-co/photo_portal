import Form from 'react-bootstrap/Form'
import './styles/ClientFilter.scss'
import DatePicker from '../DatePicker/DatePicker'
import { useEffect, useState } from 'react'
import calendar from '../../assets/icons/calendar-event.svg'
import ManagerSelectInput from '../ClientCardModal/Forms/InputsField/SearchManagerField'
import TypeTask from '../ClientCardModal/Forms/InputsField/TypeTask'

const TasksFilter = ({ onFilterChange }) => {
  const [isActive, setIsActive] = useState(false)
  const [errors, setErrors] = useState({});
  const [managers, setManagers] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const access = localStorage.getItem('access')

  const handleManagerSelect = (selectedManager) => {
    console.log(selectedManager)
    setManagers(selectedManager);
    onFilterChange({ managers: selectedManager, selectedType, selectedDate });
  };

  const handleTaskTypeChange = (type) => {
    setSelectedType(type);
    onFilterChange({ managers, selectedType: type, selectedDate });
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onFilterChange({ managers, selectedType, selectedDate: date });
  };

  return (
    <div>
      <div className="d-flex align-items-center gap-3">
        <Form className="d-flex column-gap-3 flex-wrap mb-3">
        <TypeTask onSelect={handleTaskTypeChange} initialType=""/>

          <Form.Group>
            <DatePicker
              label={'Дата взаимодействия'}
              placeholder={'Не указано'}
              setIsActive={setIsActive}
              img={calendar}
              isActive={isActive}
              onDateChange={handleDateChange}
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
