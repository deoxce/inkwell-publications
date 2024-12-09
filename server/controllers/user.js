import config from '../config/config.js';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import { validateEmail, validateLogin, validatePassword } from '../utils/validation.js';

const connection = await mysql.createConnection({
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.name
});

export async function signUp(request, response) {
    const email = request.body.email.toLowerCase();
    const login = request.body.login.toLowerCase();
    const password = request.body.password;

    let [isEmailCorrect, emailMessage] = validateEmail(email);
    let [isLoginCorrect, loginMessage] = validateLogin(login);
    let [isPasswordCorrect, passwordMessage] = validatePassword(password);

    try {
        const [result, fields] = await connection.query(`SELECT * FROM account`);

        result.forEach(user => {
            if (user.email === email) {
                emailMessage = 'this email already exists';
                isEmailCorrect = false;
            }
        });

        result.forEach(user => {
            if (user.login === login) {
                loginMessage = 'this login already exists';
                isLoginCorrect = false;
            }
        });
    } catch (error) {
        console.log('select from account error:', error);
    }

    if (isEmailCorrect && isLoginCorrect && isPasswordCorrect) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        try {
            const [result, fields] = await connection.query(`INSERT INTO account(email, login, password) VALUES('${email}', '${login}', '${hashPassword}')`);
            const user_id = result.insertId;

            console.log(`Зарегистрировался новый пользователь! id: ${user_id}, email ${email}, login: ${login}`);

            return response.status(201).send(`successful sign up, account id: ${user_id}`);
        } catch (error) {
            console.log('account is not inserted, error:', error);
        }
    }

    return response.status(409).json({
        emailMessage: emailMessage,
        loginMessage: loginMessage,
        passwordMessage: passwordMessage,
    });
}

export async function signIn(request, response) {
    const login = request.body.login.toLowerCase();
    const password = request.body.password;

    const userData = {
        user_id: null,
        user_type_id: null
    };

    let [isLoginCorrect, loginMessage] = validateLogin(login);
    let [isPasswordCorrect, passwordMessage] = validatePassword(password);

    if (!isLoginCorrect || !isPasswordCorrect) return response.status(409).json({
        loginMessage: loginMessage,
        passwordMessage: passwordMessage,
    });

    try {
        const [result, fields] = await connection.query(`SELECT * FROM account WHERE login='${login}' OR email='${login}'`);

        if (result.length === 0) {
            return response.status(409).json({
                loginMessage: 'this login does not exist',
                passwordMessage: passwordMessage,
            });
        }

        const validPass = await bcrypt.compare(password, result[0].password);

        if (!validPass) {
            return response.status(409).json({
                loginMessage: loginMessage,
                passwordMessage: 'password is wrong',
            });
        }

        userData.user_id = result[0].account_id;
    } catch (error) {
        console.log('select from account error:', error);
    }

    try {
        const [result, fields] = await connection.query(`SELECT * FROM staff WHERE account_id='${userData.user_id}'`);

        if (result.length === 0) {
            userData.user_type_id = 0;
        } else {
            userData.user_type_id = 1;
        }
    } catch (error) {
        console.log('select from staff error:', error);
    }

    let payload = { user_id: userData.user_id, user_type_id: userData.user_type_id };
    const token = jwt.sign(payload, config.jwt_secret);

    console.log(`Пользователь вошёл в систему. id: ${userData.user_id}, login: ${login}`);

    return response.status(200).header('auth-token', token).send({ "token": token });
}

export async function getUserData(request, response) {
    response.status(200).json({
        user_id: request.user.user_id,
        user_type_id: request.user.user_type_id
    });
}