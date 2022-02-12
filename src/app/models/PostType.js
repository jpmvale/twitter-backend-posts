const { Model, DataTypes } = require('sequelize');

class PostType extends Model {
  static init (sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize,
      freezeTableName: true,
      tableName: 'post_types',
      updatedAt: false,
      createdAt: false,
    })
  }

  static associate (models) {
    this.hasOne(models.Post, { foreignKey: 'post_type_id', as: 'post_type' })
  }
}

module.exports = PostType;