const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  NotFoundErr,
  BadRequestErr,
  UnAutorizedErr,
  ConflictErr,
} = require('../errors');
const User = require('../models/user');

const MONGO_DUPLICATE_ERROR_CODE = 11000;
const SOLT_ROUND = 10;

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => {
      next(err);
    });
};

const getUserMe = (req, res, next) => {
  const { email } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundErr('Пользователь по переданному id не найден');
      }
    })
    .catch((err) => {
      next(err);
    });
};

const sendUser = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundErr('Пользователь по переданному id не найден');
      }
    })
    .catch((err) => {
      next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
      upsert: false, // если пользователь не найден, он будет создан
    },
  )
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundErr('Пользователь по переданному id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  // обновим имя найденного по _id пользователя
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, avatar, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
    upsert: false, // если пользователь не найден, он будет создан
  })
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        throw new NotFoundErr('Пользователь по переданному id не найден');
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, SOLT_ROUND)
    .then((hash) => {
      // записываем данные в базу
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
      // возвращаем записанные в базу данные пользователю
        .then((user) => res.send({ data: user }))
      // возможно юзер нужно будет переписать с нижней буквы
      // если данные не записались, вернём ошибку
        .catch((err) => {
          if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
            next(new ConflictErr('Такой пользователь уже существует'));
          //  res.status(409).send({ message: 'Такой пользователь уже существует' });
          }
          if (err.name === 'ValidationError') {
            next(new BadRequestErr(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
          //  res.status(400).send({ message: 'Переданы не корректные данные' });
          } else {
            next(err);
          //  res.status(500).send({ message: 'Произошла ошибочка' });
          }
        });
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // не совсем понял как записывать в куки
      // вернём токен
      res.send({ token });
    })
    .catch(() => {
      next(new UnAutorizedErr('Ошибка авторизации'));
    });
};

module.exports = {
  getUsers,
  sendUser,
  createUser,
  updateProfile,
  updateAvatar,
  login,
  getUserMe,
};

/*
const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, SOLT_ROUND)
    .then((hash) => {
      // записываем данные в базу
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
      // возвращаем записанные в базу данные пользователю
        .then((user) => res.send({ data: user }))
      // возможно юзер нужно будет переписать с нижней буквы
      // если данные не записались, вернём ошибку
        .catch((err) => {
          if (err.code === MONGO_DUPLICATE_ERROR_CODE) {
            res.status(409).send({ message: 'Такой пользователь уже существует' });
          }
          if (err.name === 'ValidationError') {
            res.status(400).send({ message: 'Переданы не корректные данные' });
          } else {
            res.status(500).send({ message: 'Произошла ошибочка' });
          }
        });
    });
};

const sendUser = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        //  res
        //  .status(404)
        //  .send({ message: 'Пользователь по переданному id не найден' });
        throw new NotFoundErr('Пользователь по переданному id не найден');
      } else {
        res.send({ data: user });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Невалидный id пользователя' });
      } else {
        res.status(500).send({ message: 'Произошла ошибочка' });
      }

};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      // аутентификация успешна! пользователь в переменной user
      // создадим токен
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // не совсем понял как записывать в куки
      // вернём токен
      res.send({ token });
    })
    .catch((err) => {
      // ошибка аутентификации
      res
        .status(401)
        .send({ message: err.message });
    });
};
*/