import React, {useState, useEffect} from 'react'
import {Form} from 'react-bootstrap'
import people from '../../../../assets/icons/people.svg'
// import search from '../../../assets/icons/search.svg'
import {fetchManagersWithToken} from '../../../../http/client-cards/getManagers'


const ExecutorInput = ({handleAddClientCard}) => {
    const access = localStorage.getItem('access') // Get access token

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

    const [manager, setManager] = useState('')
    const [managerResults, setManagerResults] = useState([])

    const handleChange = (e) => {
        const {name, value} = e.target

        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }))
    }

    const handleManager = (e) => {
        const {value} = e.target
        setManager(value)
    }

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const response = await fetchManagersWithToken({
                    access,
                    name: manager,
                })
                if (response.ok) {
                    const data = await response.json()
                    console.log(data)
                    setManagerResults(data.slice(0, 5))
                    console.log(managerResults)
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
            <Form.Group className="mb-3" style={{position: 'relative'}}>
                <div className="form-control-wrap">
                    <Form.Label className="text-secondary">Исполнитель</Form.Label>
                    <Form.Control
                        name="manager"
                        className="shadow-none"
                        placeholder="Не указано"
                        value={manager}
                        onChange={handleManager}
                    />
                    <div className="control-img">
                        <img src={people} alt=""/>
                    </div>
                </div>
                {errors.manager && <div className="text-danger">{errors.manager[0]}</div>}
                {managerResults.length > 0 && (
                    <ul className="kindergarten-suggestions" style={{
                        position: 'absolute',
                        top: '100%',
                        left: 0,
                        width: '100%',
                        backgroundColor: 'white',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                        zIndex: 1000,
                        maxHeight: '200px',
                        overflowY: 'auto',
                    }}>
                        {managerResults.map((item, index) => (

                            <li key={index}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setManagerResults([])
                                        setFormState((prev) => ({...prev, manager: item}))
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
    )
}

export default ExecutorInput
