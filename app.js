// ============================================
// IMESSAGE 2 — VERSÃO ATUALIZADA
// ============================================

let conversas = [];
let conversaAtual = null;
let filtroAtual = "todas";
let contactoEmEdicao = null;

const CHAVE_CONVERSAS = "imessage2_conversas";
const CHAVE_NOTIFICACOES = "imessage2_notificacoes";

const ORIGEM_IPAJ = "Transcrição fornecida pelo utilizador — não verificada";

const $ = id => document.getElementById(id);

// ============================================
// TRANSCRIÇÃO IPAJ — ONTEM E HOJE
// ============================================

const mensagensIPAJ = [
    // ONTEM — 21 MENSAGENS

    ["recebida", "Tá me bloquear né", "9:39 AM", "Ontem"],
    ["recebida", "Não há segundo processo d aumento d valor no tribunal boss, lá se assina uma vez.", "12:22", "Ontem"],
    ["recebida", "Às 07hr não vou conseguir chegar no IPAJ,às 08hr sim", "2:28 PM", "Ontem"],
    ["enviada", "As 9preciso viajar. Entao me diz uma unica coisa.", "2:28 PM", "Ontem"],
    ["recebida", "As 08 sim", "", "Ontem"],
    ["recebida", "as 07 não vou conseguir chegar lá", "2:31 PM", "Ontem"],
    ["enviada", "Entendo. Se eu nao viajar vou perder carro, carros agora saem as 12.", "2:31", "Ontem"],
    ["recebida", "ja você pensa que vai sair que hr d IPAJ.", "", "Ontem"],
    ["recebida", "Sai d casa preparado pra viajar.", "", "Ontem"],
    ["enviada", "É pra eu vir n ipaj com pastas?", "2:36", "Ontem"],
    ["recebida", "Pelo eu sei lá começam à atender as pessoas às 08 não as 07hr,eu chego às 08hr", "2:39pm", "Ontem"],
    ["enviada", "Ipaj abre 7:30. Boss eu tou a te falar oque me falaram lá, entao se vc nao quer escutar cabe a sí.", "2:41pm", "Ontem"],
    ["recebida", "as 07 estou a me preparar.", "02:41pm", "Ontem"],
    ["recebida", "Já abrir é atender não fazem limpezas, crosse t encontro lá", "02:43pm", "Ontem"],
    ["recebida", "Né vejo a hr,de estar lá a debater sobre pensão alimentar d 1500 na frente dos doutores kkkkkkk, você me envergonha.", "4:44 PM", "Ontem"],
    ["recebida", "Se não for 5mil quero 4mil,de pensão alimentar definitiva,eu nao vou aceitar 1500, queres me dar 1500 porque bebê está na barriga,esse dinheiro devo guardar , para o caso d emergência, você tipo não pensa.", "4:52 PM", "Ontem"],
    ["recebida", "do bem ou do mal, você vai me dar dinheiro, juro, você não conhece a minha família, brinca só comigo, eu ate queria te levar ao tribunal você lá ia me dar qualquer dinheiro que eu pedir, na mesma se amanha nos não chegarmos a um acordo iremos mesmo no tribunal, daqui vc não escapa é 5000 ou 40 mil. Mesmo se eu tivesse outra pessoa, eu vou te apertar bem pra me dar dinheiro de sustentar essa criança por mais que ainda não nasci, por que vc não saiba que é teu filho ou não. Crosse, voce vai me dar dinheiro kkkkkk, tou a gostar. La tambem sempre vão me dar razão pk eu sou mulher gravida, mesmo mentindo vão me dar razão, não viste ontem quando falei de 6meses acreditaram, sempre vão acreditar em mim.", "4:55 PM", "Ontem"],
    ["recebida", "eu me da dinheiro ou vamos cortar directamente n tribunal e você vai ficar prejudicado", "4:59 PM", "Ontem"],
    ["recebida", "vc ha de ver se nao aceitar o quê estou a te falar, vai acabar mal e nao me faz eu me arrepender.", "5:03 PM", "Ontem"],
    ["recebida", "Mesmo você que não grávida né nada pode fazer ukêh com 1500", "7:17 PM", "Ontem"],
    ["recebida", "Estou a pedir vir com tigelas", "10:03", "Ontem"],

    // HOJE — 4 MENSAGENS

    ["recebida", "Ja saíste??", "6:27am", "Hoje"],
    ["recebida", "Já estou pronta peço dinheiro d chapa", "7:25am", "Hoje"],
    ["recebida", "Eu não eid aceitar mais ir lá contigo ouviste bem, você me vê tipo sou criança,eu e você vamos se encontrar no tribunal.", "8:54am", "Hoje"],
    ["recebida", "T custa nos dar pensão alimentar nos deixar afinal qual é o teu problema", "8:56am", "Hoje"]
];

