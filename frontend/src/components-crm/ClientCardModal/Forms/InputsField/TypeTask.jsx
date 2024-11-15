import React, { useState, useEffect } from 'react'
import { Form, Button, ModalFooter } from 'react-bootstrap'

const TypeTask = ({onSelect, initialType}) => {
  const access = localStorage.getItem('access') // Get access token

  const init = {
    "Звонок": "1",
    "Сбор оплаты+ отправка ссылок": "2",
    "Принять заказ": "3",
    "Позвонить холодный/списки": "4",
    "Проверить отправку образцов, Готовые фото.": "5",
    "Теплые сады": "6",
    "Напомнить о записи": "7",
    "Позвонить по КП, Проверить смс по Вотсапп": "8"
  }

  const revertInit = {
    "1": "Звонок",
    "2": "Сбор оплаты+ отправка ссылок",
    "3": "Принять заказ",
    "4": "Позвонить холодный/списки",
    "5": "Проверить отправку образцов, Готовые фото.",
    "6": "Теплые сады",
    "7": "Напомнить о записи",
    "8": "Позвонить по КП, Проверить смс по Вотсапп",
  }

  const [type, setType] = useState(initialType ? [initialType] : '')

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { value } = e.target
    setType(value)
  }

  useEffect(() => {
    onSelect(type)
  }, [type])

  return (
    <Form.Group className="mb-3">
      <Form.Label className="text-secondary">Тип задачи</Form.Label>
      <Form.Select
        name="status"
        className="shadow-none"
        style={{ width: '100%' }}
        value={type || init[initialType] || '1'}
        onChange={(e) => {
          if (e.target.value !== type) {
            handleChange(e) // Передаем событие e, а не значение
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
      {errors.type && <div className="text-danger">{errors.type[0]}</div>}
    </Form.Group>
  )
}

export default TypeTask
