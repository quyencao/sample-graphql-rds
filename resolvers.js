const models = require("./models");

const resolver = {
    Query: {
        getTodos: (_, args) => {
            return models.todo.findAll().then(todos => {
                return todos.map(todo => todo.dataValues);
            }).catch(err => {
                throw err;
            })
        }
    },
    Mutation: {
        createTodo: (_, args) => {
            return models.todo.create({
                text: args.text,
                completed: false
            }).then(todo => {
                return todo.dataValues;
            }).catch(err => {
                throw err;
            })
        }
    }
}

module.exports = resolver;