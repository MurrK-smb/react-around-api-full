import { apiConfig } from './constants'

class Api {
  constructor({ baseUrl, headers }) {
    this._baseUrl = baseUrl
    this._headers = headers
  }

  // Checks if response was successful
  _checkResponse(res) {
    if (res.ok) {
      return res.json()
    }
    return Promise.reject(`Error: ${res.status}`)
  }

  // Saves card data to card list
  addCard(card) {
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify(card)
    })
      .then(res => this._checkResponse(res))
  }

  // Removes card data from card list
  deleteCard({ cardId }) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers
    })
      .then(res => this._checkResponse(res))
  }

  // Adds and removes user's id from list of likes
  toggleLike({ cardId, isLiked }) {
    return fetch(`${this._baseUrl}/cards/likes/${cardId}`, {
      method: isLiked ? 'DELETE' : 'PUT',
      headers: this._headers
    }).then(res => this._checkResponse(res))
  }

  // Edits user's name and job
  editProfile({ name, about }) {
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name,
        about
      })
    }).then(res => this._checkResponse(res))
  }

  // Edits user's profile pic url
  editAvatar({ avatar }) {
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: avatar
      })
    }).then(res => this._checkResponse(res))
  }

  // Returns current list of cards from server
  getCardList() {
    return fetch(`${this._baseUrl}/cards`, {headers: this._headers}).then(res => this._checkResponse(res))
  }

  // Returns user's current information
  getUserInfo() {
    return fetch(`${this._baseUrl}/users/me`, {headers: this._headers}).then(res => this._checkResponse(res))
  }
}

const api = new Api(apiConfig)

export default api