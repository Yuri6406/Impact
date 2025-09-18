-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS academia_db;
USE academia_db;

-- Tabela de administradores
CREATE TABLE IF NOT EXISTS admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de alunos
CREATE TABLE IF NOT EXISTS students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  cpf VARCHAR(14) UNIQUE NOT NULL,
  birth_date DATE NOT NULL,
  phone VARCHAR(20),
  email VARCHAR(100),
  password VARCHAR(255),
  address TEXT,
  start_date DATE NOT NULL,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  chest_circumference DECIMAL(5,2),
  waist_circumference DECIMAL(5,2),
  hip_circumference DECIMAL(5,2),
  arm_circumference DECIMAL(5,2),
  thigh_circumference DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de treinos
CREATE TABLE IF NOT EXISTS workouts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL,
  frequency VARCHAR(50) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Tabela de exercícios
CREATE TABLE IF NOT EXISTS exercises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  workout_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  sets INT NOT NULL,
  reps VARCHAR(50) NOT NULL,
  weight VARCHAR(50),
  rest_time VARCHAR(20),
  notes TEXT,
  video_url VARCHAR(500),
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);

-- Tabela de histórico de medidas
CREATE TABLE IF NOT EXISTS body_measurements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  measurement_date DATE NOT NULL,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  chest_circumference DECIMAL(5,2),
  waist_circumference DECIMAL(5,2),
  hip_circumference DECIMAL(5,2),
  arm_circumference DECIMAL(5,2),
  thigh_circumference DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Tabela de pagamentos
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_date DATE NOT NULL,
  due_date DATE NOT NULL,
  status ENUM('paid', 'pending', 'overdue') DEFAULT 'pending',
  payment_method VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Inserir administrador padrão (senha: admin123)
INSERT INTO admins (username, password) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE username = username;

-- Inserir dados de exemplo
INSERT INTO students (name, cpf, birth_date, phone, email, password, address, start_date, weight, height, chest_circumference, waist_circumference, hip_circumference, arm_circumference, thigh_circumference) VALUES
('João Silva', '123.456.789-00', '1990-05-15', '(11) 99999-9999', 'joao@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Rua das Flores, 123', '2024-01-15', 75.5, 175.0, 95.0, 85.0, 100.0, 35.0, 60.0),
('Maria Santos', '987.654.321-00', '1985-08-22', '(11) 88888-8888', 'maria@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Av. Principal, 456', '2024-02-01', 65.0, 165.0, 85.0, 70.0, 95.0, 30.0, 55.0),
('Pedro Costa', '456.789.123-00', '1992-12-10', '(11) 77777-7777', 'pedro@email.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Rua da Paz, 789', '2024-01-20', 80.0, 180.0, 100.0, 90.0, 105.0, 38.0, 65.0);

-- Inserir treinos de exemplo
INSERT INTO workouts (student_id, name, type, frequency, description) VALUES
(1, 'Treino A - Peito e Tríceps', 'Musculação', '3x por semana', 'Supino, crucifixo, tríceps pulley'),
(2, 'Treino B - Costas e Bíceps', 'Musculação', '3x por semana', 'Puxada, remada, rosca bíceps'),
(3, 'Treino C - Pernas e Ombros', 'Musculação', '3x por semana', 'Agachamento, leg press, desenvolvimento');

-- Inserir exercícios de exemplo
INSERT INTO exercises (workout_id, name, sets, reps, weight, rest_time, notes, video_url, order_index) VALUES
-- Treino A - Peito e Tríceps (João)
(1, 'Supino Reto com Barra', 4, '8-12', '60-80kg', '90s', 'Foque na amplitude completa', 'https://www.youtube.com/watch?v=example1', 1),
(1, 'Supino Inclinado com Halteres', 3, '10-15', '20-30kg', '60s', 'Controle a descida', 'https://www.youtube.com/watch?v=example2', 2),
(1, 'Crucifixo', 3, '12-15', '12-20kg', '60s', 'Movimento controlado', 'https://www.youtube.com/watch?v=example3', 3),
(1, 'Tríceps Pulley', 4, '12-15', '15-25kg', '60s', 'Mantenha os cotovelos fixos', 'https://www.youtube.com/watch?v=example4', 4),
(1, 'Tríceps Testa', 3, '10-12', '15-25kg', '60s', 'Controle a descida', 'https://www.youtube.com/watch?v=example5', 5),

