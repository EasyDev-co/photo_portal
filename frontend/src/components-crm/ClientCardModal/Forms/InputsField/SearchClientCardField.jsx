import React, { useEffect, useState } from 'react';
import {fetchSingleManagerWithToken} from "../../../../http/client-cards/getSingleManager"; // Импорт вашего API-запроса
import { Form } from 'react-bootstrap';
import people from '../../../../assets/icons/people.svg'
import styles from './SearchManagerField.module.css';
import close_button from '../../../../assets/icons/close_button.svg'
import { fetchSingleClientCardWithToken } from '../../../../http/client-cards/getSearchClientCard';

const CardSelectInput = ({ access, multiplyObject = false, onSelect, errors, name, initialCard }) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCard, setSelectedCard] = useState(multiplyObject ? [] : null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialCard) {
            const managerData = { kindergarten_name: initialCard }; // Независимо от формата, создаем объект с ключом `full_name`
            setSelectedCard(multiplyObject ? [managerData] : managerData);
        }
        setIsLoading(false);
    }, [initialCard, multiplyObject]);

    if (isLoading) {
        return <div>Загрузка...</div>;  // Компонент загрузки
    }

    const handleSearch = async (value) => {
        if (!value) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetchSingleClientCardWithToken(access, value.trim());
            if (response.ok) {
                const data = await response.json();
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

    const handleSelectCard = (card) => {
        if (multiplyObject) {
            if (!selectedCard.some((m) => m.id === card.id)) {
                const newSelectedCard = [...selectedCard, card];
                setSelectedCard(newSelectedCard);
                onSelect(newSelectedCard);
            }
        } else {
            setSelectedCard(card);
            onSelect(card);
        }
        setSearchValue('');
        setSearchResults([]);
    };

    const handleRemoveCard = (id) => {
        if (multiplyObject) {
            const updatedCards = selectedCard.filter((m) => m.id !== id);
            setSelectedCard(updatedCards);
            onSelect(updatedCards);
        } else {
            setSelectedCard(null);
            onSelect(null);
        }
    };

    return (
        <div className={styles.block}>
        <Form.Group className="mb-3" style={{position: 'relative'}}>
                <div className="form-control-wrap">
                    <Form.Label className="text-secondary">{name}</Form.Label>
                    <Form.Control
                        name="card"
                        className="shadow-none"
                        placeholder="Не указано"
                        value={searchValue}
                        onChange={handleChange}
                    />
                    {isLoading && <div>Загрузка...</div>}
                    <div className="control-img">
                        <img src={people} alt=""/>
                    </div>
                </div>
                {errors.card && <div className="text-danger">{errors.card[0]}</div>}
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
                        {searchResults.map((card, index) => (

                            <li key={index}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        handleSelectCard(card)

                                    }}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSelectCard(card)}
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
                                    {card.kindergarten_name}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </Form.Group>
        <div>
            <div className={styles.manager_block}>
                {multiplyObject ? (
                    selectedCard.map((card) => (
                        <div key={card.id} className={styles.selected_manager}>
                            <button onClick={() => handleRemoveCard(card.id)}>
                                <img className={styles.close} src={close_button} alt='крестик'></img>
                            </button>
                            <p className={styles.text}>{card.kindergarten_name}</p>
                        </div>
                    ))
                ) : (
                    selectedCard && (
                        <div className={styles.selected_manager}>
                            <button onClick={() => handleRemoveCard(selectedCard.id)}>
                                <img className={styles.close} src={close_button} alt='крестик'></img>
                            </button>
                            <p className={styles.text}>{selectedCard.kindergarten_name}</p>
                        </div>
                    )
                )}
            </div>
        </div>
        </div>
    );
};

export default CardSelectInput;
