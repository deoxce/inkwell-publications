import config from '../config/config.js';
import jwt from 'jsonwebtoken';

export function verifyUserToken(request, response, next) {
    let token = request.headers.authorization;
    if (!token) return response.status(401).send("Unauthorized request");

    try {
        token = token.split(' ')[1];

        if (token === 'null' || !token) return response.status(401).send('Unauthorized request');

        let verifiedUser = jwt.verify(token, config.jwt_secret);
        if (!verifiedUser) return response.status(401).send('Unauthorized request')

        request.user = verifiedUser; // user_id & user_type_id
        next();
    } catch (error) {
        response.status(400).send("Invalid Token");
    }
}