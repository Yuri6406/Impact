import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { studentsAPI } from '../services/api';
import { toast } from 'react-toastify';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin,
  Weight,
  Ruler,
  Activity,
  Save
} from 'lucide-react';

const NewStudent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    birth_date: '',
    phone: '',
    email: '',
    address: '',
    start_date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    chest_circumference: '',
    waist_circumference: '',
    hip_circumference: '',
    arm_circumference: '',
    thigh_circumference: '',
    workout_name: '',
    workout_type: 'Musculação',
    workout_frequency: '3x por semana',
    workout_description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatCPF = (value) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleCPFChange = (e) => {
    const formatted = formatCPF(e.target.value);
    setFormData(prev => ({
      ...prev,
      cpf: formatted
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await studentsAPI.create(formData);
      toast.success('Aluno cadastrado com sucesso!');
      navigate('/');
    } catch (error) {
      console.error('Erro ao cadastrar aluno:', error);
      const message = error.response?.data?.message || 'Erro ao cadastrar aluno';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/admin')}
              className="btn btn-secondary"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              Cadastrar Novo Aluno
            </h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Informações Pessoais */}
          <div className="card mb-8">
            <div className="card-header">
              <h3 className="card-title">Informações Pessoais</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">
                    <User className="inline h-4 w-4 mr-2" />
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CPF *</label>
                  <input
                    type="text"
                    name="cpf"
                    className="form-input"
                    value={formData.cpf}
                    onChange={handleCPFChange}
                    placeholder="000.000.000-00"
                    maxLength="14"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Calendar className="inline h-4 w-4 mr-2" />
                    Data de Nascimento *
                  </label>
                  <input
                    type="date"
                    name="birth_date"
                    className="form-input"
                    value={formData.birth_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Phone className="inline h-4 w-4 mr-2" />
                    Telefone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Mail className="inline h-4 w-4 mr-2" />
                    E-mail
                  </label>
                  <input
                    type="email"
                    name="email"
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="aluno@email.com"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Calendar className="inline h-4 w-4 mr-2" />
                    Data de Início *
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    className="form-input"
                    value={formData.start_date}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <MapPin className="inline h-4 w-4 mr-2" />
                  Endereço
                </label>
                <textarea
                  name="address"
                  className="form-textarea"
                  value={formData.address}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Rua, número, bairro, cidade - UF"
                />
              </div>
            </div>
          </div>

          {/* Medidas Corporais */}
          <div className="card mb-8">
            <div className="card-header">
              <h3 className="card-title">Medidas Corporais</h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="form-group">
                  <label className="form-label">
                    <Weight className="inline h-4 w-4 mr-2" />
                    Peso (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="weight"
                    className="form-input"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="70.5"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Ruler className="inline h-4 w-4 mr-2" />
                    Altura (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="height"
                    className="form-input"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="175.0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Peito (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="chest_circumference"
                    className="form-input"
                    value={formData.chest_circumference}
                    onChange={handleChange}
                    placeholder="95.0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Cintura (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="waist_circumference"
                    className="form-input"
                    value={formData.waist_circumference}
                    onChange={handleChange}
                    placeholder="85.0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Quadril (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="hip_circumference"
                    className="form-input"
                    value={formData.hip_circumference}
                    onChange={handleChange}
                    placeholder="100.0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Braço (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="arm_circumference"
                    className="form-input"
                    value={formData.arm_circumference}
                    onChange={handleChange}
                    placeholder="35.0"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Coxa (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    name="thigh_circumference"
                    className="form-input"
                    value={formData.thigh_circumference}
                    onChange={handleChange}
                    placeholder="60.0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Plano de Treino */}
          <div className="card mb-8">
            <div className="card-header">
              <h3 className="card-title">
                <Activity className="inline h-5 w-5 mr-2" />
                Plano de Treino
              </h3>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label className="form-label">Nome do Treino *</label>
                  <input
                    type="text"
                    name="workout_name"
                    className="form-input"
                    value={formData.workout_name}
                    onChange={handleChange}
                    placeholder="Ex: Treino A - Peito e Tríceps"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Tipo de Treino *</label>
                  <select
                    name="workout_type"
                    className="form-select"
                    value={formData.workout_type}
                    onChange={handleChange}
                    required
                  >
                    <option value="Musculação">Musculação</option>
                    <option value="Funcional">Funcional</option>
                    <option value="Crossfit">Crossfit</option>
                    <option value="Pilates">Pilates</option>
                    <option value="Yoga">Yoga</option>
                    <option value="Outro">Outro</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Frequência *</label>
                  <select
                    name="workout_frequency"
                    className="form-select"
                    value={formData.workout_frequency}
                    onChange={handleChange}
                    required
                  >
                    <option value="1x por semana">1x por semana</option>
                    <option value="2x por semana">2x por semana</option>
                    <option value="3x por semana">3x por semana</option>
                    <option value="4x por semana">4x por semana</option>
                    <option value="5x por semana">5x por semana</option>
                    <option value="6x por semana">6x por semana</option>
                    <option value="Todos os dias">Todos os dias</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Descrição do Treino</label>
                <textarea
                  name="workout_description"
                  className="form-textarea"
                  value={formData.workout_description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Descreva os exercícios, séries, repetições, etc."
                />
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Cadastrando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Cadastrar Aluno
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewStudent;
