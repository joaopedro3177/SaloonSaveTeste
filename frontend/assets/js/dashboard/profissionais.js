let profissionais = [];
let proIndexToDelete = null;
const deleteModal = document.getElementById('deleteModal');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const cancelDeleteBtn = document.getElementById('cancelDelete');
const grid = document.getElementById('profissionaisGrid');
const modal = document.getElementById('modalOverlay');
const form = document.getElementById('proForm');
const dayButtons = document.querySelectorAll('.day-btn');

dayButtons.forEach(btn => {
    btn.onclick = (e) => {
        e.preventDefault();
        btn.classList.toggle('active');
    };
});

function renderizar() {
    grid.innerHTML = '';
    const diasSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'];

    if (profissionais.length === 0) {
        grid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-user-slash"></i>
                <p>Nenhum profissional cadastrado.</p>
                <span>Adicione colaboradores para gerir a sua equipe.</span>
            </div>`;
        document.getElementById('proCount').innerText = "0 profissionais";
        return;
    }

    profissionais.forEach((pro, index) => {
        const diasHTML = diasSemana.map(dia => {
            const ativo = pro.dias.includes(dia);
            return `<span class="day-tag ${ativo ? 'active' : ''}">${dia}</span>`;
        }).join('');

        const card = document.createElement('div');
        card.className = 'pro-card';
        card.innerHTML = `
            <div class="pro-header">
                <div class="avatar">${pro.nome.charAt(0).toUpperCase()}</div>
                <div class="pro-title">
                    <h3>${pro.nome}</h3>
                    <span class="badge">${pro.cargo || 'Sem especialidade'}</span>
                </div>
                <div class="pro-actions">
                    <button onclick="editar(${index})"><i class="fas fa-edit"></i></button>
                    <button onclick="remover(${index})" class="btn-del"><i class="fas fa-trash"></i></button>
                </div>
            </div>
            <div class="pro-details">
                <p><i class="fas fa-phone"></i> ${pro.tel || 'Telefone nao informado'}</p>
                <p><i class="fas fa-envelope"></i> ${pro.email || 'E-mail nao informado'}</p>
                <p><i class="fas fa-percentage"></i> ${pro.comissao}% de comissao</p>
                <div class="work-days">
                    ${diasHTML}
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    document.getElementById('proCount').innerText = `${profissionais.length} profissionais`;
}

form.onsubmit = (e) => {
    e.preventDefault();
    const index = document.getElementById('editIndex').value;
    const selecionados = [];
    document.querySelectorAll('.day-btn.active').forEach(btn => selecionados.push(btn.innerText));

    const dados = {
        nome: document.getElementById('nomePro').value,
        tel: document.getElementById('telPro').value,
        email: document.getElementById('emailPro').value,
        cargo: document.getElementById('cargoPro').value,
        comissao: document.getElementById('comissaoPro').value,
        dias: selecionados
    };

    if (index === "") profissionais.push(dados);
    else profissionais[index] = dados;

    fecharModal();
    renderizar();
};

function fecharModal() {
    modal.classList.remove('active');
    form.reset();
    document.getElementById('editIndex').value = "";
    dayButtons.forEach(btn => btn.classList.remove('active'));
}

function editar(index) {
    const pro = profissionais[index];
    document.getElementById('modalTitle').innerText = "Editar Profissional";
    document.getElementById('nomePro').value = pro.nome;
    document.getElementById('telPro').value = pro.tel;
    document.getElementById('emailPro').value = pro.email || '';
    document.getElementById('cargoPro').value = pro.cargo;
    document.getElementById('comissaoPro').value = pro.comissao;
    document.getElementById('editIndex').value = index;

    dayButtons.forEach(btn => {
        if (pro.dias.includes(btn.innerText)) btn.classList.add('active');
    });

    modal.classList.add('active');
}

function remover(index) {
    proIndexToDelete = index;
    deleteModal.classList.add('active');
}

cancelDeleteBtn.onclick = () => {
    deleteModal.classList.remove('active');
    proIndexToDelete = null;
};

confirmDeleteBtn.onclick = () => {
    if (proIndexToDelete !== null) {
        profissionais.splice(proIndexToDelete, 1);
        renderizar();
        deleteModal.classList.remove('active');
        proIndexToDelete = null;
    }
};

deleteModal.onclick = (e) => {
    if (e.target === deleteModal) {
        deleteModal.classList.remove('active');
    }
};


document.getElementById('openModal').onclick = () => {
    document.getElementById('modalTitle').innerText = "Novo profissional";
    modal.classList.add('active');
};
document.getElementById('closeModal').onclick = fecharModal;
document.getElementById('cancelBtn').onclick = fecharModal;

renderizar();
