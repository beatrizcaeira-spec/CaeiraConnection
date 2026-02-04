const produtos = [
    { nome: "350 Megas", preco: 70.00 },
    { nome: "500 Megas", preco: 80.00 },
    { nome: "650 Megas", preco: 90.00 },
    { nome: "750 Megas", preco: 100.00 },
    { nome: "800 Megas", preco: 120.00 },
    { nome: "1 Giga", preco: 140.00 }
];

let carrinho = [];

// Carregar Itens
const grid = document.getElementById('grid-itens');
produtos.forEach(p => {
    grid.innerHTML += `
        <div class="card-item">
            <small>FIBRA CONNECTION</small>
            <h3>${p.nome}</h3>
            <p>R$ ${p.preco.toFixed(2)}</p>
            <button class="btn-add" onclick="adicionar('${p.nome}', ${p.preco})">Adicionar</button>
        </div>
    `;
});

function adicionar(nome, preco) {
    carrinho.push({ nome, preco });
    atualizarCarrinho();
}

function atualizarCarrinho() {
    const lista = document.getElementById('cart-content');
    const totalTxt = document.getElementById('cart-total');
    const countTxt = document.getElementById('cart-count');
    
    lista.innerHTML = "";
    let soma = 0;

    carrinho.forEach(item => {
        soma += item.preco;
        lista.innerHTML += `
            <div class="item-row">
                <span>${item.nome}</span>
                <strong>R$ ${item.preco.toFixed(2)}</strong>
            </div>
        `;
    });

    countTxt.innerText = carrinho.length;
    totalTxt.innerText = `R$ ${soma.toFixed(2)}`;
}

function finalizarPedido() {
    const nome = document.getElementById('nome').value;
    const end = document.getElementById('endereco').value;

    if (carrinho.length === 0) return alert("Selecione um plano!");
    if (!nome || !end) return alert("Preencha seus dados!");

    // Lógica WHILE solicitada
    let confirmado = false;
    while (!confirmado) {
        let resp = confirm(`Confirmar contratação para ${nome}?`);
        if (resp) {
            confirmado = true;
        } else {
            return;
        }
    }

    exibirResumo(nome, end);
}

function exibirResumo(nome, end) {
    const modal = document.getElementById('modal-final');
    const resumo = document.getElementById('resumo-detalhado');
    
    let total = carrinho.reduce((acc, cur) => acc + cur.preco, 0);

    resumo.innerHTML = `
        <p><strong>Titular:</strong> ${nome}</p>
        <p><strong>Local:</strong> ${end}</p>
        <hr>
        <p>Plano(s): ${carrinho.length}</p>
        <h3>Total: R$ ${total.toFixed(2)}</h3>
    `;

    modal.style.display = "flex";
}