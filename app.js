/**
 * app.js — Lógica principal do sistema ClinCad
 * Cadastro, listagem e exclusão de pacientes via Supabase.
 */

/* ─── Estado global ─── */
let todosPacientes = [];
let idParaExcluir = null;
let nomeParaExcluir = '';

/* ─── Inicialização ─── */
/* ─── Máscara de celular ─── */
function aplicarMascaraCelular(idCampo) {
  const campo = document.getElementById(idCampo);
  if (!campo) return;
  campo.addEventListener('input', () => {
    let v = campo.value.replace(/\D/g, '').slice(0, 11);
    if (v.length > 6) v = `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
    else if (v.length > 2) v = `(${v.slice(0, 2)}) ${v.slice(2)}`;
    else if (v.length > 0) v = `(${v}`;
    campo.value = v;
  });
}

// Inicializando as máscaras para os dois campos (cadastro e edição)
document.addEventListener('DOMContentLoaded', () => {
  aplicarMascaraCelular('celular');
  aplicarMascaraCelular('editarCelular');
  carregarContador();
});

/* ─── Navegação entre seções ─── */
function showSection(secao) {
  document.getElementById('sectionCadastro').classList.toggle('hidden', secao !== 'cadastro');
  document.getElementById('sectionLista').classList.toggle('hidden', secao !== 'lista');

  document.getElementById('btnNavCadastro').classList.toggle('active', secao === 'cadastro');
  document.getElementById('btnNavLista').classList.toggle('active', secao === 'lista');

  if (secao === 'lista') carregarPacientes();
}

/* ─── Validação do formulário ─── */
function validarFormulario() {
  const nome = document.getElementById('nome').value.trim();
  const celular = document.getElementById('celular').value.trim();
  const email = document.getElementById('email').value.trim();
  let valido = true;

  // Nome
  if (nome.length < 3) {
    setErro('nome', 'Informe o nome completo (mínimo 3 caracteres).');
    valido = false;
  } else setErro('nome', '');

  // Celular — valida formato (XX) XXXXX-XXXX
  const regCelular = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  if (!regCelular.test(celular)) {
    setErro('celular', 'Formato inválido. Use (11) 99999-9999.');
    valido = false;
  } else setErro('celular', '');

  // Email
  const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regEmail.test(email)) {
    setErro('email', 'Informe um e-mail válido.');
    valido = false;
  } else setErro('email', '');

  return valido;
}

function setErro(campo, msg) {
  const input = document.getElementById(campo);
  const erro = document.getElementById(`erro${campo.charAt(0).toUpperCase() + campo.slice(1)}`);
  erro.textContent = msg;
  input.classList.toggle('invalid', !!msg);
}

/* ─── CADASTRAR paciente ─── */
document.getElementById('formPaciente').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validarFormulario()) return;

  const btn = document.getElementById('btnSalvar');
  const btnText = document.getElementById('btnSalvarText');
  btn.disabled = true;
  btnText.textContent = 'Salvando...';

  const nome = document.getElementById('nome').value.trim();
  const celular = document.getElementById('celular').value.trim();
  const email = document.getElementById('email').value.trim();

  try {
    const { error } = await supabaseClient
      .from('pacientes')
      .insert([{ nome, celular, email }]);

    if (error) throw error;

    showToast('Paciente cadastrado com sucesso!', 'success');
    resetForm();
    carregarContador();
  } catch (err) {
    console.error('Erro ao cadastrar:', err);
    showToast('Erro ao salvar: ' + (err.message || 'Verifique a conexão com o Supabase.'), 'error');
  } finally {
    btn.disabled = false;
    btnText.textContent = 'Cadastrar Paciente';
  }
});

/* ─── CARREGAR lista de pacientes ─── */
async function carregarPacientes() {
  const loadingMsg = document.getElementById('loadingMsg');
  const emptyMsg = document.getElementById('emptyMsg');
  const tabela = document.getElementById('tabelaPacientes');

  loadingMsg.classList.remove('hidden');
  emptyMsg.classList.add('hidden');
  tabela.classList.add('hidden');
  document.getElementById('tbodyPacientes').innerHTML = '';

  try {
    const { data, error } = await supabaseClient
      .from('pacientes')
      .select('*')
      .order('criado_em', { ascending: false });

    if (error) throw error;

    todosPacientes = data || [];
    renderizarTabela(todosPacientes);
    carregarContador();
  } catch (err) {
    console.error('Erro ao carregar:', err);
    showToast('Erro ao carregar pacientes: ' + (err.message || ''), 'error');
    loadingMsg.classList.add('hidden');
  }
}

/* ─── RENDERIZAR tabela ─── */
function renderizarTabela(pacientes) {
  const loadingMsg = document.getElementById('loadingMsg');
  const emptyMsg = document.getElementById('emptyMsg');
  const tabela = document.getElementById('tabelaPacientes');
  const tbody = document.getElementById('tbodyPacientes');

  loadingMsg.classList.add('hidden');
  tbody.innerHTML = '';

  if (pacientes.length === 0) {
    emptyMsg.classList.remove('hidden');
    tabela.classList.add('hidden');
    return;
  }

  emptyMsg.classList.add('hidden');
  tabela.classList.remove('hidden');

  pacientes.forEach((p, i) => {
    const data = new Date(p.criado_em);
    const dataFormatada = data.toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="td-num">${i + 1}</td>
      <td class="td-name">${escapeHtml(p.nome)}</td>
      <td class="td-phone">${escapeHtml(p.celular)}</td>
      <td class="td-email">${escapeHtml(p.email)}</td>
      <td class="td-date">${dataFormatada}</td>
      <td class="td-actions">
        <button
          class="btn-icon"
          title="Editar paciente ${escapeHtml(p.nome)}"
          aria-label="Editar paciente ${escapeHtml(p.nome)}"
          onclick="abrirModalEditar(${p.id}, '${escapeHtml(p.nome).replace(/'/g, "\\'")}', '${escapeHtml(p.celular)}', '${escapeHtml(p.email)}')"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        <button
          class="btn-icon danger"
          title="Excluir paciente ${escapeHtml(p.nome)}"
          aria-label="Excluir paciente ${escapeHtml(p.nome)}"
          onclick="abrirModalExcluir(${p.id}, '${escapeHtml(p.nome).replace(/'/g, "\\'")}')"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

/* ─── FILTRAR pacientes ─── */
function filtrarPacientes() {
  const termo = document.getElementById('busca').value.toLowerCase().trim();
  if (!termo) { renderizarTabela(todosPacientes); return; }

  const filtrados = todosPacientes.filter(p =>
    p.nome.toLowerCase().includes(termo) ||
    p.celular.toLowerCase().includes(termo) ||
    p.email.toLowerCase().includes(termo)
  );
  renderizarTabela(filtrados);
}

/* ─── MODAL de exclusão ─── */
function abrirModalExcluir(id, nome) {
  idParaExcluir = id;
  nomeParaExcluir = nome;
  document.getElementById('modalNomePaciente').textContent = nome;
  document.getElementById('modalExcluir').classList.remove('hidden');
  document.getElementById('btnConfirmarExclusao').focus();
}

function fecharModal() {
  document.getElementById('modalExcluir').classList.add('hidden');
  idParaExcluir = null;
  nomeParaExcluir = '';
}

/* ─── MODAL de edição ─── */
function abrirModalEditar(id, nome, celular, email) {
  document.getElementById('editarId').value = id;
  document.getElementById('editarNome').value = nome;
  document.getElementById('editarCelular').value = celular;
  document.getElementById('editarEmail').value = email;

  // Limpa possíveis erros anteriores
  setErro('editarNome', '');
  setErro('editarCelular', '');
  setErro('editarEmail', '');

  document.getElementById('modalEditar').classList.remove('hidden');
  document.getElementById('editarNome').focus();
}

function fecharModalEditar() {
  document.getElementById('modalEditar').classList.add('hidden');
}

// Fechar modais clicando fora
document.getElementById('modalExcluir').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) fecharModal();
});
document.getElementById('modalEditar').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) fecharModalEditar();
});

/* ─── CONFIRMAR edição ─── */
function validarEdicao() {
  const nome = document.getElementById('editarNome').value.trim();
  const celular = document.getElementById('editarCelular').value.trim();
  const email = document.getElementById('editarEmail').value.trim();
  let valido = true;

  if (nome.length < 3) {
    setErro('editarNome', 'Informe o nome completo (mínimo 3 caracteres).');
    valido = false;
  } else setErro('editarNome', '');

  const regCelular = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
  if (!regCelular.test(celular)) {
    setErro('editarCelular', 'Formato inválido. Use (11) 99999-9999.');
    valido = false;
  } else setErro('editarCelular', '');

  const regEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regEmail.test(email)) {
    setErro('editarEmail', 'Informe um e-mail válido.');
    valido = false;
  } else setErro('editarEmail', '');

  return valido;
}

document.getElementById('formEditar').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validarEdicao()) return;

  const btn = document.getElementById('btnSalvarEditar');
  const btnText = document.getElementById('btnSalvarEditarText');
  btn.disabled = true;
  btnText.textContent = 'Salvando...';

  const id = document.getElementById('editarId').value;
  const nome = document.getElementById('editarNome').value.trim();
  const celular = document.getElementById('editarCelular').value.trim();
  const email = document.getElementById('editarEmail').value.trim();

  try {
    const { error } = await supabaseClient
      .from('pacientes')
      .update({ nome, celular, email })
      .eq('id', id);

    if (error) throw error;

    showToast('Paciente atualizado com sucesso!', 'success');
    fecharModalEditar();
    carregarPacientes();
  } catch (err) {
    console.error('Erro ao atualizar:', err);
    showToast('Erro ao atualizar: ' + (err.message || 'Verifique a conexão.'), 'error');
  } finally {
    btn.disabled = false;
    btnText.textContent = 'Salvar Alterações';
  }
});

/* ─── CONFIRMAR exclusão ─── */
async function confirmarExclusao() {
  if (!idParaExcluir) return;

  const btn = document.getElementById('btnConfirmarExclusao');
  btn.disabled = true;
  btn.textContent = 'Excluindo...';

  try {
    const { error } = await supabaseClient
      .from('pacientes')
      .delete()
      .eq('id', idParaExcluir);

    if (error) throw error;

    fecharModal();
    showToast(`Paciente "${nomeParaExcluir}" excluído com sucesso.`, 'success');
    carregarPacientes();
  } catch (err) {
    console.error('Erro ao excluir:', err);
    showToast('Erro ao excluir: ' + (err.message || ''), 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = 'Excluir';
  }
}

/* ─── CONTADOR de pacientes ─── */
async function carregarContador() {
  try {
    const { count } = await supabaseClient
      .from('pacientes')
      .select('*', { count: 'exact', head: true });

    const el = document.getElementById('totalPacientes');
    if (el) animarContador(el, parseInt(el.textContent) || 0, count || 0);
  } catch (_) { /* silencioso */ }
}

function animarContador(el, inicio, fim) {
  const duracao = 600;
  const inicio_ = performance.now();
  requestAnimationFrame(function tick(agora) {
    const progresso = Math.min((agora - inicio_) / duracao, 1);
    el.textContent = Math.floor(inicio + (fim - inicio) * easeOut(progresso));
    if (progresso < 1) requestAnimationFrame(tick);
  });
}
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }

/* ─── LIMPAR formulário ─── */
function resetForm() {
  document.getElementById('formPaciente').reset();
  ['nome', 'celular', 'email'].forEach(id => {
    setErro(id, '');
    document.getElementById(id).classList.remove('invalid');
  });
}

/* ─── TOAST de notificação ─── */
let toastTimer;
function showToast(msg, tipo = 'success') {
  const toast = document.getElementById('toast');
  const icone = tipo === 'success'
    ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`
    : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`;

  toast.className = `toast ${tipo}`;
  toast.innerHTML = icone + msg;
  toast.classList.add('show');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ─── Segurança: escapar HTML ─── */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
