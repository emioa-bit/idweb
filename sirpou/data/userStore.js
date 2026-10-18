
const fs = require('fs/promises');
const path = require('path');

const USERS_FILE = path.join(__dirname, 'users.json');

async function readUsers() {
    const content = await fs.readFile(USERS_FILE, 'utf8');
    const users = JSON.parse(content);

    if (!Array.isArray(users)) {
        throw new Error('El archivo de usuarios debe contener un arreglo');
    }

    return users;
}

async function writeUsers(users) {
    if (!Array.isArray(users)) {
        throw new TypeError('Los usuarios deben almacenarse en un arreglo');
    }

    const content = JSON.stringify(users, null, 2) + '\n';

    await fs.writeFile(USERS_FILE, content, 'utf8');
}

module.exports = {
    readUsers,
    writeUsers
};
