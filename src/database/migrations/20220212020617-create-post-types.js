'use strict';

const postTypes = [
  { name: 'Original' },
  { name: 'Repost' },
  { name: 'Quote-post' },
]

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.createTable('post_types', {
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
    })
    return queryInterface.bulkInsert('post_types', postTypes, {})
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.dropTable('post_types')
  }
}
