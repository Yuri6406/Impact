import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { studentsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  Search, 
  Plus, 
  Users, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  LogOut,
  User
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('name');
  const { user, logout } = useAuth();

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [students, searchTerm]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const response = await studentsAPI.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      toast.error('Erro ao carregar lista de alunos');
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    let filtered = [...students];

    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'last_payment':
          return new Date(b.last_payment_date || 0) - new Date(a.last_payment_date || 0);
        case 'status':
          return a.payment_status?.localeCompare(b.payment_status) || 0;
        default:
          return 0;
      }
    });

    setFilteredStudents(filtered);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="status-badge status-paid">Em Dia</span>;
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

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso');
  };

  const stats = {
    total: students.length,
    paid: students.filter(s => s.payment_status === 'paid').length,
    pending: students.filter(s => s.payment_status === 'pending').length,
    overdue: students.filter(s => s.payment_status === 'overdue').length
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Impact Academy
              </h1>
              <span className="text-sm text-gray-500">
                Bem-vindo, {user?.username}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/new-student"
                className="btn btn-primary"
              >
                <Plus className="h-4 w-4" />
                Novo Aluno
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-secondary"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Em Dia</p>
                <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Atrasados</p>
                <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="card">
          <div className="search-container">
            <div className="search-input">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome do aluno..."
                  className="form-input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ maxWidth: '200px' }}
            >
              <option value="name">Ordenar por Nome</option>
              <option value="last_payment">Último Pagamento</option>
              <option value="status">Status</option>
            </select>
          </div>
        </div>

        {/* Students Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Lista de Alunos</h3>
          </div>
          <div className="card-body">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Último Pagamento</th>
                      <th>Status</th>
                      <th>Treino</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id}>
                        <td>
                          <div className="flex items-center">
                            <User className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="font-medium">{student.name}</span>
                          </div>
                        </td>
                        <td>
                          {student.last_payment_date ? (
                            format(new Date(student.last_payment_date), 'dd/MM/yyyy', { locale: ptBR })
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(student.payment_status)}
                            {getStatusBadge(student.payment_status)}
                          </div>
                        </td>
                        <td>
                          {student.workout_name ? (
                            <div>
                              <div className="font-medium">{student.workout_name}</div>
                              <div className="text-sm text-gray-500">
                                {student.workout_type} - {student.workout_frequency}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td>
                          <Link
                            to={`/admin/student/${student.id}`}
                            className="btn btn-sm btn-primary"
                          >
                            Ver Detalhes
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
