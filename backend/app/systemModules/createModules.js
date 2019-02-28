const Model = require('./Model');
const config = require('../../config');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.database, {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useMongoClient: true,
});

(async function start(){
    console.log('cadastar modulos default no sistema');

    let modules = [
        {
            name: 'Usuários',
            module: 'users',
            justRoot: false,
            default: true,
        },
        {
            name: 'Clientes',
            module: 'clients',
            justRoot: true,
            default: false,
        },
        {
            name: 'Dashboard',
            module: 'dashboard',
            justRoot: false,
            default: true,
        }
    ];

    for (let i = 0; i < modules.length; i++) {
        const el = modules[i];

        let modCad = await Model.findOne({module: el.module});

        if (!modCad) {
            let newMod = Model(el);
            let cad = await newMod.save();
            console.log(cad);
        }
    }

})();
