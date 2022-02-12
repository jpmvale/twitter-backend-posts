const followers = [
  { follower_id: 1, following_id: 2 },
  { follower_id: 1, following_id: 3 },
  { follower_id: 2, following_id: 3 },
  { follower_id: 3, following_id: 1 },
]

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('followers', followers, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('followers', null, {})
  }
}
