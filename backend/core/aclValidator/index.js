

exports.verify = function (aclModules, module) {
    return new Promise(async (resolve) => {
        let access =  0; // começa sem permissao

        try {
            for (let index = 0; index < aclModules.length; index++) {
                const mod = aclModules[index];
                if (mod.module === module) {
                    access = mod.level;
                }
            }

           resolve(access);

        } catch (error) {
            console.error(error);
            console.error(aclModules);
            console.error(module);
            resolve(0);
        }
    });

};
