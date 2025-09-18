const express = require('express');
const connection = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Middleware para verificar se é cliente
const authenticateClient = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acesso necessário' });
  }

  const jwt = require('jsonwebtoken');
  require('dotenv').config({ path: './config.env' });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido ou expirado' });
    }
    
    if (user.type !== 'student') {
      return res.status(403).json({ message: 'Acesso negado - apenas para clientes' });
    }
    
    req.user = user;
    next();
  });
};

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticateClient);

// Obter dados do cliente
router.get('/profile', async (req, res) => {
  try {
    const studentId = req.user.id;

    const [studentRows] = await connection.promise().execute(
      'SELECT id, name, cpf, birth_date, phone, email, address, start_date, weight, height, chest_circumference, waist_circumference, hip_circumference, arm_circumference, thigh_circumference FROM students WHERE id = ?',
      [studentId]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({ message: 'Cliente não encontrado' });
    }

    res.json(studentRows[0]);

  } catch (error) {
    console.error('Erro ao buscar perfil do cliente:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter situação financeira
router.get('/payments', async (req, res) => {
  try {
    const studentId = req.user.id;

    const [rows] = await connection.promise().execute(`
      SELECT 
        p.*,
        CASE 
          WHEN p.status = 'paid' THEN 'Em Dia'
          WHEN p.status = 'pending' AND p.due_date >= CURDATE() THEN 'Pendente'
          WHEN p.status = 'pending' AND p.due_date < CURDATE() THEN 'Vencido'
          WHEN p.status = 'overdue' THEN 'Atrasado'
          ELSE 'Pendente'
        END as status_text
      FROM payments p
      WHERE p.student_id = ?
      ORDER BY p.payment_date DESC
      LIMIT 10
    `, [studentId]);

    res.json(rows);

  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter treino atual
router.get('/workout', async (req, res) => {
  try {
    const studentId = req.user.id;

    const [workoutRows] = await connection.promise().execute(
      'SELECT * FROM workouts WHERE student_id = ?',
      [studentId]
    );

    if (workoutRows.length === 0) {
      return res.json({ workout: null, exercises: [] });
    }

    const workout = workoutRows[0];

    const [exerciseRows] = await connection.promise().execute(
      'SELECT * FROM exercises WHERE workout_id = ? ORDER BY order_index, id',
      [workout.id]
    );

    res.json({
      workout,
      exercises: exerciseRows
    });

  } catch (error) {
    console.error('Erro ao buscar treino:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter histórico de medidas
router.get('/measurements', async (req, res) => {
  try {
    const studentId = req.user.id;

    const [rows] = await connection.promise().execute(`
      SELECT * FROM body_measurements 
      WHERE student_id = ? 
      ORDER BY measurement_date DESC
    `, [studentId]);

    res.json(rows);

  } catch (error) {
    console.error('Erro ao buscar medidas:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Obter estatísticas de evolução
router.get('/progress', async (req, res) => {
  try {
    const studentId = req.user.id;

    // Buscar primeira e última medição
    const [measurements] = await connection.promise().execute(`
      SELECT 
        (SELECT weight FROM body_measurements WHERE student_id = ? ORDER BY measurement_date ASC LIMIT 1) as initial_weight,
        (SELECT weight FROM body_measurements WHERE student_id = ? ORDER BY measurement_date DESC LIMIT 1) as current_weight,
        (SELECT chest_circumference FROM body_measurements WHERE student_id = ? ORDER BY measurement_date ASC LIMIT 1) as initial_chest,
        (SELECT chest_circumference FROM body_measurements WHERE student_id = ? ORDER BY measurement_date DESC LIMIT 1) as current_chest,
        (SELECT waist_circumference FROM body_measurements WHERE student_id = ? ORDER BY measurement_date ASC LIMIT 1) as initial_waist,
        (SELECT waist_circumference FROM body_measurements WHERE student_id = ? ORDER BY measurement_date DESC LIMIT 1) as current_waist,
        (SELECT arm_circumference FROM body_measurements WHERE student_id = ? ORDER BY measurement_date ASC LIMIT 1) as initial_arm,
        (SELECT arm_circumference FROM body_measurements WHERE student_id = ? ORDER BY measurement_date DESC LIMIT 1) as current_arm
    `, [studentId, studentId, studentId, studentId, studentId, studentId, studentId, studentId]);

    // Buscar dados para gráfico de evolução do peso
    const [weightHistory] = await connection.promise().execute(`
      SELECT measurement_date, weight 
      FROM body_measurements 
      WHERE student_id = ? AND weight IS NOT NULL
      ORDER BY measurement_date ASC
    `, [studentId]);

    res.json({
      measurements: measurements[0],
      weightHistory
    });

  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
