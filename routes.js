const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const contatoController = require('./src/controllers/contatoController');

// Rotas da home
route.get('/', homeController.home);
route.post('/', homeController.trataPost);

// Rotas de contato
route.get('/contato', contatoController.main);

module.exports = route;