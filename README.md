# Sistema de Cadastro de Pacientes

Sistema web completo para digitalização e organização de fichas de pacientes em clínicas médicas, garantindo um acesso rápido, responsivo e seguro.

## 🛠 Tecnologias

| Camada | Tecnologia |
|---|---|
| **Frontend** | HTML5 + CSS3 + JavaScript (Vanilla) |
| **Banco de Dados** | PostgreSQL gerenciado via [Supabase](https://supabase.com) |
| **Hospedagem** | [Vercel](https://vercel.com) |
| **Controle de Versão**| Git + GitHub |

## 📋 Funcionalidades

- ✅ **Gestão Completa (CRUD):** Cadastro, listagem, edição e exclusão de pacientes.
- ✅ **Busca Dinâmica:** Filtro em tempo real por nome, celular ou e-mail.
- ✅ **Máscaras Automáticas:** Formatação inteligente de celular durante a digitação.
- ✅ **Validações:** Validação de formato de e-mail e quantidade de caracteres.
- ✅ **UX/UI Profissional:** Interface clean, minimalista e responsiva (mobile-first) inspirada em padrões modernos.
- ✅ **Feedback Visual:** Notificações flutuantes (toasts) para sucesso e erros, e modais de confirmação.

---

## 🚀 Guia Passo a Passo: Implantação e Publicação do Sistema

Abaixo está o processo completo de implantação, desde a configuração do banco de dados até a publicação na internet para acesso público.

### Passo 1: Preparação do Banco de Dados (Supabase)
O Supabase atua como nosso backend (BaaS), fornecendo o banco de dados PostgreSQL e uma API pronta.

1. Acesse [supabase.com](https://supabase.com) e crie uma conta.
2. Clique em **"New Project"**, defina um nome, senha segura para o banco e a região (ex: South America - São Paulo).
3. Após o projeto ser provisionado, acesse o **SQL Editor** no menu lateral esquerdo.
4. Execute o seguinte script para criar a tabela e configurar a segurança:
   ```sql
   -- Criação da tabela de pacientes
   CREATE TABLE pacientes (
     id        BIGSERIAL PRIMARY KEY,
     nome      TEXT NOT NULL,
     celular   TEXT NOT NULL,
     email     TEXT NOT NULL,
     criado_em TIMESTAMPTZ DEFAULT NOW()
   );

   -- Habilitar a segurança em nível de linha (RLS)
   ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;

   -- Criar política de acesso público para permitir o funcionamento do frontend
   CREATE POLICY "Acesso publico" ON pacientes
     FOR ALL USING (true) WITH CHECK (true);
   ```
5. Acesse as **Project Settings** > **API**. Copie a `Project URL` e a `anon public API key`.

### Passo 2: Configuração do Projeto Local
Com o banco pronto, precisamos conectar a nossa aplicação a ele.

1. Clone o repositório para a sua máquina:
   ```bash
   git clone https://github.com/seu-usuario/clinica-pacientes.git
   cd clinica-pacientes
   ```
2. Abra o arquivo `supabaseClient.js` e insira as credenciais copiadas no passo anterior:
   ```javascript
   const SUPABASE_URL = 'https://SUA_URL_AQUI.supabase.co';
   const SUPABASE_ANON = 'SUA_CHAVE_ANON_AQUI';
   ```
3. Teste o projeto localmente rodando um servidor simples (ex: `npx serve` ou abrindo o `index.html` com o *Live Server* do VS Code). Verifique se o cadastro, a lista, a edição e a exclusão estão funcionando.

### Passo 3: Preparação para a Vercel e Controle de Versão
A Vercel hospedará os nossos arquivos estáticos e os distribuirá globalmente.

1. O projeto possui um arquivo `vercel.json` na raiz. Verifique se ele contém as rotas configuradas corretamente para evitar erros 404 (já fornecido no código).
2. Adicione e "comite" as suas alterações no Git:
   ```bash
   git add .
   git commit -m "feat: configuração inicial e integração com Supabase"
   ```
3. Envie o código para o seu repositório no GitHub:
   ```bash
   git push origin main
   ```

### Passo 4: Deploy (Publicação Final) na Vercel
A etapa final é colocar o site no ar.

1. Acesse [vercel.com](https://vercel.com) e faça login com a sua conta do GitHub.
2. Clique em **"Add New..."** > **"Project"**.
3. Localize o repositório do seu sistema na lista e clique em **"Import"**.
4. Não é necessário configurar variáveis de ambiente na Vercel (nossas chaves do Supabase são públicas e estão no `supabaseClient.js`).
5. Apenas confirme o diretório raiz e clique em **"Deploy"**.
6. Aguarde alguns segundos. A Vercel fará o build estático e irá gerar um link seguro (HTTPS).

🎉 **Pronto!** O seu sistema agora está publicado e disponível para acesso através do link fornecido pela Vercel. Qualquer alteração futura enviada para a branch `main` do GitHub será atualizada automaticamente na Vercel.

## 📄 Licença
Distribuído sob a licença MIT. Pode ser utilizado livremente para fins educacionais e comerciais.
