 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AuthenticationError, UserInputError } = require("apollo-server-lambda");
const models = require("./models");

function verifyJWTToken(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, "secretkey", (err, decodedToken) => {
        if (err || !decodedToken) {
          return reject(err);
        }
  
        resolve(decodedToken);
      });
    });
  }

const resolver = {
    Query: {
        getCurrentUser: (_, args) => {
            const token = headers.token || '';

            return verifyJWTToken(token)
                .then(decodedToken => {
                    return models.User.findOne({ where: { email: decodedToken.email } })
                })
                .then(user => {
                    if (!user) {
                        throw new AuthenticationError(
                            'Your session expired. Login again.',
                        );
                    }

                    return user.dataValues;
                })
                .catch(err => {
                    throw new AuthenticationError(
                        'Your session expired. Login again.',
                    );
                });
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