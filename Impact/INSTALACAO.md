# 🚀 Guia de Instalação Rápida - Impact Academy

## ⚡ Instalação em 5 Passos

### 1. Pré-requisitos
- Node.js 16+ instalado
- MySQL 8.0+ instalado e rodando
- Git instalado

### 2. Clone e Instale
```bash
# Clone o projeto
git clone <url-do-repositorio>
cd Impact

# Instale todas as dependências
npm run install-all
```

### 3. Configure o Banco de Dados
```sql
-- No MySQL, execute:
CREATE DATABASE academia_db;
USE academia_db;

-- Execute o arquivo: server/database/init.sql
```

### 4. Configure as Variáveis
Edite o arquivo `server/config.env`:
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=academia_db
JWT_SECRET=academia_super_secret_key_2024
```

### 5. Execute o Sistema
```bash
npm run dev
```

## 🌐 Acessos

### Administrador
- **URL:** http://localhost:3000/admin/login
- **Usuário:** admin
- **Senha:** admin123

### Cliente
- **URL:** http://localhost:3000/client/login
- **CPF:** 123.456.789-00
- **Senha:** admin123

## ✅ Verificação

Se tudo estiver funcionando, você verá:
- Backend rodando na porta 5000
- Frontend rodando na porta 3000
- Banco de dados com dados de exemplo
- Login funcionando para admin e cliente

## 🆘 Problemas Comuns

### Erro de Conexão com MySQL
- Verifique se o MySQL está rodando
- Confirme as credenciais no `config.env`
- Teste a conexão: `mysql -u root -p`

### Erro de Dependências
- Execute `npm install` em cada pasta (server e client)
- Limpe o cache: `npm cache clean --force`

### Porta já em uso
- Mude a porta no `config.env` (backend)
- Mude a porta no `package.json` do client

## 📱 Teste no Mobile

O sistema é responsivo! Teste no seu celular:
- Acesse http://seu-ip:3000/client/login
- Use as credenciais de cliente
- Navegue pelo painel mobile

---

**Pronto! Seu sistema está funcionando! 🎉**
