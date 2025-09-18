import React, { useState } from 'react';
import { useClientAuth } from '../contexts/ClientAuthContext';
import { toast } from 'react-toastify';
import { User, Lock, Dumbbell, Eye, EyeOff } from 'lucide-react';

const ClientLogin = () => {
  const [formData, setFormData] = useState({
    login: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useClientAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await login(formData);
      if (result.success) {
        toast.success('Login realizado com sucesso!');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-green-600 p-4 rounded-full">
              <Dumbbell className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Impact Academy
          </h2>
          <p className="text-gray-600">
            Área do Cliente
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="login" className="form-label">
                <User className="inline h-4 w-4 mr-2" />
                CPF ou E-mail
              </label>
              <input
                id="login"
                name="login"
                type="text"
                required
                className="form-input"
                placeholder="Digite seu CPF ou e-mail"
                value={formData.login}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                <Lock className="inline h-4 w-4 mr-2" />
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input pr-10"
                  placeholder="Digite sua senha"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
            >
              {loading ? (
                <>
                  <div className="spinner"></div>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            <p>Credenciais de teste:</p>
            <p><strong>CPF:</strong> 123.456.789-00</p>
            <p><strong>E-mail:</strong> joao@email.com</p>
            <p><strong>Senha:</strong> admin123</p>
          </div>

          <div className="mt-4 text-center">
            <a 
              href="/admin" 
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Área do Administrador
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
