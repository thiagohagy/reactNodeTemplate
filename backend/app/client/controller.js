/* Model*/
const Model = require('./model');
const bcrypt = require('bcrypt-nodejs');
const to = require('../../core/to');
const aclValidator = require('./../../core/aclValidator');

/* Routes*/
const thisModule = 'clients';

exports.index = async (req, res) => {

  const access = await aclValidator.verify(req.decoded.aclModules, thisModule);

  if(access == 0) {
    res.json({ total: 0 , data: [] });
  } else {

    const filtro = {};
    if(req.body.busca) filtro.name= { $regex: req.body.busca };

    if(access > 1) {
      filtro._id = req.decoded.client;
    }

    let query = Model.find(filtro);
    if (!req.body.all) {
      query.skip(req.body.skip || 0);
      query.limit(req.body.limit || 5);
    }

    const [err, data] = await to(query.exec());

    const total = await Model.find(filtro).count();

    res.json({ total, data });
  }
};

exports.get = async (req, res) => {
  const data = await Model.findOne({ _id: req.params.id });
  res.json(data);
};

exports.new = async (req, res) => {
  req.body.createdBy = req.decoded._id;
  var model = new Model(req.body);
  const [err, data] = await to(model.save());

  if (!err && data) {
    res.json({ success: true, data, err, form: req.body });
  } else {
    res.json({ succsess: false, data, err: 'OPS!!! Ocorreu algum erro', form: req.body });
  }
};

exports.delete = async (req, res) => {

  const model = await Model.remove({ _id: req.params.id });

  if (model) {
    res.json({ success: true });
  } else {
    res.json({ success: false, err: 'OPS!!! Ocorreu algum erro'});
  }
};

exports.edit = async (req, res) => {

  const access = await aclValidator.verify(req.decoded.aclModules, thisModule);

  if((access != 1 && req.decoded.client != req.body._id || !access)) {
    res.json({ success: false, err: 'Você nao tem acesso a esta função' });
  } else {

    const model = await Model.findOne({ _id: req.body._id });

    model.name = req.body.name;
    const [err, data] = await to(model.save());

    if (!err && data) {
      res.json({ success: true, data, err, form: req.body });
    } else {
      res.json({ success: false, data, err, form: req.body });
    }
  }
};
