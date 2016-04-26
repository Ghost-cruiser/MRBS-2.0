"use strict";

module.exports = function (sequelize, DataTypes) {
    var Area = sequelize.define("Area", {
        areaName: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                Area.hasMany(models.Room)
            }
        }
    });
    
    return Area;
};