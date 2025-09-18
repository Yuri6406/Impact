import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { studentsAPI, paymentsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus, 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  Weight,
  Ruler,
  Activity,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const StudentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [workout, setWorkout] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    amount: 120.00,
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'PIX',
    notes: ''
  });

  useEffect(() => {
    loadStudentData();
  }, [id]);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      const response = await studentsAPI.getById(id);
      setStudent(response.data.student);
      setWorkout(response.data.workout);
      setPayments(response.data.payments);
    } catch (error) {
      console.error('Erro ao carregar dados do aluno:', error);
      toast.error('Erro ao carregar dados do aluno');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await studentsAPI.delete(id);
      toast.success('Aluno deletado com sucesso');
      navigate('/');
    } catch (error) {
      console.error('Erro ao deletar aluno:', error);
      toast.error('Erro ao deletar aluno');
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    try {
      await paymentsAPI.create({
        ...paymentForm,
        student_id: parseInt(id)
      });
      toast.success('Pagamento registrado com sucesso');
      setShowPaymentModal(false);
      loadStudentData();
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      toast.error('Erro ao registrar pagamento');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="status-badge status-paid">Pago</span>;
      case 'pending':
        return <span className="status-badge status-pending">Pendente</span>;
      case 'overdue':
        return <span className="status-badge status-overdue">Atrasado</span>;
      default:
        return <span className="status-badge status-pending">Pendente</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  if (!student) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Aluno não encontrado</h2>
          <Link to="/admin" className="btn btn-primary">Voltar ao Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/admin" className="btn btn-secondary">
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">
                {student.name}
              </h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="btn btn-success"
              >
                <Plus className="h-4 w-4" />
                Novo Pagamento
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="btn btn-danger"
              >
                <Trash2 className="h-4 w-4" />
                Deletar
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações Pessoais */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Informações Pessoais</h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Nome Completo</p>
                      <p className="font-medium">{student.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Data de Nascimento</p>
                      <p className="font-medium">
                        {format(new Date(student.birth_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">CPF</p>
                      <p className="font-medium">{student.cpf}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Data de Início</p>
                      <p className="font-medium">
                        {format(new Date(student.start_date), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Telefone</p>
                      <p className="font-medium">{student.phone || '-'}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">E-mail</p>
                      <p className="font-medium">{student.email || '-'}</p>
                    </div>
                  </div>
                </div>
                {student.address && (
                  <div className="mt-4 flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Endereço</p>
                      <p className="font-medium">{student.address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Medidas Corporais */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Medidas Corporais</h3>
              </div>
              <div className="card-body">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <Weight className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Peso</p>
                    <p className="font-bold text-lg">{student.weight || '-'} kg</p>
                  </div>
                  <div className="text-center">
                    <Ruler className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Altura</p>
                    <p className="font-bold text-lg">{student.height || '-'} cm</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Peito</p>
                    <p className="font-bold text-lg">{student.chest_circumference || '-'} cm</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Cintura</p>
                    <p className="font-bold text-lg">{student.waist_circumference || '-'} cm</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Quadril</p>
                    <p className="font-bold text-lg">{student.hip_circumference || '-'} cm</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Braço</p>
                    <p className="font-bold text-lg">{student.arm_circumference || '-'} cm</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Coxa</p>
                    <p className="font-bold text-lg">{student.thigh_circumference || '-'} cm</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Treino Atual */}
            {workout && (
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">Treino Atual</h3>
                </div>
                <div className="card-body">
                  <div className="flex items-center space-x-3 mb-4">
                    <Activity className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600">Nome do Treino</p>
                      <p className="font-medium">{workout.name}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Tipo</p>
                      <p className="font-medium">{workout.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Frequência</p>
                      <p className="font-medium">{workout.frequency}</p>
                    </div>
                  </div>
                  {workout.description && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">Descrição</p>
                      <p className="font-medium">{workout.description}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status de Pagamento */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Status de Pagamento</h3>
              </div>
              <div className="card-body">
                {payments.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Último Pagamento</span>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(payments[0].status)}
                        {getStatusBadge(payments[0].status)}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Valor: R$ {payments[0].amount}</p>
                      <p>Data: {format(new Date(payments[0].payment_date), 'dd/MM/yyyy', { locale: ptBR })}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhum pagamento registrado</p>
                )}
              </div>
            </div>

            {/* Histórico de Pagamentos */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Histórico de Pagamentos</h3>
              </div>
              <div className="card-body">
                {payments.length > 0 ? (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div>
                          <p className="text-sm font-medium">R$ {payment.amount}</p>
                          <p className="text-xs text-gray-600">
                            {format(new Date(payment.payment_date), 'dd/MM/yyyy', { locale: ptBR })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(payment.status)}
                          {getStatusBadge(payment.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhum pagamento registrado</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Confirmar Exclusão</h3>
              <button
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
              >
                ×
              </button>
            </div>
            <p className="mb-6">
              Tem certeza que deseja deletar o aluno <strong>{student.name}</strong>? 
              Esta ação não pode ser desfeita e irá deletar todos os dados relacionados.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Novo Pagamento */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="modal-title">Registrar Pagamento</h3>
              <button
                className="modal-close"
                onClick={() => setShowPaymentModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handlePaymentSubmit}>
              <div className="form-group">
                <label className="form-label">Valor</label>
                <input
                  type="number"
                  step="0.01"
                  className="form-input"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({...paymentForm, amount: parseFloat(e.target.value)})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Data do Pagamento</label>
                <input
                  type="date"
                  className="form-input"
                  value={paymentForm.payment_date}
                  onChange={(e) => setPaymentForm({...paymentForm, payment_date: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Método de Pagamento</label>
                <select
                  className="form-select"
                  value={paymentForm.payment_method}
                  onChange={(e) => setPaymentForm({...paymentForm, payment_method: e.target.value})}
                  required
                >
                  <option value="PIX">PIX</option>
                  <option value="Cartão">Cartão</option>
                  <option value="Dinheiro">Dinheiro</option>
                  <option value="Transferência">Transferência</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Observações</label>
                <textarea
                  className="form-textarea"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({...paymentForm, notes: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Registrar Pagamento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDetails;
