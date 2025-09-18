const express = require('express');
const { body, validationResult } = require('express-validator');
const connection = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticateToken);

// Registrar pagamento
router.post('/', [
  body('student_id').isInt().withMessage('ID do aluno é obrigatório'),
  body('amount').isDecimal().withMessage('Valor é obrigatório'),
  body('payment_date').isISO8601().withMessage('Data de pagamento inválida'),
  body('payment_method').notEmpty().withMessage('Método de pagamento é obrigatório')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { student_id, amount, payment_date, payment_method, notes } = req.body;

    // Verificar se aluno existe
    const [student] = await connection.promise().execute(
      'SELECT id FROM students WHERE id = ?',
      [student_id]
    );

    if (student.length === 0) {
      return res.status(404).json({ message: 'Aluno não encontrado' });
    }

    // Calcular próxima data de vencimento (1 mês após o pagamento)
    const nextDueDate = new Date(payment_date);
    nextDueDate.setMonth(nextDueDate.getMonth() + 1);

    // Inserir pagamento
    await connection.promise().execute(`
      INSERT INTO payments (student_id, amount, payment_date, due_date, status, payment_method, notes)
      VALUES (?, ?, ?, ?, 'paid', ?, ?)
    `, [student_id, amount, payment_date, nextDueDate.toISOString().split('T')[0], payment_method, notes || '']);

    // Criar próximo pagamento pendente
    await connection.promise().execute(`
      INSERT INTO payments (student_id, amount, payment_date, due_date, status, payment_method)
      VALUES (?, ?, ?, ?, 'pending', ?)
    `, [student_id, amount, nextDueDate.toISOString().split('T')[0], nextDueDate.toISOString().split('T')[0], payment_method]);

    res.status(201).json({ message: 'Pagamento registrado com sucesso' });

  } catch (error) {
    console.error('Erro ao registrar pagamento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Atualizar status de pagamento
router.put('/:id/status', [
  body('status').isIn(['paid', 'pending', 'overdue']).withMessage('Status inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { status } = req.body;

    // Verificar se pagamento existe
    const [payment] = await connection.promise().execute(
      'SELECT id FROM payments WHERE id = ?',
      [id]
    );

    if (payment.length === 0) {
      return res.status(404).json({ message: 'Pagamento não encontrado' });
    }

    // Atualizar status
    await connection.promise().execute(
      'UPDATE payments SET status = ? WHERE id = ?',
      [status, id]
    );

    res.json({ message: 'Status do pagamento atualizado com sucesso' });

  } catch (error) {
    console.error('Erro ao atualizar status do pagamento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Deletar pagamento
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se pagamento existe
    const [payment] = await connection.promise().execute(
      'SELECT id FROM payments WHERE id = ?',
      [id]
    );

    if (payment.length === 0) {
      return res.status(404).json({ message: 'Pagamento não encontrado' });
    }

    // Deletar pagamento
    await connection.promise().execute(
      'DELETE FROM payments WHERE id = ?',
      [id]
    );

    res.json({ message: 'Pagamento deletado com sucesso' });

  } catch (error) {
    console.error('Erro ao deletar pagamento:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Listar pagamentos de um aluno
router.get('/student/:student_id', async (req, res) => {
  try {
    const { student_id } = req.params;

    const [rows] = await connection.promise().execute(`
      SELECT * FROM payments 
      WHERE student_id = ? 
      ORDER BY payment_date DESC
    `, [student_id]);

    res.json(rows);

  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Listar todos os pagamentos
router.get('/', async (req, res) => {
  try {
    const [rows] = await connection.promise().execute(`
      SELECT 
        p.*,
        s.name as student_name,
        s.cpf as student_cpf
      FROM payments p
      JOIN students s ON p.student_id = s.id
      ORDER BY p.payment_date DESC
    `);

    res.json(rows);

  } catch (error) {
    console.error('Erro ao buscar pagamentos:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
