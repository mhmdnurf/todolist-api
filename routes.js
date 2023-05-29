const {
    usersHandler, registerHandler, updateHandler, loginHandler
} = require('./handler')

const routes = [
    {
        method: 'GET',
        path: '/',
        handler: usersHandler,
    },
    {
        method: 'POST',
        path: '/register',
        handler: registerHandler,
    },
    {
        method: 'POST',
        path: '/login',
        handler: loginHandler,
    },
]

module.exports = routes