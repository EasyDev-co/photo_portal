/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Form from 'react-bootstrap/Form'
import './styles/ClientFilter.scss'
import DatePicker from '../DatePicker/DatePicker'
import { useEffect, useState } from 'react'
import calendar from '../../assets/icons/calendar-event.svg'
import { localUrl } from '../../constants/constants'
import ManagerSelectInput from '../ClientCardModal/Forms/InputsField/SearchManagerField'

const EmployeeFilter = () => {
  const [managers, setManagers] = useState([]);
  const [errors, setErrors] = useState({});


  const access = localStorage.getItem('access')

  const handleManagerSelect = (selectedManager) => {
    setManagers(selectedManager);
};

  return (
    <div>
      <div className="d-flex align-items-center gap-3">
        <Form className="d-flex column-gap-3 flex-wrap mb-3">
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

export default EmployeeFilter
