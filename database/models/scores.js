'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Scores extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Scores.belongsTo(models.Companies, {
        foreignKey: 'company_id',
        onDelete: 'CASCADE',
    });

    }
  }
  Scores.init({
    company_id: DataTypes.STRING,
    score: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Scores',
  });
  return Scores;
};