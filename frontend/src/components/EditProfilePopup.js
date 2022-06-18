import React from "react";
import PopupWithForm from "./PopupWithForm";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

export default function EditPopupWithForm({
  isOpen,
  onClose,
  onUpdateUser,
  formValidity,
  onInputUpdate,
  onFormUpdate,
}) {
  const currentUser = React.useContext(CurrentUserContext);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");

  function handleNameChange(e) {
    onInputUpdate(e);
    setName(e.target.value);
  }

  function handleDescriptionChange(e) {
    onInputUpdate(e);
    setDescription(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }

  React.useEffect(() => {
    setName(currentUser.name || "");
    setDescription(currentUser.about || "");
  }, [currentUser, isOpen]);

  return (
    <PopupWithForm
      id={"edit"}
      title={"Edit Profile"}
      isOpen={isOpen}
      onClose={onClose}
      formId={"edit-form"}
      buttonText={"Save"}
      onSubmit={handleSubmit}
      formValidity={formValidity}
      onFormUpdate={onFormUpdate}
    >
      <input
        className="form__input"
        id="form-name"
        type="text"
        name="name"
        autoComplete="off"
        required
        minLength="2"
        maxLength="40"
        value={name}
        onChange={handleNameChange}
      />
      <span className="form__validation" id="form-name-error"></span>
      <input
        className="form__input"
        id="form-caption"
        type="text"
        name="about"
        autoComplete="off"
        required
        minLength="2"
        maxLength="200"
        value={description}
        onChange={handleDescriptionChange}
      />
      <span className="form__validation" id="form-caption-error"></span>
    </PopupWithForm>
  );
}
