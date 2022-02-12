'use strict';

module.exports = {
  async up (queryInterface, DataTypes) {
    return queryInterface.createTable('followers', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      follower_id: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' },
        allowNull: false,
      },
      following_id: {
        type: DataTypes.INTEGER,
        references: { model: 'users', key: 'id' },
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      }
    })
  },

  async down (queryInterface) {
    return queryInterface.dropTable('followers')
  }
}
