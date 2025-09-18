const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const connection = require('../database/connection');
require('dotenv').config({ path: './config.env' });

const router = express.Router();

// Login do cliente
router.post('/login', [
  body('login').notEmpty().withMessage('CPF ou e-mail é obrigatório'),
  body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { login, password } = req.body;

    // Buscar cliente por CPF ou e-mail
    const [rows] = await connection.promise().execute(
      'SELECT * FROM students WHERE (cpf = ? OR email = ?) AND password IS NOT NULL',
      [login, login]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const student = rows[0];

    // Verificar senha
    const isValidPassword = await bcrypt.compare(password, student.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: student.id, 
        name: student.name, 
        type: 'student',
        cpf: student.cpf 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login realizado com sucesso',
      token,
      student: {
        id: student.id,
        name: student.name,
        cpf: student.cpf,
        email: student.email
      }
    });

  } catch (error) {
    console.error('Erro no login do cliente:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Verificar token do cliente
router.get('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    
    if (user.type !== 'student') {
      return res.status(403).json({ message: 'Token inválido para cliente' });
    }
    
    res.json({ valid: true, user });
  });
});

module.exports = router;
