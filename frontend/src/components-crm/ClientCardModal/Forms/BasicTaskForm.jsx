import React, {useState, useEffect} from 'react'
import {Form, Button, ModalFooter} from 'react-bootstrap'
import DatePicker from '../../DatePicker/DatePicker'
import calendar from '../../../assets/icons/calendar-event.svg'
import people from '../../../assets/icons/people.svg'
import search from '../../../assets/icons/search.svg'
import {postClientCardWithToken} from '../../../http/client-cards/postClientCard'
import {fetchKindergartensWithToken} from '../../../http/client-cards/getKinderGartenSearch'
import {fetchManagersWithToken} from '../../../http/client-cards/getManagers'
import ManagerSelectInput from "./InputsField/SearchManagerField";


const BasicTaskForm = ({handleAddClientCard, closeModal}) => {
    const access = localStorage.getItem('access') // Get access token

    const maxCharacters = 100
    const [isActive, setIsActive] = useState(false)
    const formatDate = (date) => {
        const [day, month, year] = date.split(".");
        return `${year}-${month}-${day}`;
    };
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

    const handleManagerSelect = (selectedManager) => {
        setFormState((prevState) => ({
            ...prevState,
            manager: selectedManager,
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

    const handleDateChange = (e) => {
        let value = e.target.value;

        // Remove any non-digit characters
        value = value.replace(/\D/g, '');

        // Apply the xx.xx.xxxx format
        if (value.length > 2 && value.length <= 4) {
            value = `${value.slice(0, 2)}.${value.slice(2)}`;
        } else if (value.length > 4) {
            value = `${value.slice(0, 2)}.${value.slice(2, 4)}.${value.slice(4, 8)}`;
        }

        setFormState((prevState) => ({
            ...prevState,
            charge_dates: value,
        }));
    };

    const handleKindergarden = (e) => {
        const {value} = e.target
        setKindergarten(value)
    }


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
            charge_dates: formatDate(formState.charge_dates),
            garden_details: formState.garden_details || "Реквизитов нет",
            kindergarten: formState.kindergarden.id,
            status: formState.status || 1,
            children_count: formState.children_count || 0,
            children_for_photoshoot: formState.children_for_photoshoot || 0,
            responsible_manager: formState.manager.id
        }

        console.log(formState.charge_dates);


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

    return (
        <Form>
            <Form.Group className="mb-3">
                <Form.Label className="text-secondary">
                    Тип задачи
                </Form.Label>
                <Form.Select
                    name="status"
                    className="shadow-none"
                    style={{width: '100%'}}
                    value={formState.status || '1'}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        if (newValue !== formState.status) {
                            handleChange(newValue);
                        }
                    }}
                >
                    <option value="1">Звонок</option>
                    <option value="2">Сбор оплаты + отправка ссылок</option>
                    <option value="3">Принять заказ</option>
                    <option value="4">Позвонить холодный/списки</option>
                    <option value="5">Проверить отправку образцов, Готовые фото</option>
                    <option value="6">Теплые сады</option>
                    <option value="7">Напомнить о записи</option>
                    <option value="8">Позвонить по КП, Проверить смс по Вотсапп</option>
                </Form.Select>
                {errors.status && <div className="text-danger">{errors.status[0]}</div>}
            </Form.Group>

            <div>
                {/* <h2>Выбор менеджера (Одиночный выбор)</h2> */}
                <ManagerSelectInput
                    access={access}
                    multiplyObject={false}
                    onSelect={handleManagerSelect}
                    errors={errors}
                    name='Исполнитель'
                />

                {/* <h2>Выбор менеджера (Множественный выбор)</h2> */}
                {/* <ManagerSelectInput
                    access={access}
                    multiplyObject={true}
                    onSelect={handleManagerSelect}
                    errors={errors}
                /> */}
            </div>
            <Form.Group className="mb-3">
                <div className="form-control-wrap">
                    <DatePicker
                        label={'Дедлайн'}
                        placeholder={'Не указно'}
                        img={calendar}
                        isActive={isActive}
                        setIsActive={setIsActive}
                        navTitles={{
                            days: 'MMMM <i>yyyy</i>',
                            months: 'yyyy',
                        }}
                    />
                </div>
                {errors.charge_dates && <div className="text-danger">{errors.charge_dates[0]}</div>}
            </Form.Group>

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

            <Form.Group className="mb-3">
                <div className="form-control-wrap">
                    <Form.Label className="text-secondary">
                        Карточка клиента
                    </Form.Label>
                    <Form.Control
                        name="children_for_photoshoot"
                        className="shadow-none"
                        placeholder="Не указано"
                        value={formState.children_for_photoshoot}
                        onChange={handleChange}
                    />
                    <div className="control-img">
                        <img src={people} alt=""/>
                    </div>
                </div>
                {errors.children_for_photoshoot &&
                    <div className="text-danger">{errors.children_for_photoshoot[0]}</div>}
            </Form.Group>

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
