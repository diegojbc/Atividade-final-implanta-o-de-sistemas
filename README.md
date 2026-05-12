# ClinCad — Sistema de Cadastro de Pacientes

Sistema web para digitalização e organização de fichas de pacientes em clínicas médicas de pequeno porte.

## 🛠 Tecnologias

| Camada | Tecnologia |
|---|---|
| Frontend | HTML5 + CSS3 + JavaScript (Vanilla) |
| Banco de dados | PostgreSQL via [Supabase](https://supabase.com) |
| Hospedagem | [Vercel](https://vercel.com) |
| Controle de versão | Git + GitHub |

## 📋 Funcionalidades

- ✅ Cadastro de pacientes (Nome, Celular, E-mail)
- ✅ Listagem com busca em tempo real
- ✅ Exclusão com confirmação via modal
- ✅ Contador animado de total de pacientes
- ✅ Máscara automática de celular
- ✅ Validação completa do formulário
- ✅ Notificações toast de feedback
- ✅ Design responsivo (mobile-first)
- ✅ Interface dark premium

## 🚀 Como executar localmente

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/clinica-pacientes.git
   cd clinica-pacientes
   ```

2. Configure o Supabase em `supabaseClient.js`:
   ```js
   const SUPABASE_URL  = 'https://SEU-PROJETO.supabase.co';
   const SUPABASE_ANON = 'SUA-ANON-KEY';
   ```

3. Crie a tabela no SQL Editor do Supabase:
   ```sql
   CREATE TABLE pacientes (
     id        BIGSERIAL PRIMARY KEY,
     nome      TEXT NOT NULL,
     celular   TEXT NOT NULL,
     email     TEXT NOT NULL,
     criado_em TIMESTAMPTZ DEFAULT NOW()
   );

   ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
   CREATE POLICY "Acesso publico" ON pacientes
     FOR ALL USING (true) WITH CHECK (true);
   ```

4. Abra o `index.html` no navegador (ou use Live Server no VS Code).

## ☁️ Deploy na Vercel

1. Suba o código para o GitHub.
2. Acesse [vercel.com](https://vercel.com) → **New Project**.
3. Importe o repositório do GitHub.
4. Clique em **Deploy** (sem configuração adicional).

A Vercel detecta automaticamente o `vercel.json` e faz o deploy como site estático.

## 📄 Licença

MIT — uso livre para fins educacionais.
