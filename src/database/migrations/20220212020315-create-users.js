module.exports = {
  async up (queryInterface, DataTypes) {
    return queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(process.env.MAXIMUM_USER_NAME_SIZE),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: true,
      }
    })
  },

  async down (queryInterface) {
    return queryInterface.dropTable('users')
  }
}