// ============================================
// NOTIFICAÇÕES
// ============================================

const configuracaoPadrao = {
    ativadas: true,
    formato: "standard",
    nome: "contact",
    conteudo: "full",
    som: "default",
    estilo: "banner"
};

let configuracaoNotificacoes = {...configuracaoPadrao};

function carregarConfiguracaoNotificacoes() {
    try {
        const dados = localStorage.getItem(CHAVE_NOTIFICACOES);

        if (dados) {
            configuracaoNotificacoes = {
                ...configuracaoPadrao,
                ...JSON.parse(dados)
            };
        }
    } catch (erro) {
        console.error("Erro ao carregar notificações:", erro);
    }
}

function guardarConfiguracaoNotificacoes() {
    const ativadas = $("notificationsEnabled")?.checked ?? true;

    configuracaoNotificacoes = {
        ativadas,
        formato: $("notificationFormat")?.value || "standard",
        nome: $("notificationName")?.value || "contact",
        conteudo: $("notificationContent")?.value || "full",
        som: $("notificationSound")?.value || "default",
        estilo: $("notificationPosition")?.value || "banner"
    };

    localStorage.setItem(
        CHAVE_NOTIFICACOES,
        JSON.stringify(configuracaoNotificacoes)
    );

    atualizarPrevisualizacaoNotificacao();

    alert("Definições de notificações guardadas.");
}

function preencherConfiguracaoNotificacoes() {
    if ($("notificationsEnabled")) {
        $("notificationsEnabled").checked =
            configuracaoNotificacoes.ativadas;
    }

    if ($("notificationFormat")) {
        $("notificationFormat").value =
            configuracaoNotificacoes.formato;
    }

    if ($("notificationName")) {
        $("notificationName").value =
            configuracaoNotificacoes.nome;
    }

    if ($("notificationContent")) {
        $("notificationContent").value =
            configuracaoNotificacoes.conteudo;
    }

    if ($("notificationSound")) {
        $("notificationSound").value =
            configuracaoNotificacoes.som;
    }

    if ($("notificationPosition")) {
        $("notificationPosition").value =
            configuracaoNotificacoes.estilo;
    }

    atualizarPrevisualizacaoNotificacao();
}

function atualizarPrevisualizacaoNotificacao() {
    const elemento = $("notificationPreview");

    if (!elemento) return;

    const nome = configuracaoNotificacoes.nome === "app"
        ? "iMessage 2"
        : configuracaoNotificacoes.nome === "both"
            ? "iMessage 2 · Contacto"
            : "Contacto";

    let mensagem = "Nova mensagem recebida.";

    if (configuracaoNotificacoes.conteudo === "hidden") {
        mensagem = "Nova mensagem";
    }

    if (configuracaoNotificacoes.conteudo === "partial") {
        mensagem = "Nova mensagem recebida...";
    }

    if (!configuracaoNotificacoes.ativadas) {
        elemento.textContent = "Notificações desativadas.";
        return;
    }

    elemento.textContent = nome + " — " + mensagem;
}

