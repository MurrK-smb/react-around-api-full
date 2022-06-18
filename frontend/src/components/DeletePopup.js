import React from 'react'
import PopupWithForm from './PopupWithForm'

export default function DeletePopup({ isOpen, onClose, onDeleteCard, card }) {

  function handleSubmit(e) {
    e.preventDefault()
    onDeleteCard(card)
  }

  return (
    <PopupWithForm id={"delete"} title={"Are You Sure?"} isOpen={isOpen} onClose={onClose} formId={"delete-form"} buttonText={"Yes"} onSubmit={handleSubmit} />
  )
}