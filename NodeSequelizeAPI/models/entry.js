"use strict";

module.exports = function (sequelize, DataTypes) {

    var Entry = sequelize.define("Entry", {

        title: DataTypes.STRING,
        description: DataTypes.STRING,

        dateStart: DataTypes.DATE,
        dateEnd : DataTypes.DATE,

        periodicity : DataTypes.INTEGER,

        typeOfLocation : DataTypes.INTEGER,

        costReduction : DataTypes.DECIMAL,
        reasonForCostReduction : DataTypes.STRING

    }, {
        classMethods: {
            associate: function (models) {
                Entry.belongsTo(models.Room, {
                    foreignKey: {
                        allowNull: false
                    }
                });
               
                Entry.belongsToMany(models.Invoice, { through: models.EntriesInvoices });
            }
        }
    });
    
    return Entry;
};