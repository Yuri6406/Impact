# 🏋️‍♂️ Impact Academy - Sistema de Gerenciamento de Academia

Sistema completo de gerenciamento para academias com interface para administradores e clientes, incluindo controle de alunos, pagamentos, treinos e vídeos explicativos.

## 🚀 Funcionalidades

### Para Administradores
- ✅ Login seguro com autenticação JWT
- ✅ Dashboard com visão geral dos alunos
- ✅ Cadastro completo de novos clientes
- ✅ Gestão de informações pessoais e medidas corporais
- ✅ Controle de pagamentos e status
- ✅ Gerenciamento de treinos e exercícios
- ✅ Busca e filtros avançados
- ✅ Interface responsiva e intuitiva

### Para Clientes
- ✅ Login com CPF ou e-mail
- ✅ Visualização da situação financeira
- ✅ Acompanhamento de medidas corporais e evolução
- ✅ Consulta do treino atual com exercícios detalhados
- ✅ Vídeos explicativos dos exercícios
- ✅ Histórico de pagamentos
- ✅ Alertas de vencimento

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** com Express
- **MySQL** para banco de dados
- **JWT** para autenticação
- **bcryptjs** para criptografia de senhas
- **CORS** para comunicação entre frontend e backend

### Frontend
- **React 18** com Hooks
- **React Router** para navegação
- **Axios** para requisições HTTP
- **React Toastify** para notificações
- **Lucide React** para ícones
- **date-fns** para manipulação de datas

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- MySQL (versão 8.0 ou superior)
- npm ou yarn

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone <url-do-repositorio>
cd Impact
```

### 2. Instale as dependências
```bash
# Instalar dependências do projeto principal
npm install

# Instalar dependências do backend
cd server
npm install

# Instalar dependências do frontend
cd ../client
npm install
```

### 3. Configure o banco de dados

1. Crie um banco de dados MySQL chamado `academia_db`
2. Execute o script SQL localizado em `server/database/init.sql`
3. Configure as variáveis de ambiente no arquivo `server/config.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=academia_db
JWT_SECRET=sua_chave_secreta_jwt
```

### 4. Execute o projeto

```bash
# Na raiz do projeto
npm run dev
```

Isso irá iniciar:
- Backend na porta 5000
- Frontend na porta 3000

## 🔐 Credenciais de Acesso

### Administrador
- **URL:** http://localhost:3000/admin/login
- **Usuário:** admin
- **Senha:** admin123

### Cliente (Exemplos)
- **URL:** http://localhost:3000/client/login
- **CPF:** 123.456.789-00
- **E-mail:** joao@email.com
- **Senha:** admin123

## 📱 Estrutura do Projeto

```
Impact/
├── server/                 # Backend Node.js
│   ├── routes/            # Rotas da API
│   ├── database/          # Scripts SQL
│   ├── middleware/        # Middlewares de autenticação
│   └── index.js          # Servidor principal
├── client/                # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   ├── contexts/      # Contextos de autenticação
│   │   ├── services/      # Serviços de API
│   │   └── App.js        # Aplicação principal
│   └── public/           # Arquivos estáticos
└── package.json          # Configurações do projeto
```

## 🎯 Rotas da Aplicação

### Administrador
- `/admin/login` - Login do administrador
- `/admin` - Dashboard principal
- `/admin/new-student` - Cadastro de novo aluno
- `/admin/student/:id` - Detalhes do aluno

### Cliente
- `/client/login` - Login do cliente
- `/client` - Painel do cliente

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais
- **admins** - Administradores do sistema
- **students** - Dados dos alunos/clientes
- **workouts** - Treinos dos alunos
- **exercises** - Exercícios dos treinos
- **payments** - Pagamentos dos alunos
- **body_measurements** - Histórico de medidas corporais

## 🔒 Segurança

- Autenticação JWT com tokens seguros
- Senhas criptografadas com bcrypt
- Controle de acesso baseado em roles
- Validação de dados no backend
- CORS configurado adequadamente

## 📊 Funcionalidades Avançadas

### Para Administradores
- Busca em tempo real de alunos
- Ordenação por diferentes critérios
- Estatísticas de pagamentos
- Gestão completa de dados dos alunos
- Controle de treinos e exercícios

### Para Clientes
- Visualização de evolução corporal
- Alertas de vencimento de pagamentos
- Treinos detalhados com instruções
- Histórico completo de medidas
- Interface otimizada para mobile

## 🚀 Deploy

### Backend
1. Configure as variáveis de ambiente de produção
2. Execute `npm run build` no diretório server
3. Configure um servidor Node.js (PM2 recomendado)

### Frontend
1. Execute `npm run build` no diretório client
2. Configure um servidor web (Nginx recomendado)
3. Configure proxy para API

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte ou dúvidas, entre em contato através dos issues do GitHub.

---

**Impact Academy** - Transformando vidas através da tecnologia! 💪
