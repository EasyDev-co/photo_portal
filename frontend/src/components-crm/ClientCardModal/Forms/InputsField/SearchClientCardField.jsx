import React, { useEffect, useState } from 'react';
import { fetchSingleClientCardWithToken } from '../../../../http/client-cards/getSearchClientCard';
import { Form } from 'react-bootstrap';
import people from '../../../../assets/icons/people.svg';
import close_button from '../../../../assets/icons/close_button.svg';
import styles from './SearchManagerField.module.css';

const CardSelectInput = ({
    access,
    multiplyObject = false,
    onSelect,
    errors,
    name,
    initialCard,
    userRole,
}) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedCards, setSelectedCards] = useState(multiplyObject ? [] : null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (initialCard) {
            const cardData = { kindergarten_name: initialCard };
            setSelectedCards(multiplyObject ? [cardData] : cardData);
        }
    }, [initialCard, multiplyObject]);

    const handleSearch = async (value) => {
        if (!value.trim()) {
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
                console.error('Ошибка при поиске карт');
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
        console.log(searchResults);
    };

    const handleSelectCard = (card) => {
        if (multiplyObject) {
            if (!selectedCards.some((c) => c.id === card.id)) {
                const newSelectedCards = [...selectedCards, card];
                setSelectedCards(newSelectedCards);
                onSelect(newSelectedCards);
            }
        } else {
            setSelectedCards(card);
            onSelect(card);
        }
        setSearchValue(''); // Очищаем поле ввода
        setSearchResults([]); // Закрываем список
    };

    const handleRemoveCard = (id) => {
        if (multiplyObject) {
            const updatedCards = selectedCards.filter((c) => c.id !== id);
            setSelectedCards(updatedCards);
            onSelect(updatedCards);
        } else {
            setSelectedCards(null);
            onSelect(null);
        }
    };

    return (
        <div className={styles.block}>
            <Form.Group className="mb-3" style={{ position: 'relative' }}>
                <div className="form-control-wrap">
                    <Form.Label className="text-secondary">{name}</Form.Label>
                    <Form.Control
                        name="card"
                        className="shadow-none"
                        placeholder="Не указано"
                        value={searchValue}
                        onChange={handleChange}
                        disabled={userRole === 2}
                        autoComplete="off"
                    />
                    <div className="control-img">
                        <img src={people} alt="" />
                    </div>
                </div>
                {errors.card && <div className="text-danger">{errors.card[0]}</div>}
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
                        {searchResults.map((card, index) => (
                            <li key={index}>
                                <button
                                    type="button"
                                    onClick={() => handleSelectCard(card)}
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
                        selectedCards.map((card) => (
                            <div key={card.id} className={styles.selected_manager}>
                                <button onClick={() => handleRemoveCard(card.id)}>
                                    <img
                                        className={styles.close}
                                        src={close_button}
                                        alt="крестик"
                                    />
                                </button>
                                <p className={styles.text}>{card.kindergarten_name}</p>
                            </div>
                        ))
                    ) : (
                        selectedCards && (
                            <div className={styles.selected_manager}>
                                <button
                                    onClick={() => handleRemoveCard(selectedCards.id)}
                                >
                                    <img
                                        className={styles.close}
                                        src={close_button}
                                        alt="крестик"
                                    />
                                </button>
                                <p className={styles.text}>
                                    {selectedCards.kindergarten_name}
                                </p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default CardSelectInput;
