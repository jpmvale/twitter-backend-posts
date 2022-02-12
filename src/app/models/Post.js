const { Model, DataTypes } = require('sequelize');

class Post extends Model {
  static init (sequelize) {
    super.init({
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING(process.env.MAXIMUM_POST_SIZE),
        allowNull: true,
      },
      post_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      original_post_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    }, {
      sequelize,
      freezeTableName: true,
      tableName: 'posts',
      createdAt: true,
      updatedAt: false,
    })
  }

  static associate (models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    this.belongsTo(models.PostType, { foreignKey: 'post_type_id', as: 'post_type' })
  }
}

module.exports = Post;