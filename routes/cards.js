const routerCard = require('express').Router();
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');

const validateRegisterCard = require('../middlewares/validationCard');
const validateRegisterId = require('../middlewares/validationId');
const auth = require('../middlewares/auth');

routerCard.get('/cards', auth, getCards);

routerCard.post('/cards', auth, validateRegisterCard, createCard);

routerCard.delete('/cards/:id', auth, validateRegisterId, deleteCard);

routerCard.put('/cards/:id/likes', auth, validateRegisterId, likeCard);

routerCard.delete('/cards/:id/likes', auth, validateRegisterId, dislikeCard);

module.exports = routerCard;
