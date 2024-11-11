import React, {useState, useEffect} from 'react'
import {Form, Button, ModalFooter} from 'react-bootstrap'
import DatePicker from '../../DatePicker/DatePicker'
import calendar from '../../../assets/icons/calendar-event.svg'
import ManagerSelectInput from "./InputsField/SearchManagerField";
import TypeTask from './InputsField/TypeTask'
import CardSelectInput from './InputsField/SearchClientCardField'
import { postBasicTaskWithToken } from '../../../http/client-cards/postBasicTask'


const BasicTaskForm = ({handleAddTaskCard, closeModal}) => {
    const access = localStorage.getItem('access') // Get access token

    const maxCharacters = 100
    const [isActive, setIsActive] = useState(false)
    const formatDate = (date) => {
        const [day, month, year] = date.split(".");
        return `${year}-${month}-${day}`;
    };
    const [formState, setFormState] = useState({
        details: '',
        charge_dates: '', // Will store the selected date
        manager: '',
        clientCard: '',
        children_count: '',
        children_for_photoshoot: '',
        task_type: '',
    })

    useEffect(() => {
        console.log(formState)
    }, [formState])

    const [errors, setErrors] = useState({})

    const handleManagerSelect = (selectedManager) => {
        setFormState((prevState) => ({
            ...prevState,
            manager: selectedManager,
        }));
    };
    const handleCardSelect = (selectedCard) => {
        setFormState((prevState) => ({
            ...prevState,
            clientCard: selectedCard,
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

        // Limit character count for 'text' field only
        if (name === 'text' && value.length > maxCharacters) return

        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleDateChange = (formattedDate) => {
        setFormState((prevState) => ({
            ...prevState,
            charge_dates: formattedDate,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault()

        setErrors({});

        const datePattern = /^\d{2}\.\d{2}\.\d{4}$/; // Regex pattern for xx.xx.xxxx format
        const isDateValid = datePattern.test(formState.charge_dates);

        // Check if date is valid
        if (!isDateValid) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                charge_dates: ['Пожалуйста, ввидите дату в корректном формате.'],
            }));
            return; // Prevent form submission if date is invalid
        }
        const data = {
            date_end: formatDate(formState.charge_dates),
            text: formState.details || "Реквизитов нет",
            client_card: formState.clientCard.id,
            task_type: formState.task_type || 1,
            executor: formState.manager.id,
            task_status: 1
        }

        console.log(formState.charge_dates);


        const postTask = async () => {

            const response = await postBasicTaskWithToken(
                access,
                data)
            if (response.ok) {
                const data = await response.json()
                if (data) {
                    handleAddTaskCard(data);
                    closeModal();
                }
                // handleAddTaskCard(data)
                // closeModal()
            } else {
                const err = await response.json()
                setErrors(err)
                console.error(err)
            }
        }

        postTask()
    }

    return (
        <Form>
            <TypeTask onSelect={handleTypeSelect} />

            <Form.Group className="mb-3">
                <div className="form-control-wrap">
                    <DatePicker
                        label={'Дедлайн'}
                        placeholder={'Не указно'}
                        img={calendar}
                        isActive={isActive}
                        setIsActive={setIsActive}
                        onDateChange={handleDateChange}
                        value={formState.charge_dates}
                        navTitles={{
                            days: 'MMMM <i>yyyy</i>',
                            months: 'yyyy',
                        }}
                    />
                </div>
                {errors.charge_dates && <div className="text-danger">{errors.charge_dates[0]}</div>}
            </Form.Group>

            <div>
                <ManagerSelectInput
                    access={access}
                    multiplyObject={false}
                    onSelect={handleManagerSelect}
                    errors={errors}
                    name='Исполнитель'
                />
            </div>

            <Form.Group controlId="noteText" className="mb-3">
                <Form.Label className="text-secondary">Описание задачи</Form.Label>
                <Form.Control
                    as="textarea"
                    rows={6}
                    name="garden_details"
                    style={{padding: '15px', resize: 'none', height: '120px'}}
                    value={formState.garden_details}
                    onChange={handleChange}
                    placeholder="Write a message"
                />
                {errors.garden_details && <div className="text-danger">{errors.garden_details[0]}</div>}
            </Form.Group>
            <div>
                <CardSelectInput 
                    access={access}
                    multiplyObject={false}
                    onSelect={handleCardSelect}
                    errors={errors}
                    name='Карточка клиента'
                />
            </div>

            <ModalFooter style={{padding: '5px'}}>
                <Button className="btn-filter-reset text-center" onClick={closeModal}>
                    Отмена
                </Button>
                <Button
                    className="create-btn"
                    style={{padding: '7px 12px'}}
                    onClick={handleSubmit}
                >
                    Добавить
                </Button>
            </ModalFooter>
        </Form>
    )
}

export default BasicTaskForm
