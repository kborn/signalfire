module.exports = async () => {
  await global.__INTG_DB_CONTAINER__.stop();
  console.log('Database container stopped.');
};
