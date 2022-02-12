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
        type: DataTypes.STRING,
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
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      }
    }, {
      sequelize,
      freezeTableName: true,
      tableName: 'posts',
      createdAt: 'created_at',
      updatedAt: false,
    })
  }

  static associate (models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' })
    this.belongsTo(models.PostType, { foreignKey: 'post_type_id', as: 'post_type' })
  }
}

module.exports = Post;