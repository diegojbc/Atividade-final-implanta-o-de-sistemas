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

const SUPABASE_URL = 'https://sbdnustznmhwuvewuyhc.supabase.co/rest/v1/';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNiZG51c3R6bm1od3V2ZXd1eWhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg2MTIwMzMsImV4cCI6MjA5NDE4ODAzM30.YFG_JbbzmD_jp53spxgnZrrP0YUwGOgVO9wOqiRD_uY';


// Inicialização do cliente Supabase (via CDN UMD carregado inline)
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON);
