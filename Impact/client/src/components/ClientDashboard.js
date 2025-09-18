import React, { useState, useEffect } from 'react';
import { useClientAuth } from '../contexts/ClientAuthContext';
import { clientDataAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  LogOut, 
  User, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Weight,
  Ruler,
  Activity,
  Play,
  TrendingUp,
  Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ClientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [payments, setPayments] = useState([]);
  const [workout, setWorkout] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [measurements, setMeasurements] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const { user, logout } = useClientAuth();

  useEffect(() => {
    loadClientData();
  }, []);

  const loadClientData = async () => {
    try {
      setLoading(true);
      const [profileRes, paymentsRes, workoutRes, measurementsRes, progressRes] = await Promise.all([
        clientDataAPI.getProfile(),
        clientDataAPI.getPayments(),
        clientDataAPI.getWorkout(),
        clientDataAPI.getMeasurements(),
        clientDataAPI.getProgress()
      ]);

      setProfile(profileRes.data);
      setPayments(paymentsRes.data);
      setWorkout(workoutRes.data.workout);
      setExercises(workoutRes.data.exercises);
      setMeasurements(measurementsRes.data);
      setProgress(progressRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados do cliente:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
      case 'Em Dia':
        return <span className="status-badge status-paid">Em Dia</span>;
      case 'pending':
      case 'Pendente':
        return <span className="status-badge status-pending">Pendente</span>;
      case 'overdue':
      case 'Atrasado':
      case 'Vencido':
        return <span className="status-badge status-overdue">Atrasado</span>;
      default:
        return <span className="status-badge status-pending">Pendente</span>;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
      case 'Em Dia':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
      case 'Pendente':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'overdue':
      case 'Atrasado':
      case 'Vencido':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logout realizado com sucesso');
  };

  const openVideoModal = (exercise) => {
    setSelectedExercise(exercise);
    setShowVideoModal(true);
  };

  const getNextDueDate = () => {
    const pendingPayment = payments.find(p => p.status === 'pending' || p.status === 'Pendente');
    return pendingPayment ? pendingPayment.due_date : null;
  };

  const isPaymentOverdue = () => {
    const nextDue = getNextDueDate();
    if (!nextDue) return false;
    return new Date(nextDue) < new Date();
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
                Olá, {user?.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="btn btn-secondary"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Alertas de Pagamento */}
        {isPaymentOverdue() && (
          <div className="alert alert-error mb-6">
            <AlertTriangle className="h-5 w-5 inline mr-2" />
            <strong>Atenção!</strong> Seu pagamento está vencido. Entre em contato com a academia.
          </div>
        )}

        {getNextDueDate() && !isPaymentOverdue() && (
          <div className="alert alert-warning mb-6">
            <Clock className="h-5 w-5 inline mr-2" />
            <strong>Lembrete:</strong> Seu próximo pagamento vence em {format(new Date(getNextDueDate()), 'dd/MM/yyyy', { locale: ptBR })}.
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Coluna Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Situação Financeira */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <DollarSign className="inline h-5 w-5 mr-2" />
                  Situação Financeira
                </h3>
              </div>
              <div className="card-body">
                {payments.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Último Pagamento</p>
                        <p className="text-sm text-gray-600">
                          {format(new Date(payments[0].payment_date), 'dd/MM/yyyy', { locale: ptBR })} - R$ {payments[0].amount}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(payments[0].status_text)}
                        {getStatusBadge(payments[0].status_text)}
                      </div>
                    </div>
                    
                    {payments.length > 1 && (
                      <div>
                        <h4 className="font-medium mb-2">Histórico Recente</h4>
                        <div className="space-y-2">
                          {payments.slice(1, 4).map((payment, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span>{format(new Date(payment.payment_date), 'dd/MM/yyyy', { locale: ptBR })} - R$ {payment.amount}</span>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(payment.status_text)}
                                {getStatusBadge(payment.status_text)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500">Nenhum pagamento registrado</p>
                )}
              </div>
            </div>

            {/* Treino Atual */}
            {workout && (
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <Activity className="inline h-5 w-5 mr-2" />
                    Treino Atual
                  </h3>
                </div>
                <div className="card-body">
                  <div className="mb-4">
                    <h4 className="font-bold text-lg">{workout.name}</h4>
                    <p className="text-gray-600">{workout.type} - {workout.frequency}</p>
                    {workout.description && (
                      <p className="text-sm text-gray-500 mt-2">{workout.description}</p>
                    )}
                  </div>

                  {exercises.length > 0 ? (
                    <div className="space-y-3">
                      <h5 className="font-medium">Exercícios:</h5>
                      {exercises.map((exercise, index) => (
                        <div key={exercise.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{exercise.name}</span>
                              {exercise.video_url && (
                                <button
                                  onClick={() => openVideoModal(exercise)}
                                  className="btn btn-sm btn-primary"
                                >
                                  <Play className="h-3 w-3" />
                                  Ver Vídeo
                                </button>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 mt-1">
                              {exercise.sets} séries de {exercise.reps}
                              {exercise.weight && ` com ${exercise.weight}`}
                              {exercise.rest_time && ` - Descanso: ${exercise.rest_time}`}
                            </div>
                            {exercise.notes && (
                              <p className="text-xs text-gray-500 mt-1">{exercise.notes}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Nenhum exercício cadastrado</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Informações Corporais */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Weight className="inline h-5 w-5 mr-2" />
                  Medidas Atuais
                </h3>
              </div>
              <div className="card-body">
                {profile ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Peso</span>
                      <span className="font-medium">{profile.weight || '-'} kg</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Altura</span>
                      <span className="font-medium">{profile.height || '-'} cm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Peito</span>
                      <span className="font-medium">{profile.chest_circumference || '-'} cm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cintura</span>
                      <span className="font-medium">{profile.waist_circumference || '-'} cm</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Braço</span>
                      <span className="font-medium">{profile.arm_circumference || '-'} cm</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Dados não disponíveis</p>
                )}
              </div>
            </div>

            {/* Evolução */}
            {progress && (progress.measurements.initial_weight || progress.measurements.current_weight) && (
              <div className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    <TrendingUp className="inline h-5 w-5 mr-2" />
                    Sua Evolução
                  </h3>
                </div>
                <div className="card-body">
                  <div className="space-y-3">
                    {progress.measurements.initial_weight && progress.measurements.current_weight && (
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Peso Inicial</span>
                          <span>{progress.measurements.initial_weight} kg</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Peso Atual</span>
                          <span>{progress.measurements.current_weight} kg</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span>Variação</span>
                          <span className={progress.measurements.current_weight < progress.measurements.initial_weight ? 'text-green-600' : 'text-red-600'}>
                            {progress.measurements.current_weight - progress.measurements.initial_weight > 0 ? '+' : ''}
                            {(progress.measurements.current_weight - progress.measurements.initial_weight).toFixed(1)} kg
                          </span>
                        </div>
                      </div>
                    )}
                    
                    {progress.measurements.initial_chest && progress.measurements.current_chest && (
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Peito Inicial</span>
                          <span>{progress.measurements.initial_chest} cm</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Peito Atual</span>
                          <span>{progress.measurements.current_chest} cm</span>
                        </div>
                        <div className="flex justify-between text-sm font-medium">
                          <span>Variação</span>
                          <span className={progress.measurements.current_chest > progress.measurements.initial_chest ? 'text-green-600' : 'text-red-600'}>
                            {progress.measurements.current_chest - progress.measurements.initial_chest > 0 ? '+' : ''}
                            {(progress.measurements.current_chest - progress.measurements.initial_chest).toFixed(1)} cm
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Próxima Avaliação */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">
                  <Calendar className="inline h-5 w-5 mr-2" />
                  Próxima Avaliação
                </h3>
              </div>
              <div className="card-body">
                <p className="text-sm text-gray-600">
                  Sua próxima avaliação física será agendada pelo seu personal trainer.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Última avaliação: {measurements.length > 0 ? 
                    format(new Date(measurements[0].measurement_date), 'dd/MM/yyyy', { locale: ptBR }) : 
                    'Não registrada'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Vídeo */}
      {showVideoModal && selectedExercise && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h3 className="modal-title">{selectedExercise.name}</h3>
              <button
                className="modal-close"
                onClick={() => setShowVideoModal(false)}
              >
                ×
              </button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                {selectedExercise.sets} séries de {selectedExercise.reps}
                {selectedExercise.weight && ` com ${selectedExercise.weight}`}
              </p>
              {selectedExercise.notes && (
                <p className="text-sm text-gray-500">{selectedExercise.notes}</p>
              )}
            </div>
            <div className="bg-gray-100 rounded-lg p-8 text-center">
              <p className="text-gray-500">
                Vídeo explicativo será integrado aqui
              </p>
              <p className="text-sm text-gray-400 mt-2">
                URL: {selectedExercise.video_url}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;
