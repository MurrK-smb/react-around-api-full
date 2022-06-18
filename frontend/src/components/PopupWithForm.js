import xButton from '../images/x-button.svg'

function PopupWithForm({ id, title, isOpen, onClose, formId, buttonText, onSubmit, children }) {

  return (
    <div className={`modal ${isOpen && 'modal_open'}`} id={id}>
      <div className="modal__body modal__body_input">
        <button className="modal__close-button" type="button" onClick={onClose}>
          <img className="modal__close-button-image" src={xButton} alt="exit button"/>
        </button>
        <h2 className="modal__title">{title}</h2>
        <form className="form" id={formId} onSubmit={onSubmit}>
          { children }
          <button className="form__submit" type="submit">{buttonText}</button>
        </form>
      </div>
    </div>
  )
}

export default PopupWithForm