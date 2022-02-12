const { Model, DataTypes } = require('sequelize');

class User extends Model {
  static init (sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(process.env.MAXIMUM_USERNAME_SIZE),
        allowNull: false,
      },
    }, {
      sequelize,
      freezeTableName: true,
      tableName: 'users',
      createdAt: true,
      updatedAt: false,
    })
  }

  static associate (models) {
    this.hasMany(models.Post, { foreignKey: 'user_id', as: 'user' })
    this.hasMany(models.Follower, { foreignKey: 'follower_id', as: 'follower' })
    this.hasMany(models.Follower, { foreignKey: 'following_id', as: 'following' })
  }
}

module.exports = User;