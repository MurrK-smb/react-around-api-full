import xButton from '../images/x-button.svg'

function ImagePopup({ card, onClose }) {

  return (
    <div className={`modal ${card && 'modal_open'}`} id="img">
      <div className="modal__body">
        <button className="modal__close-button" onClick={onClose}>
          <img className="modal__close-button-image" src={xButton} alt="exit button"/>
        </button>
        <img className="modal__img-content" src={card && card.link} alt="card image"/>
        <p className="modal__img-caption">{card && card.name}</p>
      </div>
    </div>
  )
}

export default ImagePopup