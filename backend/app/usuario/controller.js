/* Model*/
const Model = require('./model');
const Acl = require('./UserAcl');
const bcrypt = require('bcrypt-nodejs');
const to = require('../../core/to');

/* Routes*/
exports.index = async (req, res) => {

  const filtro = {};
  if(req.body.busca) filtro.login= { $regex: req.body.busca };
  filtro.active = true;

  const [err, data] = await to(
    Model.find(filtro)
      .populate('client')
      .skip(req.body.skip || 0)
      .limit(req.body.limit || 5)
  );

  const total = await Model.find(filtro).count();

  res.json({ total, data });
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
    //criar acl do usuario
    const acl = new Acl();
    acl.user = data._id;

    await acl.save();

    res.json({ success: true, data, err, form: req.body });
  } else {
    if(err.code == 11000) {
      res.json({ succsess: false, data, err: 'OPS!!! Pick another login, this one already exists', form: req.body });
    } else {
      res.json({ succsess: false, data, err: 'OPS!!! Some error has ocurred', form: req.body });
    }
  }
};

exports.delete = async (req, res) => {

  const model = await Model.findOne({ _id: req.params.id });

  if (model) {
    model.active = false;
    await model.save();
    res.json({ success: true });
  } else {
    res.json({ success: false, err: 'An error has occured'});
  }
};

exports.edit = async (req, res) => {
  const model = await Model.findOne({ _id: req.body._id });

  if (req.body.password && req.body.password !== '') {
    model.password = req.body.password;
  }

  model.login = req.body.client;
  model.login = req.body.login;
  model.nome = req.body.nome;
  model.email = req.body.email;
  model.name = req.body.name;
  model.role = req.body.role;
  model.lastUpdateBy = req.decoded._id;
  model.avatar = req.body.avatar;

  const [err, data] = await to(model.save());

  if (!err && data) {
    res.json({ success: true, data, err, form: req.body });
  } else {
    res.json({ success: false, data, err, form: req.body });
  }
};
