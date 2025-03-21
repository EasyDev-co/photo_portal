import React, { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import people from '../../../../assets/icons/people.svg';
import close_button from '../../../../assets/icons/close_button.svg';
import styles from './SearchManagerField.module.css';
import { fetchSingleManagerWithToken } from '../../../../http/client-cards/getSingleManager';

const ManagerSelectInput = ({ access, multiplyObject = false, onSelect, errors, name, initialManager }) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedManagers, setSelectedManagers] = useState(multiplyObject ? [] : null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialManager) {
            const managerData = { full_name: initialManager }; // Создаем объект для отображения менеджера
            setSelectedManagers(multiplyObject ? [managerData] : managerData);
        }
    }, [initialManager, multiplyObject]);

    const handleSearch = async (value) => {
        if (!value.trim()) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetchSingleManagerWithToken(access, value.trim());
            if (response.ok) {
                const data = await response.json();
                setSearchResults(data);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setSearchValue(value);
        handleSearch(value);
    };

    const handleSelectManager = (manager) => {
        if (multiplyObject) {
            if (!selectedManagers.some((m) => m.id === manager.id)) {
                const newSelectedManagers = [...selectedManagers, manager];
                setSelectedManagers(newSelectedManagers);
                onSelect(newSelectedManagers);
            }
        } else {
            setSelectedManagers(manager);
            onSelect(manager);
        }
        setSearchValue(''); // Очищаем поле ввода
        setSearchResults([]); // Закрываем список результатов
    };

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
        <div className={styles.block}>
            <Form.Group className="mb-3" style={{ position: 'relative' }}>
                <div className="form-control-wrap">
                    <Form.Label className="text-secondary">{name}</Form.Label>
                    <Form.Control
                        name="manager"
                        className="shadow-none"
                        placeholder="Не указано"
                        value={searchValue}
                        onChange={handleChange}
                    />
                    <div className="control-img">
                        <img src={people} alt="" />
                    </div>
                </div>
                {errors?.manager && <div className="text-danger">{errors.manager[0]}</div>}
                {searchResults.length > 0 && (
                    <ul
                        className="kindergarten-suggestions"
                        style={{
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
                        }}
                    >
                        {searchResults.map((manager, index) => (
                            <li key={index}>
                                <button
                                    type="button"
                                    onClick={() => handleSelectManager(manager)}
                                    style={{
                                        cursor: 'pointer',
                                        background: 'none',
                                        border: 'none',
                                        padding: '10px',
                                        textAlign: 'left',
                                        width: '100%',
                                        display: 'block',
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
            <div className={styles.manager_block}>
                {multiplyObject ? (
                    selectedManagers.map((manager) => (
                        <div key={manager.id} className={styles.selected_manager}>
                            <button onClick={() => handleRemoveManager(manager.id)}>
                                <img className={styles.close} src={close_button} alt="крестик" />
                            </button>
                            <p className={styles.text}>{manager.full_name}</p>
                        </div>
                    ))
                ) : (
                    selectedManagers && (
                        <div className={styles.selected_manager}>
                            <button onClick={() => handleRemoveManager(selectedManagers.id)}>
                                <img className={styles.close} src={close_button} alt="крестик" />
                            </button>
                            <p className={styles.text}>{selectedManagers.full_name}</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ManagerSelectInput;