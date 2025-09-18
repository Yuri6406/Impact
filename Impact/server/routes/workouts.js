const express = require('express');
const { body, validationResult } = require('express-validator');
const connection = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticateToken);

// Atualizar treino de um aluno
router.put('/:student_id', [
  body('name').notEmpty().withMessage('Nome do treino é obrigatório'),
  body('type').notEmpty().withMessage('Tipo do treino é obrigatório'),
  body('frequency').notEmpty().withMessage('Frequência do treino é obrigatória')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { student_id } = req.params;
    const { name, type, frequency, description } = req.body;

    // Verificar se aluno existe
    const [student] = await connection.promise().execute(
      'SELECT id FROM students WHERE id = ?',
      [student_id]
    );

    if (student.length === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    // Verificar se treino já existe
    const [existingWorkout] = await connection.promise().execute(
      'SELECT id FROM workouts WHERE student_id = ?',
      [student_id]
    );

    if (existingWorkout.length > 0) {
      // Atualizar treino existente
      await connection.promise().execute(`
        UPDATE workouts SET
          name = ?, type = ?, frequency = ?, description = ?
        WHERE student_id = ?
      `, [name, type, frequency, description || '', student_id]);
    } else {
      // Criar novo treino
      await connection.promise().execute(`
        INSERT INTO workouts (student_id, name, type, frequency, description)
        VALUES (?, ?, ?, ?, ?)
      `, [student_id, name, type, frequency, description || '']);
    }

    res.json({ message: 'Treino atualizado com sucesso' });

  } catch (error) {
    console.error('Erro ao atualizar treino:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Deletar treino de um aluno
router.delete('/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;

    // Verificar se treino existe
    const [workout] = await connection.promise().execute(
      'SELECT id FROM workouts WHERE student_id = ?',
      [student_id]
    );

    if (workout.length === 0) {
      return res.status(404).json({ message: 'Treino não encontrado' });
    }

    // Deletar treino
    await connection.promise().execute(
      'DELETE FROM workouts WHERE student_id = ?',
      [student_id]
    );

    res.json({ message: 'Treino deletado com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar treino:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Listar todos os treinos
router.get('/', async (req, res) => {
  try {
    const [rows] = await connection.promise().execute(`
      SELECT 
        w.*,
        s.name as student_name,
        s.cpf as student_cpf
      FROM workouts w
      JOIN students s ON w.student_id = s.id
      ORDER BY s.name
    `);

    res.json(rows);

  } catch (error) {
    console.error('Erro ao buscar treinos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
