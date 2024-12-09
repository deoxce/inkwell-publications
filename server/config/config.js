import * as dotenv from 'dotenv';

dotenv.config();

const config = {
    port: process.env.PORT,
    jwt_secret: process.env.JWT_SECRET,
    db: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    }
};

export default config;