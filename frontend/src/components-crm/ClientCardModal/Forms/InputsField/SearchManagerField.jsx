import React, { useState } from 'react';
import {fetchSingleManagerWithToken} from "../../../../http/client-cards/getSingleManager"; // Импорт вашего API-запроса

const ManagerSelectInput = ({ access, multiplyObject = false, onSelect }) => {
    const [searchValue, setSearchValue] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedManagers, setSelectedManagers] = useState(multiplyObject ? [] : null);
    const [isLoading, setIsLoading] = useState(false);

    // Функция для поиска менеджеров
    const handleSearch = async (value) => {
        console.log("handleSearch", value)
        if (!value) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        try {
            console.log("Volue Not Trim:", value)
            console.log("Value In Fethc:", value.trim())
            // Выполняем поиск менеджеров, передавая подготовленное имя
            const response = await fetchSingleManagerWithToken(access, value.trim());
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

    // Функция для выбора менеджера
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
        <div>
            <input
                type="text"
                placeholder="Начните вводить имя менеджера..."
                value={searchValue}
                onChange={handleChange}
            />
            {isLoading && <div>Загрузка...</div>}

            {/* Отображение результатов поиска */}
            {searchResults.length > 0 && (
                <ul>
                    {searchResults.map((manager) => (
                        <li key={manager.id}>
                            <button
                                type="button"
                                onClick={() => handleSelectManager(manager)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSelectManager(manager)}
                            >
                                {manager.full_name}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* Отображение выбранных менеджеров */}
            <div>
                {multiplyObject ? (
                    selectedManagers.map((manager) => (
                        <div key={manager.id} className="selected-manager">
                            {manager.full_name}
                            <button onClick={() => handleRemoveManager(manager.id)}>×</button>
                        </div>
                    ))
                ) : (
                    selectedManagers && (
                        <div>
                            {selectedManagers.full_name}
                            <button onClick={() => handleRemoveManager(selectedManagers.id)}>×</button>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default ManagerSelectInput;
