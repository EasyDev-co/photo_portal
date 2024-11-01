import React, { useState, useEffect } from 'react'
import { Form, Button, ModalFooter, FormLabel } from 'react-bootstrap'

import { fetchsingleNoteWithTokenInterceptor } from '../../../http/client-cards/getSingleNote'
import { deleteNoteWithToken } from '../../../http/client-cards/deleteNote'
import { patchNoteWithToken } from '../../../http/client-cards/patchNote'

const EditNoteForm = ({
  closeModal,
  noteId,
  formatDate,
  deleteItem,
  cardId,
  editNote,
}) => {
  const access = localStorage.getItem('access') // Get access token
  const [noteText, setNoteText] = useState('')
  const [noteInfo, setNoteInfo] = useState(null)
  const maxCharacters = 100

  const handleChange = (e) => {
    const { value } = e.target
    // Limit the input to a maximum of 100 characters
    if (value.length <= maxCharacters) {
      setNoteText(value)
    }
  }

  const handleSubmit = () => {
    const patchNote = async () => {
      const data = {
        text: noteText,
        author: 'b007b705-4f91-41ed-bbe8-90599d181ae4',
        client_card: cardId,
      }
      try {
        const response = await patchNoteWithToken(access, noteId, data) // Use the function to fetch data
        if (response.ok) {
          const res = await response.json()
          editNote(res.id, res.text)
          setNoteInfo(res)
          setNoteText(res.text)
          closeModal()
        } else {
          console.error('Failed to delete note')
        }
      } catch (error) {
        console.error('Error deleting note:', error)
      }
    }

    patchNote()
  }

  const handleDelete = () => {
    const deleteNote = async () => {
      try {
        const response = await deleteNoteWithToken(access, noteId) // Use the function to fetch data
        if (response.ok) {
          setNoteInfo(null)
          setNoteText('')
          closeModal()
          deleteItem(noteId)
        } else {
          console.error('Failed to delete note')
        }
      } catch (error) {
        console.error('Error deleting note:', error)
      }
    }

    deleteNote()
  }

  useEffect(() => {
    if (noteId) {
      const fetchNote = async () => {
        try {
          const response = await fetchsingleNoteWithTokenInterceptor(
            access,
            noteId
          ) // Use the function to fetch data
          if (response.ok) {
            const data = await response.json() // Parse the response JSON
            setNoteInfo(data)
            setNoteText(data.text)
          } else {
            console.error('Failed to fetch note')
          }
        } catch (error) {
          console.error('Error fetching note:', error)
        }
      }
      fetchNote()
    }
  }, [access, noteId])

  return (
    <Form>
      <FormLabel>
        <p>{noteInfo && formatDate(noteInfo.created_at)}</p>
      </FormLabel>
      <Form.Group controlId="noteText">
        <Form.Control
          as="textarea"
          rows={6}
          style={{ padding: '15px', resize: 'none', height: '120px' }}
          value={noteText}
          onChange={handleChange}
          placeholder="Write a message"
        />
        <Form.Text className="text-muted">
          {noteText.length} / {maxCharacters}
        </Form.Text>
      </Form.Group>
      <ModalFooter style={{ padding: '5px' }}>
        <Button className="btn-filter-reset text-center" onClick={handleDelete}>
          Удалить
        </Button>
        <Button
          className="create-btn"
          style={{ padding: '7px 12px' }}
          onClick={handleSubmit}
        >
          Обновить
        </Button>
      </ModalFooter>
    </Form>
  )
}

export default EditNoteForm
