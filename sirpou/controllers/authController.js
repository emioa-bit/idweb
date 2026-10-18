
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');
const { readUsers, writeUsers } = require('../data/userStore');

async function register(req, res, next) {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== 'string' ||
            typeof password !== 'string' ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                message: 'El correo y la contraseña son obligatorios'
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        if (password.length < 8) {
            return res.status(400).json({
                message: 'La contraseña debe tener al menos 8 caracteres'
            });
        }

        const users = await readUsers();

        const existingUser = users.find(
            user => user.email === normalizedEmail
        );

        if (existingUser) {
            return res.status(409).json({
                message: 'Ya existe una cuenta con ese correo'
            });
        }

        const passwordHash = await bcrypt.hash(password, 12);

        const newUser = {
            id: randomUUID(),
            email: normalizedEmail,
            passwordHash,
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        await writeUsers(users);

        return res.status(201).json({
            message: 'Usuario registrado correctamente',
            user: {
                id: newUser.id,
                email: newUser.email,
                createdAt: newUser.createdAt
            }
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    register
};
