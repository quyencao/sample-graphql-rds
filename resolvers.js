 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AuthenticationError, UserInputError } = require("apollo-server-lambda");
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
            return models.User.findOne({ where: { email: args.email } })
            .then(user => {
                if (user) {
                    throw new UserInputError("Email is already taken");
                }

                return bcrypt.genSalt(10);
            })
            .then(salt => {
                return bcrypt.hash(args.password, salt);
            })
            .then(hash => {
                return models.User.create({
                    email: args.email,
                    password: hash
                });
            })
            .then(user => user.dataValues)
            .catch(err => {
                throw err;
            })
        },
        login: (_, args) => {
            return models.User.findOne({ where: { email: args.email } })
            .then(user => {
                if (!user) {
                    throw new AuthenticationError(
                        'No user found with this login credentials.',
                    );
                }

                return bcrypt.compare(args.password, user.dataValues.password);
            })
            .then(result => {
                if (!result) {
                    throw new AuthenticationError(
                        'No user found with this login credentials.',
                    );
                }

                const token = jwt.sign({ email: args.email }, "secretkey", { algorithm: "HS256", expiresIn: "1h" });

                return { token };
            })
            .catch(err => {
                throw err;
            })
        }
    }
}

module.exports = resolver;