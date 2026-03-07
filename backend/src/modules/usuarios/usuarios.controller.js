const pool = require('../../config/database');
const bcrypt = require('bcryptjs');

const crearUsuario = async (req, res) => {
    try {
        const { nombre, apellido, email, password, rol } = req.body;

        if (!nombre || !apellido || !email || !password || !rol) {
            return res.status(400).json({ mensaje: 'Todos los campos son requeridos' });
        }

        const existe = await pool.query(
            'SELECT id FROM usuarios WHERE email = $1',
            [email]
        );

        if (existe.rows.length > 0) {
            return res.status(400).json({ mensaje: 'El email ya está registrado' });
        }

        const passwordEncriptada = await bcrypt.hash(password, 12);

        const resultado = await pool.query(
            `INSERT INTO usuarios (nombre, apellido, email, password, rol)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, nombre, apellido, email, rol`,
            [nombre, apellido, email, passwordEncriptada, rol]
        );

        res.status(201).json({
            mensaje: 'Usuario creado exitosamente',
            usuario: resultado.rows[0]
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const obtenerUsuarios = async (req, res) => {
    try {
        const resultado = await pool.query(
            `SELECT id, nombre, apellido, email, rol, activo, created_at 
             FROM usuarios 
             ORDER BY created_at DESC`
        );

        res.json(resultado.rows);

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

const desactivarUsuario = async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            `UPDATE usuarios SET activo = false 
             WHERE id = $1 
             RETURNING id, nombre, apellido, email, rol`,
            [id]
        );

        if (resultado.rows.length === 0) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json({
            mensaje: 'Usuario desactivado exitosamente',
            usuario: resultado.rows[0]
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error en el servidor', error: error.message });
    }
};

module.exports = { crearUsuario, obtenerUsuarios, desactivarUsuario };