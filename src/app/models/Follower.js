const { Model, DataTypes } = require('sequelize');

class Follower extends Model {
  static init (sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      follower_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      following_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      }
    }, {
      sequelize,
      freezeTableName: true,
      tableName: 'followers',
      updatedAt: false,
      createdAt: true,
    })
  }

  static associate (models) {
    this.belongsTo(models.User, { foreignKey: 'follower_id', as: 'follower' })
    this.belongsTo(models.User, { foreignKey: 'following_id', as: 'following' })
  }
}

module.exports = Follower;