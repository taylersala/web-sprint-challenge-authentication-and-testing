const db = require('../../data/dbConfig.js')

function findBy(filter) {
    return db('users').where(filter);
  }
  
  async function add(user) {
    const [id] = await db('users').insert(user, 'id');
    return findBy({ id }).first();
  }
  
  module.exports = {
    findBy,
    add,
  };