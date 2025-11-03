module.exports = {
    development: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'medtechai_dev',
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'password',
        dialect: 'postgres'
    },
    production: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
};