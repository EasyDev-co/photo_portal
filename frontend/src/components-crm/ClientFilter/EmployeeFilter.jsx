/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Form from 'react-bootstrap/Form'
import './styles/ClientFilter.scss'
import {useEffect, useState} from 'react'
import ManagerSelectInput from '../ClientCardModal/Forms/InputsField/SearchMultiplyManager'

const EmployeeFilter = ({onManagerSelect}) => {
    const [managers, setManagers] = useState([]);
    const [errors, setErrors] = useState({});


    const access = localStorage.getItem('access')

    const handleManagerSelect = (selectedManager) => {
        console.log(selectedManager)
        setManagers(selectedManager);
        onManagerSelect(selectedManager);
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
