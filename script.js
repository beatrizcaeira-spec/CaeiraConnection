const fone = "5584998512763";

const planos = [
  { id: 1, nome: "350 Megas", preco: 70 },
  { id: 2, nome: "500 Megas", preco: 80 },
  { id: 3, nome: "650 Megas", preco: 90 },
  { id: 4, nome: "750 Megas", preco: 100, destaque: true },
  { id: 5, nome: "800 Megas", preco: 120 },
  { id: 6, nome: "1 Giga", preco: 140 },
];

let carrinho = {};
let desconto = 0;
let contratoAceito = false;

/* ==============================
   INICIALIZAÇÃO DOS PLANOS
================================ */
const grid = document.getElementById("grid-itens");

planos.forEach(p => {
  grid.innerHTML += `
    <div class="card ${p.destaque ? "featured" : ""}">
      ${p.destaque ? '<div class="badge-mais-vendido">🏆 PLANO RECOMENDADO</div>' : ""}
      <h3>${p.nome}</h3>
      <div class="preco-card">R$ ${p.preco},00 <span>/mês</span></div>
      <ul class="beneficios">
        <li>✅ Wi-Fi 5G de alta performance</li>
        <li>✅ Instalação Grátis</li>
        <li>✅ Suporte 24 horas</li>
      </ul>
      <button class="btn-select" onclick="add(${p.id})">CONTRATAR AGORA</button>
    </div>
  `;
});

/* ==============================
   CONTROLE DO CARRINHO
================================ */
function abrirCarrinho() {
  document.body.classList.add("sidebar-active");
  document.body.style.overflow = "hidden";
  renderCart();
}

function fecharCarrinho() {
  document.body.classList.remove("sidebar-active");
  document.body.style.overflow = "";
  voltarParaEtapa1();
}

function add(id) {
  const plano = planos.find(p => p.id === id);

  if (carrinho[id]) {
    carrinho[id].qtd++;
  } else {
    carrinho[id] = { ...plano, qtd: 1 };
  }

  abrirCarrinho();
}

/* ==============================
   ALTERAÇÃO DE QUANTIDADE
================================ */
function alterarQtd(id, delta) {
  carrinho[id].qtd += delta;
  if (carrinho[id].qtd <= 0) delete carrinho[id];
  renderCart();
}

/* ==============================
   CUPOM
================================ */
function aplicarCupom() {
  const cupom = document.getElementById("cupom-input").value.toUpperCase();
  const msg = document.getElementById("msg-cupom");

  if (cupom === "CONECTA10") {
    desconto = 0.10;
    msg.innerText = "✅ Cupom CONECTA10 aplicado (10% OFF)";
    msg.style.color = "green";
  } else {
    desconto = 0;
    msg.innerText = "❌ Cupom inválido";
    msg.style.color = "red";
  }

  renderCart();
}

/* ==============================
   RENDER DO CARRINHO
================================ */
function renderCart() {
  const area = document.getElementById("cart-area");
  const total = document.getElementById("cart-total");
  const badge = document.getElementById("badge-count");

  area.innerHTML = "";

  let soma = 0;
  let qtdTotal = 0;

  for (let id in carrinho) {
    const item = carrinho[id];
    soma += item.preco * item.qtd;
    qtdTotal += item.qtd;

    area.innerHTML += `
      <div class="cart-item">
        <div>
          <div style="font-weight:900; font-size:14px;">${item.nome}</div>
          <div style="font-size:12px; color:#666;">Caeira Connection Fibra</div>
        </div>
        <div class="qty-box">
          <button onclick="alterarQtd(${id}, -1)">-</button>
          <span>${item.qtd}</span>
          <button onclick="alterarQtd(${id}, 1)">+</button>
        </div>
      </div>
    `;
  }

  if (qtdTotal === 0) {
    area.innerHTML = "<p style='text-align:center; padding:20px;'>Sua sacola está vazia.</p>";
  }

  const valorFinal = soma - (soma * desconto);
  total.innerText = `R$ ${valorFinal.toFixed(2)}`;
  badge.innerText = qtdTotal;
}

/* ==============================
   ETAPAS DO CHECKOUT
================================ */
function irParaEtapa2() {
  if (Object.keys(carrinho).length === 0) {
    document.getElementById("cart-area").innerHTML =
      "<p style='text-align:center; color:red;'>Selecione um plano primeiro.</p>";
    return;
  }

  if (!nome.value || !rua.value) {
    document.getElementById("cart-area").innerHTML =
      "<p style='text-align:center; color:red;'>Preencha nome e endereço.</p>";
    return;
  }

  document.getElementById("etapa-1").style.display = "none";
  document.getElementById("etapa-2").style.display = "block";
  document.getElementById("titulo-etapa").innerText = "Finalizar Pedido";
}

function voltarParaEtapa1() {
  document.getElementById("etapa-1").style.display = "block";
  document.getElementById("etapa-2").style.display = "none";
  document.getElementById("titulo-etapa").innerText = "Sua Sacola";
}

/* ==============================
   CONTRATO
================================ */
function abrirContrato() {
  document.getElementById("modal-contrato").style.display = "flex";
  document.body.style.overflow = "hidden";
}

function aceitarContrato() {
  contratoAceito = true;

  document.getElementById("modal-contrato").style.display = "none";
  document.body.style.overflow = "";

  document.getElementById("status-contrato").innerText =
    "✅ CONTRATO ACEITO PELO CLIENTE";
  document.getElementById("status-contrato").style.color = "green";

  const btn = document.getElementById("btn-finalizar");
  btn.disabled = false;
  btn.className = "btn-enviar-final";
}

/* ==============================
   ENVIO WHATSAPP
================================ */
function enviarWhatsApp() {
  const nome = document.getElementById("nome").value;
  const rua = document.getElementById("rua").value;
  const pag = document.getElementById("pagamento-select").value;
  const rot = document.querySelector('input[name="roteador"]:checked').value;

  let msg = `🚀 *NOVA ADESÃO - CAEIRA CONNECTION* 🚀\n`;
  msg += `──────────────────────────\n`;
  msg += `👤 *CLIENTE:* ${nome.toUpperCase()}\n`;
  msg += `📍 *ENDEREÇO:* ${rua}\n`;
  msg += `💳 *PAGAMENTO:* ${pag}\n`;
  msg += `📡 *ROTEADOR PRÓPRIO:* ${rot}\n`;
  msg += `──────────────────────────\n`;
  msg += `📦 *PLANO SELECIONADO:*\n`;

  for (let id in carrinho) {
    msg += `✅ ${carrinho[id].nome} (x${carrinho[id].qtd})\n`;
  }

  msg += `\n📑 *CONTRATO:* Fidelidade 12 Meses (Aceito pelo cliente via sistema)\n`;
  msg += `💰 *VALOR TOTAL:* ${document.getElementById("cart-total").innerText}\n`;
  msg += `──────────────────────────`;

  window.location.href = `https://wa.me/${fone}?text=${encodeURIComponent(msg)}`;
}

/* ==============================
   PROTEÇÃO MOBILE (ROTACÃO)
================================ */
window.addEventListener("resize", () => {
  if (
    document.body.classList.contains("sidebar-active") ||
    document.getElementById("modal-contrato").style.display === "flex"
  ) {
    document.body.style.overflow = "hidden";
  }
});
