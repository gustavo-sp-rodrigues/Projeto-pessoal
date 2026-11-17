// ============================================================================
// dashboard.js
// Este arquivo é usado pelas três dashboards (Pelezão, Villa-Lobos e Sesc).
// Ele é responsável por:
//   1. Descobrir qual local está aberto (id_local);
//   2. Buscar no backend os comentários desse local;
//   3. Calcular as médias e preencher os KPIs;
//   4. Desenhar o gráfico de barras com Chart.js;
//   5. Listar os comentários na tela;
//   6. Enviar um novo comentário/avaliação para o backend.
// ============================================================================

// Lê o valor do <select id="selecao_local">. Esse valor ("1", "2" ou "3")
// representa o local aberto e é usado para buscar os comentários corretos.
let id_local = document.getElementById("selecao_local").value;

// Guarda a instância do gráfico criada pelo Chart.js.
// É necessário guardar para poder destruir o gráfico antigo antes de criar outro.
let grafico = null;

// Lê o nome do usuário salvo no sessionStorage (preenchido no login).
// Se não existir (ninguém logado), devolve o texto "visitante".
function nome_usuario_atual() {
    return sessionStorage.NOME_USUARIO ? sessionStorage.NOME_USUARIO : "visitante";
}

// Segurança: transforma o texto em "texto puro" antes de colocar no HTML.
// Assim, se alguém digitar algo como <script>, isso aparece como texto
// e não é executado pelo navegador (evita injeção de código).
function escapar(texto) {
    let div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

// Mostra o formulário de comentário apenas para quem está logado.
// Se não houver ID_USUARIO no sessionStorage, esconde o formulário e
// exibe o aviso "Cadastre-se para comentar".
function ajustar_area_comentario() {
    let logado = sessionStorage.ID_USUARIO ? true : false;
    let formulario = document.querySelector(".form-comentario");
    let aviso = document.getElementById("aviso_visitante");
    let btn_sair = document.getElementById("btn_sair");

    if (logado) {
        // .form-comentario já é display: flex no CSS, então restauramos assim.
        formulario.style.display = "flex";
        aviso.style.display = "none";
        btn_sair.style.display = "block";
    } else {
        formulario.style.display = "none";
        aviso.style.display = "block";
        btn_sair.style.display = "none";
    }
}

// Busca no backend todos os comentários do local atual.
// fetch() faz uma requisição HTTP do tipo GET para a rota
// /comentarios/por_local/<id_local> (definida em src/routes/comentarios.js).
function carregar_comentarios() {
    fetch("/comentarios/por_local/" + id_local)
        // A resposta chega como JSON; transformamos em um array JavaScript ("lista").
        .then(function (resposta) { return resposta.json(); })
        .then(function (lista) {
            // Com a lista em mãos, atualizamos as três partes da tela:
            preencher_kpis(lista);
            desenhar_grafico(lista);
            listar_comentarios(lista);
        })
        .catch(function (erro) {
            // Se a requisição falhar (servidor fora do ar, rota errada etc.),
            // mostramos o erro no console do navegador.
            console.log("Erro ao buscar comentários:", erro);
        });
}

// Atualiza os dois quadros de KPI (indicadores) no lado direito.
// KPI 1: nota média geral (média das três notas de todos os comentários).
// KPI 2: quantidade de avaliações (quantos comentários existem).
function preencher_kpis(lista) {
    let soma = 0;          // soma de todas as notas
    let total_notas = 0;   // quantidade total de notas somadas

    // Percorre cada comentário da lista.
    lista.forEach(function (c) {
        // Number() converte o texto do banco ("5") para número (5).
        soma += Number(c.nota_localizacao) + Number(c.nota_estrutura) + Number(c.nota_ambiente);
        // Cada comentário tem 3 notas, então somamos 3 ao total.
        total_notas += 3;
    });

    // Evita divisão por zero quando ainda não há comentários.
    // toFixed(1) deixa a média com uma casa decimal (ex.: "4.3").
    let media = total_notas > 0 ? (soma / total_notas).toFixed(1) : "0.0";

    // Escreve o resultado dentro das divs de KPI.
    // <br> quebra a linha entre o rótulo e o valor.
    document.getElementById("kpi_media").innerHTML = "nota média<br>" + media + "/5";
    document.getElementById("kpi_total").innerHTML = "avaliações recebidas<br>" + lista.length;
}

// Calcula a média de UMA categoria (localização, estrutura ou ambiente).
// Recebe a lista de comentários e o nome do campo que será usado.
// Exemplo: media_categoria(lista, "nota_estrutura").
function media_categoria(lista, campo) {
    let soma = 0;
    let quantidade = 0;

    lista.forEach(function (c) {
        // c[campo] lê dinamicamente a propriedade cujo nome está em "campo".
        let nota = Number(c[campo]);

        // Só entra na média se for um número válido e maior que zero.
        if (!isNaN(nota) && nota > 0) {
            soma += nota;
            quantidade++;
        }
    });

    // Se não houver notas dessa categoria, devolve 0 para o gráfico não quebrar.
    if (quantidade == 0) { return 0; }
    return Number((soma / quantidade).toFixed(1));
}

// Desenha (ou redesenha) o gráfico de barras com Chart.js.
// Eixo X: Localização, Estrutura e Ambiente.
// Eixo Y: nota média de cada categoria (de 0 a 5).
function desenhar_grafico(lista) {
    // Calcula as três médias que serão as alturas das barras.
    let medias = [
        media_categoria(lista, "nota_localizacao"),
        media_categoria(lista, "nota_estrutura"),
        media_categoria(lista, "nota_ambiente")
    ];

    // Pega o elemento <canvas id="myChart"> onde o gráfico é desenhado.
    let ctx = document.getElementById("myChart");

    // Se já existe um gráfico na tela, destrói antes de criar outro.
    // Isso evita gráficos "empilhados" ao recarregar os comentários.
    if (grafico != null) { grafico.destroy(); }

    // Cria o gráfico com a biblioteca Chart.js.
    grafico = new Chart(ctx, {
        type: "bar", // tipo de gráfico: barras (colunas)
        data: {
            labels: ["Localização", "Estrutura", "Ambiente"], // rótulos do eixo X
            datasets: [{
                label: "Nota média", // texto da legenda do conjunto de dados
                data: medias,        // valores das barras (as médias calculadas)
                backgroundColor: ["#F1C40F", "#2ECC71", "#3498DB"] // cor de cada barra
            }]
        },
        options: {
            responsive: true, // o gráfico se ajusta ao tamanho da tela
            maintainAspectRatio: false, // Permite que o gráfico obedeça à altura da div pai
            plugins: { legend: { display: false } }, // esconde a legenda
            scales: {
                y: {
                    beginAtZero: true, // o eixo Y começa em 0
                    max: 5,            // a nota vai até 5
                    ticks: { precision: 0 } // mostra números inteiros no eixo
                }
            }
        }
    });
}

// Monta a lista de comentários dentro da div #lista_comentarios.
function listar_comentarios(lista) {
    let container = document.getElementById("lista_comentarios");

    // Se não houver nenhum comentário, mostra uma mensagem e encerra a função.
    if (lista.length == 0) {
        container.innerHTML = "<p>Nenhum comentário ainda.</p>";
        return;
    }

    let html = "";

    // Percorre cada comentário. O "indice" (0, 1, 2...) serve para saber
    // se é o último item da lista.
    lista.forEach(function (c, indice) {
        html += "<div class='comentario'>";
        html += "<strong>" + escapar(c.nome_usuario) + "</strong>"; // nome do autor
        html += "<p>" + escapar(c.comentario) + "</p>";             // texto do comentário
        html += "<small>Localização: " + escapar(String(c.nota_localizacao)) + "⭐ | ";
        html += "Estrutura: " + escapar(String(c.nota_estrutura)) + "⭐ | ";
        html += "Ambiente: " + escapar(String(c.nota_ambiente)) + "⭐</small>";
        html += "</div>";

        // Adiciona uma linha <hr> entre um comentário e o próximo.
        // Não adiciona depois do último (quando indice == lista.length - 1).
        if (indice < lista.length - 1) {
            html += "<hr>";
        }
    });

    // Coloca todo o HTML montado dentro da página de uma só vez.
    container.innerHTML = html;
}

// Envia um novo comentário/avaliação para o backend.
// É chamada pelo atributo onsubmit do formulário.
function enviar_comentario() {
    // Lê o ID do usuário logado no sessionStorage.
    let id_usuario = sessionStorage.ID_USUARIO;

    // Se não existir, a pessoa não está logada: avisa e manda para a página de espera.
    if (!id_usuario) {
        alert("Faça login para enviar um comentário.");
        window.location.href = "espera.html";
        return;
    }

    // Lê os valores escolhidos nos três <select> e o texto digitado.
    let nota_localizacao = document.getElementById("nota_localizacao").value;
    let nota_estrutura = document.getElementById("nota_estrutura").value;
    let nota_ambiente = document.getElementById("nota_ambiente").value;
    let texto = document.getElementById("txt_comentario").value;

    // Se o texto estiver vazio (só espaços também conta como vazio), bloqueia o envio.
    if (texto.trim() == "") {
        alert("Escreva um comentário antes de enviar.");
        return;
    }

    // fetch() com method "POST" envia dados para o backend.
    // JSON.stringify() transforma o objeto JavaScript em texto JSON.
    fetch("/comentarios/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" }, // avisa que o corpo é JSON
        body: JSON.stringify({
            nota_localizacao: nota_localizacao,
            nota_estrutura: nota_estrutura,
            nota_ambiente: nota_ambiente,
            comentario: texto,
            fk_local: id_local,
            fk_usuario: id_usuario
        })
    }).then(function (resposta) {
        // Status 201 significa "criado com sucesso" (definido no controller).
        if (resposta.status == 201) {
            // Limpa o campo de texto e recarrega os dados da dashboard.
            document.getElementById("txt_comentario").value = "";
            carregar_comentarios();
        } else {
            // Qualquer outro status indica problema no envio.
            alert("Não foi possível enviar o comentário.");
        }
    }).catch(function (erro) {
        // Erro de rede ou servidor fora do ar.
        console.log("Erro ao enviar:", erro);
    });
}

// Troca de dashboard quando o usuário muda o local no <select>.
// O evento onchange do select chama esta função.
function mudar() {
    let local = document.getElementById("selecao_local").value;

    if (local == "1") {
        window.location = "dashboard_pelezao.html"; // Pelezão
    } else if (local == "2") {
        window.location = "dashboard_villa.html";   // Parque Villa-Lobos
    } else if (local == "3") {
        window.location = "dashboard_sesc.html";    // Sesc Pompéia
    }
}

// ============================================================================
// Código que roda automaticamente quando a página abre:
// 1. Coloca o nome do usuário logado (ou "visitante") no título esquerdo.
// 2. Já busca os comentários do local e monta KPIs, gráfico e lista.
// ============================================================================
document.getElementById("nome_usuario").textContent = nome_usuario_atual();
ajustar_area_comentario();
carregar_comentarios();
