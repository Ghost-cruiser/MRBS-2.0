"use strict";
/// Room représente les différentes salles louables.
/// Il existe 3 différents prix en fonction du type d'utilisateur
/// faisant la demande de location (particulier, club, ligue).

module.exports = function (sequelize, DataTypes) {
    var Room = sequelize.define("Room", {
        
        roomName: DataTypes.STRING,
        roomDescription: DataTypes.STRING,
        capacity: DataTypes.INTEGER,
        priceForALeague: DataTypes.DECIMAL,
        priceForAClub: DataTypes.DECIMAL,
        priceForAPerson: DataTypes.DECIMAL

    }, 
        {
        classMethods: {
            associate: function (models) {
                Room.belongsTo(models.Area, {
                    onDelete: "CASCADE",
                    foreignKey: {
                        allowNull: false
                    }
                });
                
                Room.hasMany(models.Entry);
            }
        }
    });
        
    return Room;
};