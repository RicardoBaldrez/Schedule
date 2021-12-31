require('dotenv').config();

const express = require('express');
const app = express();

const routes = require('./routes');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');
const helmet = require('helmet'); // Helmet é uma recomendação do Express
const csrf = require('csurf'); // CSRF

const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('DB conectado!!!');
    app.emit('DBConnected');
  })
  .catch(() => console.log('Não foi possível conectar ao DB!!!'));

const session = require('express-session');
const MongoStore = require('connect-mongo');
const flashMessages = require('connect-flash');

const sessionOptions = session({
  secret: 'ricardobaldrez',
  store: MongoStore.create({ mongoUrl: process.env.CONNECTION }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});

app.use(sessionOptions);
app.use(flashMessages());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./public'));
app.use(helmet()); // Utilização do Helmet
app.use(csrf()); // Utilização do CSRF no nosso express -> Incluir antes das rotas e middlewares
app.use(middlewareGlobal);
app.use(checkCsrfError); // Utilizando middleware que verifica se existe o erro CSRF
app.use(csrfMiddleware); // Utilizando middleware que cria o CSRF token
app.use(routes);

app.set('views', './src/views');
app.set('view engine', 'ejs');

app.on('DBConnected', () => {
  app.listen(3000, () => { 
    console.log('Servidor executando, acessar via http://localhost:3000');
  });
});
