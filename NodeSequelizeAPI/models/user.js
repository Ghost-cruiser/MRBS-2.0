﻿"use strict";

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        username: DataTypes.STRING,
        password: DataTypes.STRING,
        levelRights: DataTypes.INTEGER
    });
    
    return User;
};