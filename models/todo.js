'use strict';
module.exports = (sequelize, DataTypes) => {
    const Todo = sequelize.define("todo", {
        text: {
            type: DataTypes.STRING,
            allowNull: false
        },
        completed: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

    return Todo;
};