-- Treino B - Costas e Bíceps (Maria)
(2, 'Puxada Frontal', 4, '8-12', '40-60kg', '90s', 'Puxe até o peito', 'https://www.youtube.com/watch?v=example6', 1),
(2, 'Remada Curvada', 3, '10-15', '30-50kg', '60s', 'Mantenha a coluna reta', 'https://www.youtube.com/watch?v=example7', 2),
(2, 'Puxada Atrás', 3, '12-15', '35-55kg', '60s', 'Foque na contração das costas', 'https://www.youtube.com/watch?v=example8', 3),
(2, 'Rosca Bíceps', 4, '10-12', '10-20kg', '60s', 'Controle o movimento', 'https://www.youtube.com/watch?v=example9', 4),
(2, 'Rosca Martelo', 3, '12-15', '8-15kg', '60s', 'Mantenha os cotovelos fixos', 'https://www.youtube.com/watch?v=example10', 5),

-- Treino C - Pernas e Ombros (Pedro)
(3, 'Agachamento Livre', 4, '8-12', '60-100kg', '120s', 'Desça até 90 graus', 'https://www.youtube.com/watch?v=example11', 1),
(3, 'Leg Press', 3, '12-15', '100-150kg', '90s', 'Amplitude completa', 'https://www.youtube.com/watch?v=example12', 2),
(3, 'Desenvolvimento com Halteres', 4, '8-12', '15-25kg', '90s', 'Controle a descida', 'https://www.youtube.com/watch?v=example13', 3),
(3, 'Elevação Lateral', 3, '12-15', '5-12kg', '60s', 'Movimento controlado', 'https://www.youtube.com/watch?v=example14', 4),
(3, 'Elevação Frontal', 3, '10-12', '5-10kg', '60s', 'Não balance o peso', 'https://www.youtube.com/watch?v=example15', 5);

-- Inserir histórico de medidas
INSERT INTO body_measurements (student_id, measurement_date, weight, height, chest_circumference, waist_circumference, hip_circumference, arm_circumference, thigh_circumference, notes) VALUES
(1, '2024-01-15', 75.5, 175.0, 95.0, 85.0, 100.0, 35.0, 60.0, 'Medidas iniciais'),
(1, '2024-02-15', 74.0, 175.0, 96.0, 83.0, 99.0, 35.5, 60.5, 'Primeira reavaliação'),
(1, '2024-03-15', 73.5, 175.0, 97.0, 82.0, 98.5, 36.0, 61.0, 'Segunda reavaliação'),
(2, '2024-02-01', 65.0, 165.0, 85.0, 70.0, 95.0, 30.0, 55.0, 'Medidas iniciais'),
(2, '2024-03-01', 64.5, 165.0, 86.0, 69.0, 94.5, 30.5, 55.5, 'Primeira reavaliação'),
(3, '2024-01-20', 80.0, 180.0, 100.0, 90.0, 105.0, 38.0, 65.0, 'Medidas iniciais'),
(3, '2024-02-20', 79.5, 180.0, 101.0, 89.0, 104.5, 38.5, 65.5, 'Primeira reavaliação');

-- Inserir pagamentos de exemplo
INSERT INTO payments (student_id, amount, payment_date, due_date, status, payment_method) VALUES
(1, 120.00, '2024-01-15', '2024-01-15', 'paid', 'PIX'),
(1, 120.00, '2024-02-15', '2024-02-15', 'paid', 'PIX'),
(1, 120.00, '2024-03-15', '2024-03-15', 'overdue', 'PIX'),
(2, 120.00, '2024-02-01', '2024-02-01', 'paid', 'Cartão'),
(2, 120.00, '2024-03-01', '2024-03-01', 'paid', 'Cartão'),
(2, 120.00, '2024-04-01', '2024-04-01', 'pending', 'Cartão'),
(3, 120.00, '2024-01-20', '2024-01-20', 'paid', 'Dinheiro'),
(3, 120.00, '2024-02-20', '2024-02-20', 'paid', 'Dinheiro'),
(3, 120.00, '2024-03-20', '2024-03-20', 'overdue', 'Dinheiro');