function abrirNotificacoes() {
    preencherConfiguracaoNotificacoes();
    $("notificationsModal")?.classList.add("show");
}

function fecharNotificacoes() {
    $("notificationsModal")?.classList.remove("show");
}

function configurarEventosNotificacoes() {
    $("notificationsButton")?.addEventListener("click", abrirNotificacoes);
    $("closeNotifications")?.addEventListener("click", fecharNotificacoes);

    $("saveNotifications")?.addEventListener("click", () => {
        guardarConfiguracaoNotificacoes();
        fecharNotificacoes();
    });

    [
        "notificationsEnabled",
        "notificationFormat",
        "notificationName",
        "notificationContent",
        "notificationSound",
        "notificationPosition"
    ].forEach(id => {
        $(id)?.addEventListener("change", atualizarPrevisualizacaoNotificacao);
    });
}

// ============================================
// ARMAZENAMENTO
// ============================================

function guardarConversas() {
    try {
        localStorage.setItem(CHAVE_CONVERSAS, JSON.stringify(conversas));
        return true;
    } catch (erro) {
        console.error("Erro ao guardar:", erro);
        alert("Não foi possível guardar os dados.");
        return false;
    }
}

function recuperarConversas() {
    try {
        const dados = localStorage.getItem(CHAVE_CONVERSAS);

        if (dados) {
            const recuperadas = JSON.parse(dados);

            if (Array.isArray(recuperadas)) {
                conversas = recuperadas;
            }
        }
    } catch (erro) {
        console.error("Erro ao recuperar conversas:", erro);
        conversas = [];
    }

    conversas.forEach(contacto => {
        contacto.mensagens = Array.isArray(contacto.mensagens)
            ? contacto.mensagens
            : [];

        if (contacto.silenciado === undefined) contacto.silenciado = false;
        if (contacto.desconhecido === undefined) contacto.desconhecido = false;
        if (contacto.naoLidas === undefined) contacto.naoLidas = 0;

        contacto.mensagens.forEach(mensagem => {
            if (mensagem.apagada === undefined) mensagem.apagada = false;
            if (mensagem.lida === undefined) mensagem.lida = false;
        });
    });
}

// ============================================
// CONTACTOS
// ============================================

function criarContacto(nome, numero, iniciais) {
    const contacto = {
        id: Date.now() + Math.random(),
        nome,
        numero,
        iniciais,
        foto: "",
        desconhecido: false,
        silenciado: false,
        naoLidas: 0,
        mensagens: []
    };

    conversas.push(contacto);
    guardarConversas();

    return contacto;
}

function editarContacto(id, novosDados) {
    const contacto = conversas.find(c => String(c.id) === String(id));

    if (!contacto) return false;

    Object.assign(contacto, novosDados);
    guardarConversas();

    return true;
}

function iniciaisNome(nome) {
    return nome.trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(p => p.charAt(0).toUpperCase())
        .join("");
}

// ============================================
// MENSAGENS
// ============================================

function adicionarMensagem(contacto, texto, tipo, hora) {
    if (!contacto || !texto || !texto.trim()) return false;

    const mensagem = {
        id: Date.now() + Math.random(),
        texto: texto.trim(),
        tipo,
        hora: hora || horaAtual(),
        apagada: false,
        lida: tipo === "enviada",
        origem: "manual"
    };

    contacto.mensagens.push(mensagem);

    if (tipo === "recebida") {
        contacto.naoLidas = (contacto.naoLidas || 0) + 1;
    }

    guardarConversas();
    ordenarConversas();
    renderizarAplicacao();

    return mensagem;
}

