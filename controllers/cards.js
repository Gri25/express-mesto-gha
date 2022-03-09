const Card = require('../models/card');
const { NotFoundErr, BadRequestErr } = require('../errors');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      next(err);
    });
};

const createCard = (req, res, next) => {
  const ownerId = req.user._id;
  const { name, link } = req.body;
  // записываем данные в базу
  Card.create({ name, link, owner: ownerId })
    // возвращаем записанные в базу данные карточки
    .then((card) => res.send({ data: card }))
    // если данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id)
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundErr('Карточка по переданному id не найден');
      }
    })
    .catch((err) => {
      next(err);
    });
};

const likeCard = (req, res, next) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundErr('Карточка по переданному id не найден');
      }
    })
    .catch((err) => {
      next(err);
    });
};

const dislikeCard = (req, res, next) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundErr('Карточка по переданному id не найден');
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};

/*
const deleteCard = (req, res, next) => {
  const { id } = req.params;
  Card.findByIdAndRemove(id)
    .then((card) => {
      if (card) {
        res.send({ data: card });
      } else {
        throw new NotFoundErr('Карточка по переданному id не найден');
      }
    })
    .catch((err) => {
      next(err);
    });
};

const likeCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $addToSet: { likes: id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: 'Карточка по переданному id не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id карточки' });
      } else {
        res.status(500).send({ message: 'Произошла ошибочка' });
      }
    });
};

const dislikeCard = (req, res) => {
  const { id } = req.params;
  Card.findByIdAndUpdate(
    id,
    { $pull: { likes: id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: 'Карточка по переданному id не найдена' });
      } else {
        res.send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id карточки' });
      } else {
        res.status(500).send({ message: 'Произошла ошибочка' });
      }
    });
};
*/
