module.exports = {
  env: process.env.NODE_ENV,
  now: new Date(),
  prod: process.env.NODE_ENV == 'production',
}
