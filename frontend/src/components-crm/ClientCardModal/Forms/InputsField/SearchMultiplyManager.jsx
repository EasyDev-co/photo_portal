import React, { useEffect, useState } from 'react';
import {fetchSingleManagerWithToken} from "../../../../http/client-cards/getSingleManager"; // Импорт вашего API-запроса
import { Form } from 'react-bootstrap';
import people from '../../../../assets/icons/people.svg'
import styles from './SearchManagerField.module.css';
import close_button from '../../../../assets/icons/close_button.svg'

const ManagerSelectInput = ({ access, multiplyObject = false, onSelect, errors, name, initialManager, userRole }) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedManagers, setSelectedManagers] = useState(multiplyObject ? [] : null);
    const [isLoading, setIsLoading] = useState(false);
    const [manager, setManager] = useState('');

    useEffect(() => {
        if (initialManager) {
            const managerData = { full_name: initialManager }; // Независимо от формата, создаем объект с ключом `full_name`
            setSelectedManagers(multiplyObject ? [managerData] : managerData);
        }
        setIsLoading(false);
    }, [initialManager, multiplyObject]);

    if (isLoading) {
        return <div>Загрузка...</div>;  // Компонент загрузки
    }
    const handleManager = (e) => {
        const {value} = e.target
        setManager(value)
    }

    // Функция для поиска менеджеров
    const handleSearch = async (value) => {
        if (!value) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            // Выполняем поиск менеджеров, передавая подготовленное имя
            const response = await fetchSingleManagerWithToken(access, value.trim());
            if (response.ok) {
                const data = await response.json();
                console.log(data)
                setSearchResults(data);
            } else {
                console.error('Ошибка при поиске менеджеров');
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    // Обработчик изменения инпута
    const handleChange = (e) => {
        const value = e.target.value;
        console.log("HandleChange", e.target.value)
        setSearchValue(value);
        handleSearch(value);
    };

    // Функция для выбора менеджера
    const handleSelectManager = (manager) => {
        if (multiplyObject) {
            console.log(manager)
            if (!selectedManagers.some((m) => m.id === manager.id)) {
                const newSelectedManagers = [...selectedManagers, manager];
                setSelectedManagers(newSelectedManagers);
                console.log(newSelectedManagers)
                onSelect(newSelectedManagers);
            }
        } else {
            setSelectedManagers(manager);
            onSelect(manager);
        }
        setSearchValue('');
        setSearchResults([]);
    };

    // Функция для удаления выбранного менеджера
    const handleRemoveManager = (id) => {
        if (multiplyObject) {
            const updatedManagers = selectedManagers.filter((m) => m.id !== id);
            setSelectedManagers(updatedManagers);
            onSelect(updatedManagers);
        } else {
            setSelectedManagers(null);
            onSelect(null);
        }
    };

    return (
        <>
        { multiplyObject ? (<div className={styles.block}>
            <Form.Group className="mb-3" style={{position: 'relative'}}>
                <div className="form-control-wrap">
                    <Form.Label className="text-secondary">{name}</Form.Label>
                    <Form.Control
                        name="manager"
                        className="shadow-none"
                        placeholder="Не указано"
                        value={selectedManagers}
                        onChange={handleChange}
                        disabled={userRole == 2}
                    />
                    {isLoading && <div>Загрузка...</div>}
                    <div className="control-img">
                        <img src={people} alt=""/>
                    </div>
                </div>
                {errors.manager && <div className="text-danger">{errors.manager[0]}</div>}
                {searchResults.length > 0 && (
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
                        {searchResults.map((manager, index) => (

                            <li key={index}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleSelectManager(manager)

                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSelectManager(manager)}
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
                                    {manager.full_name}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </Form.Group>
        <div>
            <div className={styles.manager_block}>
                {multiplyObject ? (
                    selectedManagers.map((manager) => (
                        <div key={manager.id} className={styles.selected_manager}>
                            <button onClick={() => handleRemoveManager(manager.id)}>
                                <img className={styles.close} src={close_button} alt='крестик'></img>
                            </button>
                            <p className={styles.text}>{manager.full_name}</p>
                        </div>
                    ))
                ) : 
                (
                    selectedManagers && (
                        <div className={styles.selected_manager}>
                            <button onClick={() => handleRemoveManager(selectedManagers.id)}>
                                <img className={styles.close} src={close_button} alt='крестик'></img>
                            </button>
                            <p className={styles.text}>{selectedManagers.full_name}</p>
                        </div>
                    )
                )
                }
            </div>
        </div> 
        </div>) : (
            <Form.Group className="mb-3" style={{position: 'relative'}}>
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
                    <img src={people} alt=""/>
                </div>
            </div>
            {errors.manager && <div className="text-danger">{errors.manager[0]}</div>}
            {searchResults.length > 0 && (
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
                    {searchResults.map((manager, index) => (

                        <li key={index}>
                            <button
                                type="button"
                                onClick={() => {
                                    handleSelectManager(manager)
                                    // setSearchResults([])
                                    // selectedManagers((prev) => ({...prev, manager: item}))
                                    setManager(manager.full_name)

                                }}
                                onKeyDown={(e) => e.key === 'Enter' && handleSelectManager(manager)}
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
                                {manager.full_name}{' '}
                                {/* Adjust according to your response structure */}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </Form.Group>
        )}
       </>
    );
};


export default ManagerSelectInput;
