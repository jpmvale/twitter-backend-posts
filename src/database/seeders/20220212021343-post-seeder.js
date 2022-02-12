const posts = [
  { user_id: 1, message: 'Hi im using Posterr!', post_type_id: 1 },
  { user_id: 2, post_type_id: 2, original_post_id: 1 },
  { user_id: 3, message: 'Im reposting this fun post!', post_type_id: 1, original_post_id: 1 },
]

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('posts', posts, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('posts', null, {})
  }
}
