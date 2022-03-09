const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routesUser = require('./routes/users');
const routerCard = require('./routes/cards');

const { PORT = 3000 } = process.env;

// const auth = require('./middlewares/auth');

const app = express();

app.use(express.json());
/*
app.use((req, res, next) => {
  req.user = {
    _id: '62019c8a5c57068990615d0c',
  };

  next();
});
*/
// app.use(auth);

app.use(routesUser);

app.use(routerCard);

app.use((req, res) => {
  res.status(404).send({ message: 'Не корректный URL' });
});

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(errors());
// здесь обрабатываем все ошибки
app.use((err, req, res, next) => {
//  console.log(err);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Ошибка на стороне сервера';
  res.status(statusCode).send({ message });
  //  res.status(500).send({ message: 'На сервере произошла ошибка' });

  next();
});

app.listen(PORT);
