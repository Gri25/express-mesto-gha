const routerCard = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const validateRegisterCard = require('../middlewares/validationCard');

routerCard.get('/cards', getCards);

routerCard.post('/cards', validateRegisterCard, createCard);

routerCard.delete('/cards/:id', validateRegisterCard, deleteCard);

routerCard.put('/cards/:id/likes', likeCard);

routerCard.delete('/cards/:id/likes', dislikeCard);

module.exports = routerCard;
