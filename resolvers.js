const models = require("./models");

const resolver = {
    Query: {
        getTodos: (_, args) => {
            return models.Todo.findAll().then(todos => {
                return todos;
            }).catch(err => {
                throw err;
            })
        }
    },
    Mutation: {
        createTodo: (_, args) => {
            return models.Todo.create({
                text: args.text,
                completed: false
            }).then(todo => {
                return todo;
            }).catch(err => {
                throw err;
            })
        }
    }
}

module.exports = resolver;