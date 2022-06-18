import React from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import EditProfilePopup from "./EditProfilePopup";
import AddPlacePopup from "./AddPlacePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import DeletePopup from "./DeletePopup";
import ImagePopup from "./ImagePopup";
import Login from "./Login";
import Register from "./Register";
import InfoTooltip from "./InfoTooltip";
import api from "../utils/api";
import { register, login, checkToken } from "../utils/auth";
import { CurrentUserContext } from "../contexts/CurrentUserContext";

function App() {
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isDeletePopupOpen, setIsDeletePopupOpen] = React.useState(false);
  const [tooltipOpen, setTooltipOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState(undefined);
  const [selectedDeleteCard, setSelectedDeleteCard] = React.useState(undefined);
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [formValidity, setFormValidity] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState({});
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const [toggleMenu, setToggleMenu] = React.useState(false);

  const history = useNavigate();

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsDeletePopupOpen(false);
    setTooltipOpen(false);
    setSelectedCard(undefined);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleDeleteClick(card) {
    setIsDeletePopupOpen(true);
    setSelectedDeleteCard(card);
  }

  function handleCardLike(card) {
    const isLiked = card.likes.some((like) => like._id === currentUser._id);
    api
      .toggleLike({ cardId: card._id, isLiked })
      .then((newCard) => {
        setCards((state) =>
          state.map((item) => (item._id === card._id ? newCard : item))
        );
      })
      .catch((err) => console.log(err));
  }

  function handleDeleteCard(card) {
    api
      .deleteCard({ cardId: card._id })
      .then(() => {
        setCards((state) => state.filter((item) => item._id !== card._id));
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateUser(currentUser) {
    api
      .editProfile({ name: currentUser.name, about: currentUser.about })
      .then((info) => {
        setCurrentUser(info);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(card) {
    api
      .addCard(card)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(currentUser) {
    api
      .editAvatar({ avatar: currentUser.avatar })
      .then((info) => {
        setCurrentUser(info);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  const checkValidity = (evt) => {
    const name = evt.target.name;
    setErrorMessage({ ...errorMessage, [name]: evt.target.validationMessage });
  };

  const onFormUpdate = (data) => {
    data ? setFormValidity(true) : setFormValidity(false);
  };

  const handleTokenCheck = () => {
    if (localStorage.getItem("jwt")) {
      const jwt = localStorage.getItem("jwt");
      checkToken(jwt)
        .then((res) => {
          if (res) {
            setLoggedIn(true);
            history("/");
            console.log("should be all good");
          } else {
            localStorage.removeItem("jwt");
            console.log("checkToken() failed for some reason");
          }
        })
        .catch((err) => console.log("something went really wrong"));
    }
  };

  const toggleNav = () => {
    setToggleMenu(!toggleMenu);
  };

  const handleLogin = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    setLoggedIn(false);
    setToggleMenu(false);
    localStorage.removeItem("jwt");
    history("/signin");
  };

  const handleRegisterSubmit = (email, password) => {
    register(email, password)
      .then((res) => {
        if (res.data._id) {
          console.log("res OK");
          setStatus("success");
          history("/signin");
        } else {
          console.log("Something went wrong.");
          setStatus("failed");
        }
      })
      .catch((err) => {
        console.log(err);
        setStatus("failed");
      })
      .finally(() => setTooltipOpen(true));
  };

  const handleLoginSubmit = (email, password) => {
    if (!password || !email) {
      setStatus("failed");
      setTooltipOpen(true);
      return;
    }
    login(email, password)
      .then((data) => {
        if (data.token) {
          handleLogin();
          history("/");
          setStatus("success");
          setTooltipOpen(true);
        }
      })
      .catch((err) => {
        console.log(err);
        setStatus("failed");
        setTooltipOpen(true);
      });
  };

  React.useEffect(() => {
    function closeByEscape(e) {
      if (e.key === "Escape") {
        closeAllPopups();
      }
    }
    document.addEventListener("keydown", closeByEscape);
    return () => document.removeEventListener("keydown", closeByEscape);
  }, []);

  React.useEffect(() => {
    api
      .getUserInfo()
      .then((info) => setCurrentUser(info))
      .catch((err) => console.log(err));
    api
      .getCardList()
      .then((cards) => setCards(cards))
      .catch((err) => console.log(err));
    handleTokenCheck();
  }, []);

  return (
    <div className="root">
      <CurrentUserContext.Provider value={currentUser}>
        <div className="content">
          <Header
            loggedIn={loggedIn}
            handleLogout={handleLogout}
            email={localStorage.email}
            toggleNav={toggleNav}
            toggleMenu={toggleMenu}
          />

          <Routes>
            <Route
              exact
              path="/"
              element={
                <ProtectedRoute loggedIn={loggedIn}>
                  <Main
                    onEditAvatarClick={handleEditAvatarClick}
                    onEditProfileClick={handleEditProfileClick}
                    onAddPlaceClick={handleAddPlaceClick}
                    onCardClick={handleCardClick}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleDeleteClick}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path="/signin"
              element={<Login handleLoginSubmit={handleLoginSubmit} />}
            />
            <Route
              path="/signup"
              element={<Register handleRegisterSubmit={handleRegisterSubmit} />}
            />
            <Route
              path="*"
              element={
                loggedIn ? (
                  <Navigate to="/" replace />
                ) : (
                  <Navigate to="/signin" replace />
                )
              }
            />
          </Routes>

          <Footer />

          <EditProfilePopup
            isOpen={isEditProfilePopupOpen}
            onClose={closeAllPopups}
            onUpdateUser={handleUpdateUser}
            formValidity={formValidity}
            onInputUpdate={checkValidity}
            onFormUpdate={onFormUpdate}
          />

          <AddPlacePopup
            isOpen={isAddPlacePopupOpen}
            onClose={closeAllPopups}
            onAddPlaceSubmit={handleAddPlaceSubmit}
            formValidity={formValidity}
            onInputUpdate={checkValidity}
            onFormUpdate={onFormUpdate}
          />

          <EditAvatarPopup
            isOpen={isEditAvatarPopupOpen}
            onClose={closeAllPopups}
            onUpdateAvatar={handleUpdateAvatar}
            formValidity={formValidity}
            onInputUpdate={checkValidity}
            onFormUpdate={onFormUpdate}
          />

          <DeletePopup
            isOpen={isDeletePopupOpen}
            onClose={closeAllPopups}
            onDeleteCard={handleDeleteCard}
            card={selectedDeleteCard}
            formValidity={formValidity}
          />

          <ImagePopup card={selectedCard} onClose={closeAllPopups} />

          <InfoTooltip
            isOpen={tooltipOpen}
            onClose={closeAllPopups}
            status={status}
          />
        </div>
      </CurrentUserContext.Provider>
    </div>
  );
}

export default App;
