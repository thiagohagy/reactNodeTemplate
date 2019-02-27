/* Model*/
const Model = require('./model');
const Acl = require('./UserAcl');
const SystemModules = require('./../systemModules/Model');
const bcrypt = require('bcrypt-nodejs');
const to = require('../../core/to');
const aclValidator = require('./../../core/aclValidator');

/* Routes*/
exports.index = async (req, res) => {

  const filtro = {};

  let access = await aclValidator.verify(req.decoded.aclModules, 'users');

  if (access == 2) {
    filtro.client = req.decoded.client;
  } else if (access == 3 || !access) {
    filtro._id = req.decoded._id;
  }

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

exports.getAcl = async (req, res) => {
  const data = await Acl.findOne({ user: req.params.id }).populate('user');
  const systemModules = await SystemModules.find();

  const ret = {
    acl: data,
    systemModules: systemModules,
  };

  res.json(ret);
};

exports.new = async (req, res) => {
  let access = await aclValidator.verify(req.decoded.aclModules, 'users');
  req.body.createdBy = req.decoded._id;
  var model = new Model(req.body);

  if (access > 2) {
    res.json({ succsess: false, data, err: 'OPS!!! Você nao pode cadastrar usuários', form: req.body });
  } else {
    if (access > 1) {
      model.client = req.decoded._id;
    }

    const [err, data] = await to(model.save());

    if (!err && data) {
      //criar acl do usuario
      const acl = new Acl();
      acl.user = data._id;

      // popular acl com modulos default
      const systemModules = await SystemModules.find({ default: true });
      acl.modules = [];
      let level = 3;
      if(data.role == 'root') {
        level = 1;
      } else if(data.role == 'admin') {
        level = 2;
      }

      for (let ism = 0; ism < systemModules.length; ism++) {
        const sm = systemModules[ism];
        acl.modules.push({
          module: sm.module,
          name: sm.name,
          level: level,
        })
      }

      await acl.save();

      res.json({ success: true, data, err, form: req.body });
    } else {
      if(err.code == 11000) {
        res.json({ succsess: false, data, err: 'OPS!!! Pick another login, this one already exists', form: req.body });
      } else {
        res.json({ succsess: false, data, err: 'OPS!!! Some error has ocurred', form: req.body });
      }
    }

  }

};

exports.delete = async (req, res) => {

  const model = await Model.findOne({ _id: req.params.id });
  let access = await aclValidator.verify(req.decoded.aclModules, 'users');

  if(access > 2 || (access == 2 && model.client != req.decoded.client)) {
    res.json({ success: false, err: 'Você nao pode deletar esse user'});
  } else {
    if (model) {
      model.active = false;
      await model.save();
      res.json({ success: true });
    } else {
      res.json({ success: false, err: 'Ocorreu algum erro'});
    }
  }
};

exports.edit = async (req, res) => {
  const model = await Model.findOne({ _id: req.body._id });

  if (req.body.password && req.body.password !== '') {
    model.password = req.body.password;
  }

  model.client = req.body.client;
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

exports.updateAcl = async (req, res) => {
  let access = await aclValidator.verify(req.decoded.aclModules, 'users');

  const model = await Acl.findOne({ _id: req.body._id }).populate('user');

  if (access > 2 || (access == 2 && req.decoded.client != model.user.client)) {
    res.json({ success: false, err: 'Você nao pode editar essa ACL'});
  } else {
    model.modules = req.body.modules;
    const [err, data] = await to(model.save());
    if (!err && data) {
      res.json({ success: true, data, err, form: req.body });
    } else {
      res.json({ success: false, data, err, form: req.body });
    }
  }
};


