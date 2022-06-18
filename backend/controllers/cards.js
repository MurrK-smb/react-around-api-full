const Card = require("../models/card");
const NotFoundError = require("../errors/not-found-err");
const ForbiddenError = require("../errors/forbidden-err");
const BadRequestError = require("../errors/bad-request-err");
const {
  SUCCESS,
  CREATED_SUCCESS,
  NOT_FOUND_ERROR,
} = require("../utils/constants");

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(SUCCESS).send(cards))
    .catch(next);
};

const createCard = (req, res, next) => {
  const owner = req.user._id;
  const { name, link } = req.body;
  Card.create({ name, link, owner })
    .then((card) => res.status(CREATED_SUCCESS).send(card))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            `${Object.values(err.errors)
              .map((error) => error.message)
              .join(", ")}`
          )
        );
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => new NotFoundError("Card ID not found"))
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        next(new ForbiddenError("You can only delete your own cards"));
      } else {
        Card.deleteOne(card).then(() =>
          res.status(SUCCESS).send({ data: card })
        );
      }
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .orFail(() => new NotFoundError("Card ID not found"))
    .then((card) => {
      res.status(SUCCESS).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid card ID"));
      } else if (err.statusCode === NOT_FOUND_ERROR) {
        next(new NotFoundError("Card not found"));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true }
  )
    .orFail(() => new NotFoundError("Card ID not found"))
    .then((card) => {
      res.status(SUCCESS).send({ data: card });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid card ID"));
      } else if (err.statusCode === NOT_FOUND_ERROR) {
        next(new NotFoundError("Card not found"));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
