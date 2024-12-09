export function validateEmail(email) {
    const atIndex = email.indexOf('@');
    const emailPart1 = email.substring(0, atIndex);
    const emailPart2 = email.substring(atIndex + 1);
    const emailRegex = /^\w+@\w+\.\w+$/;

    if (!emailRegex.test(email)) {
        return [false, 'incorrect email'];
    } else if (emailPart1.length > 64 || emailPart2.length > 255) {
        return [false, 'email is too long'];
    }

    return [true, ''];
}

export function validateLogin(login) {
    const loginRegex = /^\w+$/;

    if (!loginRegex.test(login)) {
        return [false, 'incorrect login'];
    } else if (login.length < 4) {
        return [false, 'login is too short'];
    } else if (login.length > 32) {
        return [false, 'login is too long'];
    }

    return [true, ''];
}

export function validatePassword(password) {
    if (password.length < 4) {
        return [false, 'password is too short'];
    } else if (password.length > 32) {
        return [false, 'password is too long'];
    }

    return [true, ''];
}