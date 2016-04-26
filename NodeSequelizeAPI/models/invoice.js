"use strict";

module.exports = function (sequelize, DataTypes) {
    var Invoice = sequelize.define("Invoice", {

        totalHT: DataTypes.DECIMAL,

        month : DataTypes.INTEGER,
        year : DataTypes.INTEGER,

        appliedReduction : DataTypes.INTEGER

    }, {
        classMethods: {
            associate: function (models) {
                Invoice.belongsToMany(models.Entry, { through: models.EntriesInvoices });
            }
        }
    });
    
    return Invoice;
};