function horaAtual() {
    return new Date().toLocaleTimeString("pt-PT", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

function apagarMensagem(contacto, mensagem) {
    if (!contacto || !mensagem) return false;

    mensagem.apagada = true;
    guardarConversas();
    renderizarAplicacao();

    return true;
}

function recuperarMensagem(contacto, mensagem) {
    if (!contacto || !mensagem) return false;

    mensagem.apagada = false;
    guardarConversas();
    renderizarAplicacao();

    return true;
}

function eliminarDefinitivamente(contacto, mensagem) {
    if (!contacto || !mensagem) return false;

    const indice = contacto.mensagens.indexOf(mensagem);

    if (indice === -1) return false;

    contacto.mensagens.splice(indice, 1);
    guardarConversas();
    renderizarAplicacao();

    return true;
}

function listarMensagensApagadas() {
    const resultado = [];

    conversas.forEach(contacto => {
        contacto.mensagens.forEach(mensagem => {
            if (mensagem.apagada) {
                resultado.push({contacto, mensagem});
            }
        });
    });

    return resultado;
}

function pesquisarMensagens(palavra) {
    const resultados = [];
    const pesquisa = palavra.toLowerCase().trim();

    if (!pesquisa) return resultados;

    conversas.forEach(contacto => {
        contacto.mensagens.forEach(mensagem => {
            if (!mensagem.apagada && mensagem.texto.toLowerCase().includes(pesquisa)) {
                resultados.push({contacto, mensagem});
            }
        });
    });

    return resultados;
}

// ============================================
// TRANSCRIÇÃO IPAJ
// ============================================

function importarTranscricaoIPAJ() {
    let contacto = conversas.find(c =>
        c.origem === ORIGEM_IPAJ ||
        c.tipoConversa === "transcricao_ipaj"
    );

    if (!contacto) {
        contacto = criarContacto("Contacto da transcrição", "", "CT");
        contacto.origem = ORIGEM_IPAJ;
        contacto.tipoConversa = "transcricao_ipaj";
    }

    const mensagensAntigas = contacto.mensagens || [];

    const mensagensAtualizadas = mensagensIPAJ.map((dados, indice) => {
        const id = "ipaj-" + (indice + 1);

        const antiga = mensagensAntigas.find(
            m => String(m.id) === id
        );

        return {
            id,
            tipo: dados[0],
            texto: dados[1],
            hora: dados[2],
            dia: dados[3],
            apagada: antiga ? antiga.apagada : false,
            lida: antiga ? antiga.lida : true,
            origem: "ipaj"
        };
    });

    // Preserva mensagens manuais e evita duplicar a transcrição.

    const mensagensManuais = mensagensAntigas.filter(m =>
        m.origem !== "ipaj" &&
        !String(m.id).startsWith("ipaj-")
    );

    contacto.mensagens = [
        ...mensagensAtualizadas,
        ...mensagensManuais
    ];

    contacto.origem = ORIGEM_IPAJ;
    contacto.tipoConversa = "transcricao_ipaj";

    guardarConversas();

    return contacto;
}

// ============================================
// ORDENAR CONVERSAS
// ============================================

function ordenarConversas() {
    conversas.sort((a, b) => {
        const ultimaA = a.mensagens.length
            ? a.mensagens[a.mensagens.length - 1].id
            : a.id;

        const ultimaB = b.mensagens.length
            ? b.mensagens[b.mensagens.length - 1].id
            : b.id;

        return String(ultimaB).localeCompare(
            String(ultimaA),
            undefined,
            {numeric: true}
        );
    });

    guardarConversas();
}

// ============================================
// AVATARES
// ============================================

function criarAvatar(contacto, tamanhoExtra = "") {
    const avatar = document.createElement("div");
    avatar.className = "avatar " + tamanhoExtra;

    if (contacto.foto) {
        const imagem = document.createElement("img");
        imagem.src = contacto.foto;
        imagem.alt = contacto.nome;
        avatar.appendChild(imagem);
    } else {
        avatar.textContent = contacto.iniciais || iniciaisNome(contacto.nome);
    }

    return avatar;
}

// ============================================
// LISTA DE CONVERSAS
// ============================================

function obterPrevia(contacto) {
    const mensagens = contacto.mensagens.filter(m => !m.apagada);

    if (!mensagens.length) return "Nenhuma mensagem";

    const ultima = mensagens[mensagens.length - 1];

    return (ultima.tipo === "enviada" ? "Tu: " : "") + ultima.texto;
}

function obterHora(contacto) {
    const mensagens = contacto.mensagens.filter(m => !m.apagada);

    if (!mensagens.length) return "";

    return mensagens[mensagens.length - 1].hora || "";
}

function renderizarListaConversas() {
    const lista = $("conversationList");

    if (!lista) return;

    lista.innerHTML = "";

    let filtradas = [...conversas];

    if (filtroAtual === "desconhecidos") {
        filtradas = filtradas.filter(c => c.desconhecido);
    }

    if (filtroAtual === "silenciados") {
        filtradas = filtradas.filter(c => c.silenciado);
    }

    const pesquisa = $("search")?.value.toLowerCase().trim() || "";

    if (pesquisa) {
        filtradas = filtradas.filter(c =>
            c.nome.toLowerCase().includes(pesquisa) ||
            (c.numero || "").toLowerCase().includes(pesquisa) ||
            c.mensagens.some(m =>
                !m.apagada && m.texto.toLowerCase().includes(pesquisa)
            )
        );
    }

    if (!filtradas.length) {
        const vazio = document.createElement("div");
        vazio.className = "empty";
        vazio.textContent = "Nenhuma conversa encontrada.";
        lista.appendChild(vazio);
        return;
    }

    filtradas.forEach(contacto => {
        const item = document.createElement("div");
        item.className = "conversation";

        if (conversaAtual && conversaAtual.id === contacto.id) {
            item.classList.add("active");
        }

        const avatar = criarAvatar(contacto);

        const info = document.createElement("div");
        info.className = "conversation-info";

        const nome = document.createElement("div");
        nome.className = "conversation-name";
        nome.textContent = contacto.nome;

        const previa = document.createElement("div");
        previa.className = "conversation-preview";
        previa.textContent = obterPrevia(contacto);

        info.append(nome, previa);

        const hora = document.createElement("div");
        hora.className = "conversation-time";
        hora.textContent = obterHora(contacto);

        item.append(avatar, info, hora);

        item.addEventListener("click", () => {
            abrirConversaOriginal(contacto);
        });

        lista.appendChild(item);
    });
}

// ============================================
// ABRIR CONVERSA
// ============================================

function abrirConversaOriginal(contacto) {
    conversaAtual = contacto;
    contacto.naoLidas = 0;

    contacto.mensagens.forEach(mensagem => {
        if (mensagem.tipo === "recebida") {
            mensagem.lida = true;
        }
    });

    guardarConversas();

    $("app")?.classList.add("chat-open");

    renderizarAplicacao();
}

// ============================================
// CABEÇALHO
// ============================================

function renderizarCabecalho() {
    const nome = $("headerName");
    const numero = $("headerNumber");
    const avatar = $("headerAvatar");

    if (!conversaAtual) {
        if (nome) nome.textContent = "Mensagens";
        if (numero) numero.textContent = "Seleciona uma conversa";

        if (avatar) {
            avatar.innerHTML = "";
            avatar.textContent = "i";
        }

        return;
    }

    if (nome) nome.textContent = conversaAtual.nome;

    if (numero) {
        numero.textContent = conversaAtual.numero || "Contacto";
    }

    if (avatar) {
        avatar.innerHTML = "";

        if (conversaAtual.foto) {
            const imagem = document.createElement("img");
            imagem.src = conversaAtual.foto;
            imagem.alt = conversaAtual.nome;
            avatar.appendChild(imagem);
        } else {
            avatar.textContent =
                conversaAtual.iniciais || iniciaisNome(conversaAtual.nome);
        }
    }
}

// ============================================
// MENU DE CADA MENSAGEM
// ============================================

function abrirOpcoesMensagem(contacto, mensagem) {
    if (mensagem.apagada) {
        const opcao = prompt(
            "MENSAGEM APAGADA\n\n" +
            "1 - Recuperar mensagem\n" +
            "2 - Eliminar definitivamente\n" +
            "3 - Cancelar"
        );

        if (opcao === "1") {
            recuperarMensagem(contacto, mensagem);
        } else if (opcao === "2") {
            const confirmar = confirm("Eliminar definitivamente esta mensagem?");

            if (confirmar) {
                eliminarDefinitivamente(contacto, mensagem);
            }
        }

        return;
    }

    const opcao = prompt(
        "OPÇÕES DA MENSAGEM\n\n" +
        "1 - Apagar mensagem\n" +
        "2 - Cancelar"
    );

    if (opcao === "1") {
        const confirmar = confirm("Queres apagar esta mensagem?");

        if (confirmar) {
            apagarMensagem(contacto, mensagem);
        }
    }
}

// ============================================
// MOSTRAR MENSAGENS
// ============================================

function renderizarMensagens() {
    const area = $("messages");

    if (!area) return;

    area.innerHTML = "";

    if (!conversaAtual) {
        const vazio = document.createElement("div");
        vazio.className = "empty";
        vazio.textContent = "Seleciona uma conversa para ver as mensagens.";
        area.appendChild(vazio);
        return;
    }

    const mensagensVisiveis = conversaAtual.mensagens.filter(
        mensagem => !mensagem.apagada
    );

    if (!mensagensVisiveis.length) {
        const vazio = document.createElement("div");
        vazio.className = "empty";
        vazio.textContent = "Esta conversa ainda não tem mensagens.";
        area.appendChild(vazio);
        return;
    }

    let ultimoDia = null;

    mensagensVisiveis.forEach(mensagem => {

        // Separador de dia: Ontem / Hoje

        if (mensagem.dia && mensagem.dia !== ultimoDia) {
            const separador = document.createElement("div");

            separador.className = "message-day";
            separador.textContent = mensagem.dia;

            separador.style.textAlign = "center";
            separador.style.margin = "18px auto";
            separador.style.padding = "5px 12px";
            separador.style.width = "fit-content";
            separador.style.borderRadius = "12px";
            separador.style.background = "rgba(128,128,128,0.15)";
            separador.style.color = "inherit";
            separador.style.fontSize = "12px";
            separador.style.fontWeight = "600";

            area.appendChild(separador);

            ultimoDia = mensagem.dia;
        }

        const caixa = document.createElement("div");

        caixa.className = "message " +
            (mensagem.tipo === "enviada" ? "sent" : "received");

        const texto = document.createElement("div");
        texto.textContent = mensagem.texto;
        caixa.appendChild(texto);

        if (mensagem.imagem) {
            const imagem = document.createElement("img");

            imagem.src = mensagem.imagem;
            imagem.alt = "Fotografia anexada";
            imagem.style.maxWidth = "100%";
            imagem.style.maxHeight = "250px";
            imagem.style.borderRadius = "12px";
            imagem.style.marginTop = "8px";

            caixa.appendChild(imagem);
        }

        const hora = document.createElement("span");

        hora.className = "message-time";
        hora.textContent = mensagem.hora || "";

        caixa.appendChild(hora);

        const opcoes = document.createElement("button");

        opcoes.type = "button";
        opcoes.textContent = "•••";
        opcoes.title = "Opções da mensagem";

        opcoes.style.display = "block";
        opcoes.style.marginTop = "5px";
        opcoes.style.padding = "5px";
        opcoes.style.background = "transparent";
        opcoes.style.color = "inherit";
        opcoes.style.fontSize = "12px";
        opcoes.style.opacity = ".7";

        opcoes.addEventListener("click", evento => {
            evento.stopPropagation();
            abrirOpcoesMensagem(conversaAtual, mensagem);
        });

        caixa.appendChild(opcoes);

        caixa.addEventListener("contextmenu", evento => {
            evento.preventDefault();
            abrirOpcoesMensagem(conversaAtual, mensagem);
        });

        area.appendChild(caixa);
    });

    area.scrollTop = area.scrollHeight;
}

// ============================================
// LISTA DE MENSAGENS APAGADAS
// ============================================

function abrirMensagensApagadas() {
    const apagadas = listarMensagensApagadas();

    if (!apagadas.length) {
        alert("Não existem mensagens apagadas.");
        return;
    }

    let escolha = "";

    while (true) {
        let texto = "MENSAGENS APAGADAS\n\n";

        apagadas.forEach((item, indice) => {
            texto +=
                (indice + 1) + " - " +
                item.contacto.nome + ": " +
                item.mensagem.texto.substring(0, 65) +
                "\n\n";
        });

        texto +=
            "Introduz o número da mensagem para gerir.\n" +
            "Ou escreve 0 para sair.";

        escolha = prompt(texto);

        if (escolha === null || escolha === "0") break;

        const indice = Number(escolha) - 1;

        if (!Number.isInteger(indice) || indice < 0 || indice >= apagadas.length) {
            alert("Número inválido.");
            continue;
        }

        const item = apagadas[indice];

        const acao = prompt(
            "MENSAGEM DE " + item.contacto.nome + "\n\n" +
            "1 - Recuperar\n" +
            "2 - Eliminar definitivamente\n" +
            "3 - Voltar"
        );

        if (acao === "1") {
            recuperarMensagem(item.contacto, item.mensagem);
            alert("Mensagem recuperada.");
        } else if (acao === "2") {
            if (confirm("Eliminar definitivamente?")) {
                eliminarDefinitivamente(item.contacto, item.mensagem);
                alert("Mensagem eliminada.");
            }
        }

        return abrirMensagensApagadas();
    }
}

// ============================================
// INTERFACE
// ============================================

function renderizarAplicacao() {
    renderizarListaConversas();
    renderizarCabecalho();
    renderizarMensagens();
}

// ============================================
// ENVIAR MENSAGEM
// ============================================

function enviarMensagem(evento) {
    evento.preventDefault();

    if (!conversaAtual) {
        alert("Seleciona primeiro uma conversa.");
        return;
    }

    const campo = $("messageInput");
    const texto = campo.value.trim();

    if (!texto) return;

    adicionarMensagem(
        conversaAtual,
        texto,
        "enviada",
        horaAtual()
    );

    campo.value = "";
    campo.focus();
}

// ============================================
// MODAL DE CONTACTOS
// ============================================

function abrirModalContacto(contacto = null) {
    contactoEmEdicao = contacto;

    $("contactModal")?.classList.add("show");

    $("modalTitle").textContent = contacto
        ? "Editar contacto"
        : "Nova conversa";

    $("contactName").value = contacto?.nome || "";
    $("contactPhone").value = contacto?.numero || "";
    $("contactPhoto").value = "";
}

function fecharModalContacto() {
    $("contactModal")?.classList.remove("show");
    contactoEmEdicao = null;
}

function guardarContactoModal() {
    const nome = $("contactName").value.trim();
    const numero = $("contactPhone").value.trim();
    const ficheiro = $("contactPhoto").files[0];

    if (!nome) {
        alert("Introduz o nome do contacto.");
        return;
    }

    function concluir(foto) {
        if (contactoEmEdicao) {
            editarContacto(contactoEmEdicao.id, {
                nome,
                numero,
                iniciais: iniciaisNome(nome),
                foto: foto !== undefined ? foto : contactoEmEdicao.foto
            });

            conversaAtual = contactoEmEdicao;
        } else {
            const novo = criarContacto(nome, numero, iniciaisNome(nome));
            novo.foto = foto || "";
            conversaAtual = novo;
        }

        guardarConversas();
        fecharModalContacto();
        abrirConversaOriginal(conversaAtual);
    }

    if (ficheiro) {
        const leitor = new FileReader();

        leitor.onload = evento => {
            concluir(evento.target.result);
        };

        leitor.readAsDataURL(ficheiro);
    } else {
        concluir(undefined);
    }
}

// ============================================
// APAGAR CONVERSA
// ============================================

function apagarConversaAtual() {
    if (!conversaAtual) return;

    const confirmar = confirm(
        "Tens a certeza de que queres apagar esta conversa?"
    );

    if (!confirmar) return;

    conversas = conversas.filter(c => c.id !== conversaAtual.id);
    conversaAtual = null;

    guardarConversas();

    $("app")?.classList.remove("chat-open");

    renderizarAplicacao();
}

// ============================================
// PESQUISA
// ============================================

function pesquisar() {
    renderizarListaConversas();
}

// ============================================
// FILTROS
// ============================================

function definirFiltro(filtro) {
    filtroAtual = filtro;

    document.querySelectorAll(".menu button").forEach(
        botao => botao.classList.remove("active")
    );

    const ids = {
        todas: "allButton",
        desconhecidos: "unknownButton",
        silenciados: "mutedButton"
    };

    if (ids[filtro]) {
        $(ids[filtro])?.classList.add("active");
    }

    renderizarListaConversas();
}

// ============================================
// FOTOGRAFIAS
// ============================================

function anexarFotografia(evento) {
    const ficheiro = evento.target.files[0];

    if (!ficheiro) return;

    if (!conversaAtual) {
        alert("Seleciona primeiro uma conversa.");
        return;
    }

    if (!ficheiro.type.startsWith("image/")) {
        alert("Seleciona um ficheiro de imagem.");
        return;
    }

    const leitor = new FileReader();

    leitor.onload = e => {
        const mensagem = adicionarMensagem(
            conversaAtual,
            "📷 Fotografia anexada",
            "enviada",
            horaAtual()
        );

        if (mensagem) {
            mensagem.imagem = e.target.result;
            guardarConversas();
            renderizarAplicacao();
        }
    };

    leitor.readAsDataURL(ficheiro);
    evento.target.value = "";
}

// ============================================
// EVENTOS
// ============================================

function configurarEventos() {
    $("newChat")?.addEventListener("click", () => {
        abrirModalContacto();
    });

    $("cancelModal")?.addEventListener("click", fecharModalContacto);
    $("saveContact")?.addEventListener("click", guardarContactoModal);
    $("messageForm")?.addEventListener("submit", enviarMensagem);
    $("search")?.addEventListener("input", pesquisar);

    $("allButton")?.addEventListener("click", () => definirFiltro("todas"));
    $("unknownButton")?.addEventListener("click", () => definirFiltro("desconhecidos"));
    $("mutedButton")?.addEventListener("click", () => definirFiltro("silenciados"));

    $("contactEdit")?.addEventListener("click", () => {
        if (conversaAtual) abrirModalContacto(conversaAtual);
    });

    $("deleteChat")?.addEventListener("click", apagarConversaAtual);

    $("backButton")?.addEventListener("click", () => {
        $("app")?.classList.remove("chat-open");
    });

    $("attachButton")?.addEventListener("click", () => {
        $("attachmentInput")?.click();
    });

    $("attachmentInput")?.addEventListener("change", anexarFotografia);

    configurarEventosNotificacoes();
}

// ============================================
// INICIALIZAÇÃO
// ============================================

function iniciarAplicacao() {
    recuperarConversas();

    carregarConfiguracaoNotificacoes();

    importarTranscricaoIPAJ();

    ordenarConversas();

    configurarEventos();

    preencherConfiguracaoNotificacoes();

    renderizarAplicacao();

    console.log("iMessage 2 iniciado.");
    console.log("Conversas:", conversas.length);
    console.log("Mensagens IPAJ:", mensagensIPAJ.length);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarAplicacao);
} else {
    iniciarAplicacao();
}
