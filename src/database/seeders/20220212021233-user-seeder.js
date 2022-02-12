'use strict'

const sampleUsers = [
  { name: 'John' },
  { name: 'Peter' },
  { name: 'Rebecca' },
  { name: 'Ethan' },
  { name: 'Chris' },
  { name: 'Brad' },
  { name: 'Anthony' },
  { name: 'Marco' }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', sampleUsers, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {})
  }
}