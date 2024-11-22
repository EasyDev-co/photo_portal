import React, { useState, useEffect } from 'react'
import { Form, Button, ModalFooter } from 'react-bootstrap'

const StatusTask = ({onSelect, initialStatus, defaultToFirst = true}) => {
  const access = localStorage.getItem('access') // Get access token

  const init = {
    "Открыта": "1",
    "Выполнена": "2"
  }

  // const [type, setType] = useState(initialType ? [initialType] : '')
  const [status, setStatus] = useState(
    initialStatus !== undefined
      ? initialStatus
      : defaultToFirst
      ? Object.values(init)[0] // По умолчанию выбираем первый элемент
      : ''
  );

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { value } = e.target
    setStatus(value)
  }

  useEffect(() => {
    onSelect(status)
  }, [status])

  return (
    <Form.Group className="mb-3">
      <Form.Label className="text-secondary">Тип задачи</Form.Label>
      <Form.Select
        name="status"
        className="shadow-none"
        style={{ width: '100%' }}
        // value={type || init[initialType] || '1'}
        value={status}
        onChange={(e) => {
          if (e.target.value !== status) {
            handleChange(e) // Передаем событие e, а не значение
          }
        }}
      >
        <option value="1">Открыта</option>
        <option value="2">Выполнена</option>
      </Form.Select>
      {errors.status && <div className="text-danger">{errors.status[0]}</div>}
    </Form.Group>
  )
}

export default StatusTask
