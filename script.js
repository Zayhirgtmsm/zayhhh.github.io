// Ano automático no rodapé
const anoEl = document.getElementById("ano");
if (anoEl) {
  anoEl.textContent = new Date().getFullYear();
}

// Menu do celular: abre e fecha ao clicar no botão
const botao = document.querySelector(".menu-botao");
const menu = document.getElementById("menu");
if (botao && menu) {
  botao.addEventListener("click", () => {
    const aberto = menu.classList.toggle("aberto");
    botao.setAttribute("aria-expanded", aberto);
  });
  menu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      menu.classList.remove("aberto");
      botao.setAttribute("aria-expanded", "false");
    }
  });
}

// Carrossel de produtos
const lista = document.getElementById("carrossel-lista");
const botaoAnterior = document.getElementById("carrossel-ant");
const botaoProximo = document.getElementById("carrossel-prox");
const carrossel = document.querySelector(".carrossel");
if (lista && botaoAnterior && botaoProximo && carrossel) {
  let posicao = 0;

  function moverCarrossel() {
    const item = lista.children[0];
    const larguraItem = item.getBoundingClientRect().width + 24;
    lista.style.transform = `translateX(${-posicao * larguraItem}px)`;
  }

  function proximoProduto() {
    const porTela = window.innerWidth <= 700 ? 1 : 3;
    const maximo = lista.children.length - porTela;
    posicao = posicao >= maximo ? 0 : posicao + 1;
    moverCarrossel();
  }

  botaoProximo.addEventListener("click", proximoProduto);

  botaoAnterior.addEventListener("click", () => {
    const porTela = window.innerWidth <= 700 ? 1 : 3;
    const maximo = lista.children.length - porTela;
    posicao = posicao <= 0 ? maximo : posicao - 1;
    moverCarrossel();
  });

  window.addEventListener("resize", moverCarrossel);

  // Troca automática: avança sozinho a cada 4 segundos
  let autoTocar = setInterval(proximoProduto, 4000);

  // Pausa quando o mouse está em cima, para dar tempo de ler
  carrossel.addEventListener("mouseenter", () => clearInterval(autoTocar));
  carrossel.addEventListener("mouseleave", () => {
    autoTocar = setInterval(proximoProduto, 4000);
  });
}

// Encolhe a logo ao rolar a página, deixando só o menu fixo no topo
const sentinela = document.getElementById("sentinela-topo");
const topo = document.querySelector(".topo");
if (sentinela && topo) {
  const observador = new IntersectionObserver(([entrada]) => {
    topo.classList.toggle("rolou", !entrada.isIntersecting);
  });
  observador.observe(sentinela);
}

// Aviso de cookies: aparece até o visitante aceitar
const cookies = document.getElementById("cookies");
const aceitarBtn = document.getElementById("aceitar");
if (cookies && aceitarBtn) {
  let aceitou = false;
  try { aceitou = localStorage.getItem("cookies-ok") === "1"; } catch (e) {}
  if (!aceitou) cookies.classList.add("visivel");
  aceitarBtn.addEventListener("click", () => {
    cookies.classList.remove("visivel");
    try { localStorage.setItem("cookies-ok", "1"); } catch (e) {}
  });
}

// Formulário de contato: mostra campos diferentes para orçamento x currículo
const formContato = document.getElementById("form-contato");
const motivoSelect = document.getElementById("motivo");
const campoOrcamento = document.getElementById("campo-orcamento");
const campoCurriculo = document.getElementById("campo-curriculo");
if (formContato && motivoSelect && campoOrcamento && campoCurriculo) {
  function atualizarCampos() {
    const ehEmprego = motivoSelect.value === "emprego";
    campoCurriculo.classList.toggle("oculto", !ehEmprego);
    campoOrcamento.classList.toggle("oculto", ehEmprego);
    document.getElementById("mensagem").required = !ehEmprego;
  }
  motivoSelect.addEventListener("change", atualizarCampos);
  atualizarCampos(); // aplica o estado certo assim que a página carrega

  // Botão "Enviar pelo WhatsApp": monta a mensagem com os dados preenchidos
  const btnWhatsapp = document.getElementById("btn-whatsapp");
  const numeroWhatsapp = "555198778110"; // número da empresa, sem espaços, traços ou o "+"

  if (btnWhatsapp) {
    btnWhatsapp.addEventListener("click", () => {
      const nome = document.getElementById("nome").value.trim();
      const email = document.getElementById("email-contato").value.trim();
      const telefone = document.getElementById("telefone").value.trim();
      const ehEmprego = motivoSelect.value === "emprego";

      let texto = `Olá! Meu nome é ${nome || "[nome não informado]"}.\n`;
      texto += `E-mail: ${email || "não informado"}\n`;
      if (telefone) texto += `Telefone: ${telefone}\n`;

      if (ehEmprego) {
        const cargo = document.getElementById("cargo").value.trim();
        texto += `Motivo: Trabalhe conosco\n`;
        if (cargo) texto += `Vaga de interesse: ${cargo}\n`;
        texto += `\n(Vou anexar meu currículo nesta conversa.)`;
      } else {
        const mensagem = document.getElementById("mensagem").value.trim();
        texto += `Motivo: Solicitar orçamento\n`;
        if (mensagem) texto += `\nMensagem: ${mensagem}`;
      }

      const link = `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(texto)}`;
      window.open(link, "_blank");
    });
  }
}