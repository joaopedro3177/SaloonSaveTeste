let agendamentos = [];
let agendaIdAtual = 1;

const agendaTimeline = document.getElementById('agendaTimeline');
const agendaResumo = document.getElementById('agendaResumo');
const agendaCount = document.getElementById('agendaCount');
const agendaModal = document.getElementById('agendaModal');
const agendaForm = document.getElementById('agendaForm');
const agendaModalTitle = document.getElementById('agendaModalTitle');

const agenId = document.getElementById('agenId');
const agenData = document.getElementById('agenData');
const agenHora = document.getElementById('agenHora');
const agenCliente = document.getElementById('agenCliente');
const agenFuncionario = document.getElementById('agenFuncionario');
const agenServico = document.getElementById('agenServico');
const agenStatus = document.getElementById('agenStatus');
const agenObservacoes = document.getElementById('agenObservacoes');

function capitalizarStatus(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function ordenarAgendamentos() {
  agendamentos.sort((a, b) => {
    const dataA = `${a.agen_data}T${a.agen_hora}`;
    const dataB = `${b.agen_data}T${b.agen_hora}`;
    return dataA.localeCompare(dataB);
  });
}

// 🔥 CARREGAR DO BANCO
async function carregarAgendamentos() {
  try {
    const response = await fetch("http://localhost:3000/agendamentos");
    const dados = await response.json();

    agendamentos = dados;
    renderizarAgenda();
  } catch (error) {
    console.error("Erro ao carregar:", error);
  }
}

function renderizarAgenda() {
  ordenarAgendamentos();
  agendaTimeline.innerHTML = '';

  if (agendamentos.length === 0) {
    agendaTimeline.innerHTML = `<div class="agenda-empty">Nenhum agendamento cadastrado.</div>`;
    agendaResumo.innerHTML = `
      <li><strong>Atendimentos</strong> <span>0</span></li>
      <li><strong>Primeiro horario</strong> <span>-</span></li>
      <li><strong>Ultimo horario</strong> <span>-</span></li>
      <li><strong>Status geral</strong> <span>Sem registros</span></li>
    `;
    agendaCount.textContent = '0 agendamentos';
    return;
  }

  agendamentos.forEach((item) => {
    const article = document.createElement('article');
    article.className = 'agenda-item';
    article.innerHTML = `
      <span class="agenda-hour">${item.agen_hora}</span>
      <div>
        <h3>${item.cliente_nome}</h3>
        <p>${item.serv_nome}</p>
        <div class="agenda-meta">
          <span class="agenda-chip"><i class="fas fa-user-tie"></i> ${item.funcionario_nome}</span>
          <span class="agenda-chip"><i class="fas fa-calendar"></i> ${item.agen_data}</span>
          ${item.agen_observacoes ? `<span class="agenda-chip"><i class="fas fa-note-sticky"></i> ${item.agen_observacoes}</span>` : ''}
        </div>
      </div>
      <span class="status-pill ${item.agen_status}">${capitalizarStatus(item.agen_status)}</span>
      <div class="agenda-actions">
        <button type="button" onclick="editarAgendamento(${item.agen_id})">
          <i class="fas fa-pen"></i>
        </button>
        <button type="button" class="btn-delete" onclick="removerAgendamento(${item.agen_id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;
    agendaTimeline.appendChild(article);
  });

  const primeiro = agendamentos[0];
  const ultimo = agendamentos[agendamentos.length - 1];
  const pendentes = agendamentos.filter((item) => item.agen_status === 'pendente').length;

  agendaResumo.innerHTML = `
    <li><strong>Atendimentos</strong> <span>${agendamentos.length}</span></li>
    <li><strong>Primeiro horario</strong> <span>${primeiro.agen_hora}</span></li>
    <li><strong>Ultimo horario</strong> <span>${ultimo.agen_hora}</span></li>
    <li><strong>Pendentes</strong> <span>${pendentes}</span></li>
  `;

  agendaCount.textContent = `${agendamentos.length} agendamentos`;
}

function abrirAgendaModal() {
  agendaModal.classList.add('active');
}

function fecharAgendaModal() {
  agendaModal.classList.remove('active');
  agendaForm.reset();
  agenId.value = '';
  agendaModalTitle.textContent = 'Novo agendamento';
}

function preencherFormulario(item) {
  agenId.value = item.agen_id;
  agenData.value = item.agen_data;
  agenHora.value = item.agen_hora;
  agenCliente.value = item.cliente_nome;
  agenFuncionario.value = item.funcionario_nome;
  agenServico.value = item.serv_nome;
  agenStatus.value = item.agen_status;
  agenObservacoes.value = item.agen_observacoes || '';
}

window.editarAgendamento = (id) => {
  const item = agendamentos.find((agendamento) => agendamento.agen_id === id);
  if (!item) return;

  agendaModalTitle.textContent = 'Editar agendamento';
  preencherFormulario(item);
  abrirAgendaModal();
};

window.removerAgendamento = async (id) => {
  if(!confirm("Tem certeza que deseja excluir este agendamento?")) return;
  try {
    const response = await fetch(`http://localhost:3000/agendamentos/${id}`, {
      method: "DELETE"
    });


    if(response.ok) {
      agendamentos = agendamentos.filter((agendamento) => agendamento.agen_id !== id);
      renderizarAgenda();
      console.log(`Agendamento ${id} removido com sucesso`);
    } else {
      alert("Não foi possível excluir o agendamento no banco de dados.");
    }
    } catch (error) {
      console.error("Erro ao deletar:", error);
      alert("Erro de conexão com o servidor.");
  }

  
};

document.getElementById('openAgendaModal').addEventListener('click', abrirAgendaModal);
document.getElementById('closeAgendaModal').addEventListener('click', fecharAgendaModal);
document.getElementById('cancelAgendaBtn').addEventListener('click', fecharAgendaModal);

agendaModal.addEventListener('click', (event) => {
  if (event.target === agendaModal) {
    fecharAgendaModal();
  }
});



agendaForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const dados = {
    agen_data: agenData.value,
    agen_hora: agenHora.value,
    cliente_nome: agenCliente.value,
    funcionario_nome: agenFuncionario.value,
    serv_nome: agenServico.value,
    agen_status: agenStatus.value,
    agen_observacoes: agenObservacoes.value
  };

  try {
    if (agenId.value) {
      // UPDATE
      await fetch(`http://localhost:3000/agendamentos/${agenId.value}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
      });
    } else {
      // CREATE
      await fetch("http://localhost:3000/agendamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(dados)
      });
    }

    carregarAgendamentos();
  } catch (error) { 
    console.error("Erro ao salvar:", error);
  }

  fecharAgendaModal();
});

// 🔥 INICIA CARREGANDO DO BANCO
carregarAgendamentos(); 