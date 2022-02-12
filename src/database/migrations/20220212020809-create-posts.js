'use strict';

module.exports = {
  async up (queryInterface, DataTypes) {
    return queryInterface.createTable('posts', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' },
        allowNull: false,
      },
      message: {
        type: DataTypes.STRING(process.env.MAXIMUM_POST_SIZE),
        allowNull: true,
      },
      post_type_id: {
        type: DataTypes.INTEGER,
        references: { model: 'post_types', key: 'id' },
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
    })
  },

  async down (queryInterface) {
    return queryInterface.dropTable('posts')
  }
}
