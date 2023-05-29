const Hapi = require('@hapi/hapi');
const routes = require('./routes');
const sequelize = require('./db.config');

const port = 3001;

const init = async () => {
    const server = Hapi.server({
        port: port,
        host: 'localhost',
    });

    server.route(routes);

    await server.start();
    console.log(`Running server on port ${server.info.uri}`);
    sequelize.sync().then(() => console.log('Program siap digunakan!'));
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
