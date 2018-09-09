const user = require('./user')
const task = require('./task')

module.exports = (router) => {
    user(router);
    task(router);
}
