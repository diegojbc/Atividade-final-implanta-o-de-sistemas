/**
 * supabaseClient.js
 * Configuração da conexão com o Supabase (PostgreSQL em nuvem).
 *
 * INSTRUÇÕES:
 *  1. Acesse https://supabase.com e faça login.
 *  2. Crie um projeto (ex: "clinica-pacientes").
 *  3. Vá em Project Settings → API.
 *  4. Copie a "Project URL" e a "anon public key".
 *  5. Cole os valores nas constantes abaixo.
 *  6. Execute o SQL abaixo no SQL Editor do Supabase:
 *
 *     CREATE TABLE pacientes (
 *       id        BIGSERIAL PRIMARY KEY,
 *       nome      TEXT NOT NULL,
 *       celular   TEXT NOT NULL,
 *       email     TEXT NOT NULL,
 *       criado_em TIMESTAMPTZ DEFAULT NOW()
 *     );
 *
 *     -- Habilitar RLS e criar política pública de leitura/escrita (para demo)
 *     ALTER TABLE pacientes ENABLE ROW LEVEL SECURITY;
 *     CREATE POLICY "Acesso publico" ON pacientes
 *       FOR ALL USING (true) WITH CHECK (true);
 */

const SUPABASE_URL  = 'https://SEU-PROJETO.supabase.co';   // ← substitua
const SUPABASE_ANON = 'SUA-ANON-KEY';                       // ← substitua

// Inicialização do cliente Supabase (via CDN UMD carregado inline)
const { createClient } = supabase;
const supabaseClient   = createClient(SUPABASE_URL, SUPABASE_ANON);
