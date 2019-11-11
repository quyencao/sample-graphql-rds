const models = require("./models");

const resolver = {
    Query: {
        getUsers: (_, args) => {
            return models.User.findAll().then(users => {
                return users.map(user => user.dataValues);
            }).catch(err => {
                throw err;
            })
        }
    },
    Mutation: {
        register: (_, args) => {
            return models.User.create({
                email: args.email,
                password: args.password
            }).then(user => {
                return user.dataValues;
            }).catch(err => {
                throw err;
            })
        }
    }
}

module.exports = resolver;