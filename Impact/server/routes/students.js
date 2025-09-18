const express = require('express');
const { body, validationResult } = require('express-validator');
const connection = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticateToken);

// Listar todos os alunos com informações de pagamento
router.get('/', async (req, res) => {
  try {
    const [rows] = await connection.promise().execute(`
      SELECT 
        s.*,
        p.payment_date as last_payment_date,
        p.status as payment_status,
        p.due_date as next_due_date,
        w.name as workout_name,
        w.type as workout_type,
        w.frequency as workout_frequency
      FROM students s
      LEFT JOIN (
        SELECT student_id, payment_date, status, due_date,
               ROW_NUMBER() OVER (PARTITION BY student_id ORDER BY payment_date DESC) as rn
        FROM payments
      ) p ON s.id = p.student_id AND p.rn = 1
      LEFT JOIN workouts w ON s.id = w.student_id
      ORDER BY s.name
    `);

    res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar aluno por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const [studentRows] = await connection.promise().execute(
      'SELECT * FROM students WHERE id = ?',
      [id]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    const [workoutRows] = await connection.promise().execute(
      'SELECT * FROM workouts WHERE student_id = ?',
      [id]
    );

    const [paymentRows] = await connection.promise().execute(`
      SELECT * FROM payments 
      WHERE student_id = ? 
      ORDER BY payment_date DESC
    `, [id]);

    res.json({
      student: studentRows[0],
      workout: workoutRows[0] || null,
      payments: paymentRows
    });

  } catch (error) {
    console.error('Erro ao buscar aluno:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Cadastrar novo aluno
router.post('/', [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('cpf').isLength({ min: 14 }).withMessage('CPF inválido'),
  body('birth_date').isISO8601().withMessage('Data de nascimento inválida'),
  body('phone').notEmpty().withMessage('Telefone é obrigatório'),
  body('start_date').isISO8601().withMessage('Data de início inválida'),
  body('workout_name').notEmpty().withMessage('Nome do treino é obrigatório'),
  body('workout_type').notEmpty().withMessage('Tipo do treino é obrigatório'),
  body('workout_frequency').notEmpty().withMessage('Frequência do treino é obrigatória')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name, cpf, birth_date, phone, email, address, start_date,
      weight, height, chest_circumference, waist_circumference,
      hip_circumference, arm_circumference, thigh_circumference,
      workout_name, workout_type, workout_frequency, workout_description
    } = req.body;

    // Verificar se CPF já existe
    const [existingStudent] = await connection.promise().execute(
      'SELECT id FROM students WHERE cpf = ?',
      [cpf]
    );

    if (existingStudent.length > 0) {
      return res.status(400).json({ message: 'CPF já cadastrado' });
    }

    // Inserir aluno
    const [result] = await connection.promise().execute(`
      INSERT INTO students (
        name, cpf, birth_date, phone, email, address, start_date,
        weight, height, chest_circumference, waist_circumference,
        hip_circumference, arm_circumference, thigh_circumference
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name, cpf, birth_date, phone, email, address, start_date,
      weight, height, chest_circumference, waist_circumference,
      hip_circumference, arm_circumference, thigh_circumference
    ]);

    const studentId = result.insertId;

    // Inserir treino
    await connection.promise().execute(`
      INSERT INTO workouts (student_id, name, type, frequency, description)
      VALUES (?, ?, ?, ?, ?)
    `, [studentId, workout_name, workout_type, workout_frequency, workout_description || '']);

    // Criar primeiro pagamento
    const dueDate = new Date(start_date);
    dueDate.setMonth(dueDate.getMonth() + 1);
    
    await connection.promise().execute(`
      INSERT INTO payments (student_id, amount, payment_date, due_date, status)
      VALUES (?, 120.00, ?, ?, 'pending')
    `, [studentId, start_date, dueDate.toISOString().split('T')[0]]);

    res.status(201).json({ 
      message: 'Aluno cadastrado com sucesso',
      studentId 
    });

  } catch (error) {
    console.error('Erro ao cadastrar aluno:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Atualizar aluno
router.put('/:id', [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('cpf').isLength({ min: 14 }).withMessage('CPF inválido'),
  body('birth_date').isISO8601().withMessage('Data de nascimento inválida'),
  body('phone').notEmpty().withMessage('Telefone é obrigatório')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      name, cpf, birth_date, phone, email, address, start_date,
      weight, height, chest_circumference, waist_circumference,
      hip_circumference, arm_circumference, thigh_circumference
    } = req.body;

    // Verificar se aluno existe
    const [existingStudent] = await connection.promise().execute(
      'SELECT id FROM students WHERE id = ?',
      [id]
    );

    if (existingStudent.length === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    // Verificar se CPF já existe em outro aluno
    const [cpfCheck] = await connection.promise().execute(
      'SELECT id FROM students WHERE cpf = ? AND id != ?',
      [cpf, id]
    );

    if (cpfCheck.length > 0) {
      return res.status(400).json({ message: 'CPF já cadastrado para outro aluno' });
    }

    // Atualizar aluno
    await connection.promise().execute(`
      UPDATE students SET
        name = ?, cpf = ?, birth_date = ?, phone = ?, email = ?, address = ?,
        start_date = ?, weight = ?, height = ?, chest_circumference = ?,
        waist_circumference = ?, hip_circumference = ?, arm_circumference = ?,
        thigh_circumference = ?
      WHERE id = ?
    `, [
      name, cpf, birth_date, phone, email, address, start_date,
      weight, height, chest_circumference, waist_circumference,
      hip_circumference, arm_circumference, thigh_circumference, id
    ]);

    res.json({ message: 'Aluno atualizado com sucesso' });

  } catch (error) {
    console.error('Erro ao atualizar aluno:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Deletar aluno
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se aluno existe
    const [existingStudent] = await connection.promise().execute(
      'SELECT id FROM students WHERE id = ?',
      [id]
    );

    if (existingStudent.length === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    // Deletar aluno (cascade irá deletar treinos e pagamentos)
    await connection.promise().execute(
      'DELETE FROM students WHERE id = ?',
      [id]
    );

    res.json({ message: 'Aluno deletado com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar aluno:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Buscar alunos por nome
router.get('/search/:query', async (req, res) => {
  try {
    const { query } = req.params;
    const searchTerm = `%${query}%`;

    const [rows] = await connection.promise().execute(`
      SELECT 
        s.*,
        p.payment_date as last_payment_date,
        p.status as payment_status,
        p.due_date as next_due_date,
        w.name as workout_name,
        w.type as workout_type,
        w.frequency as workout_frequency
      FROM students s
      LEFT JOIN (
        SELECT student_id, payment_date, status, due_date,
               ROW_NUMBER() OVER (PARTITION BY student_id ORDER BY payment_date DESC) as rn
        FROM payments
      ) p ON s.id = p.student_id AND p.rn = 1
      LEFT JOIN workouts w ON s.id = w.student_id
      WHERE s.name LIKE ?
      ORDER BY s.name
    `, [searchTerm]);

    res.json(rows);

  } catch (error) {
    console.error('Erro ao buscar alunos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
