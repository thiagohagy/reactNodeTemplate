const express = require('express');
const rotas = express.Router();

const controller = require('./controller');

rotas.post('/list', controller.index);
rotas.get('/:id', controller.get);
rotas.post('/', controller.new);
rotas.put('/', controller.edit);
rotas.delete('/:id', controller.delete);

//acl
rotas.get('/acl/:id', controller.getAcl);
rotas.put('/updateAcl/', controller.updateAcl);

module.exports = rotas;
