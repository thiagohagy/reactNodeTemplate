const Model = require('./../model');
const Acl = require('./../UserAcl');
const SystemModules = require('./../../systemModules/Model');
const config = require('../../../config');
const mongoose = require('mongoose');
const to = require('./../../../core/to');

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useMongoClient: true,
});

(async function start(){
    console.log('cadastrar user root');

    let rootExists = await Model.findOne({login: 'root'});
    if( rootExists) {
        console.log('user root ja existe');
    } else {
        var model = new Model({
            login: 'root',
            password: '123',
            name: 'Root',
            role: 'root',
        });

        const [err, data] = await to(model.save());

        if (!err && data) {
            //criar acl do usuario
            const acl = new Acl();
            acl.user = data._id;

            // popular acl com modulos default
            const systemModules = await SystemModules.find();
            acl.modules = [];
            let level = 1;

            for (let ism = 0; ism < systemModules.length; ism++) {
                const sm = systemModules[ism];
                acl.modules.push({
                    module: sm.module,
                    name: sm.name,
                    level: level,
                })
            }

            await acl.save();

            console.log('user root cadastrado com todos os modulos disponiveis')
        } else {
            console.log('ocorreu um erro ao cadastrar o root');
        }
    }


})();
