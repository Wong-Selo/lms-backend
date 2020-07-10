module.exports = (app) => {
  app.get('/users', (req, res) => res.send('Hello World!'))
}