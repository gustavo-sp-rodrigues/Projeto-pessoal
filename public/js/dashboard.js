// Lê o valor do <select id="selecao_local">. Esse valor ("1", "2" ou "3")
let id_local = document.getElementById("selecao_local").value;

// Guarda a instância do gráfico criada pelo Chart.js.
let grafico = null;


function nome_usuario_atual() {
    if (sessionStorage.NOME_USUARIO) {
        return sessionStorage.NOME_USUARIO;
    } else {
        return "visitante";
    }
}


// Trata o conteúdo como texto antes de colocá-lo no HTML.
function escapar(texto) {
    let div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

// Mostra o formulário de comentário apenas para quem está logado.
function ajustar_area_comentario() {
    let formulario = document.querySelector(".form-comentario");
    let aviso = document.getElementById("aviso_visitante");
    let btn_sair = document.getElementById("btn_sair");

    if (sessionStorage.ID_USUARIO) {
        formulario.style.display = "flex";
        aviso.style.display = "none";
        btn_sair.style.display = "block";
    } else {
        formulario.style.display = "none";
        aviso.style.display = "block";
        btn_sair.style.display = "none";
    }
}


// Busca as avaliações e atualiza os indicadores, o gráfico e os comentários.
function carregar_comentarios() {
    fetch("/comentarios/por_local/" + id_local)
        .then(function (resposta) {
            return resposta.json();
        })
        .then(function (lista_avaliacoes) {
            preencher_kpis(lista_avaliacoes);
            desenhar_grafico(lista_avaliacoes);
            listar_comentarios(lista_avaliacoes);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar comentários:", erro);
        });
}

// Envia a avaliação do formulário e busca a lista atualizada após o cadastro.
function enviar_comentario() {
    let id_usuario = sessionStorage.ID_USUARIO;
    let nota_localizacao = document.getElementById("nota_localizacao").value;
    let nota_estrutura = document.getElementById("nota_estrutura").value;
    let nota_ambiente = document.getElementById("nota_ambiente").value;
    let texto_comentario = document.getElementById("txt_comentario").value;

    if (texto_comentario.trim() == "") {
        alert("Escreva um comentário antes de enviar.");
    } else {
        fetch("/comentarios/cadastrar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            // Converte os dados do formulário em texto JSON para a API.
            body: JSON.stringify({
                nota_localizacao: nota_localizacao,
                nota_estrutura: nota_estrutura,
                nota_ambiente: nota_ambiente,
                comentario: texto_comentario,
                fk_local: id_local,
                fk_usuario: id_usuario
            })
        })
            .then(function (resposta) {
                if (resposta.status == 201) {
                    document.getElementById("txt_comentario").value = "";
                    carregar_comentarios();
                } else {
                    alert("Não foi possível enviar o comentário.");
                }
            })
            .catch(function (erro) {
                console.log("Erro ao enviar:", erro);
            });
    }
}

// Calcula a média das três categorias e mostra a quantidade de avaliações.
function preencher_kpis(lista_avaliacoes) {
    let soma = 0;
    let total_notas = 0;

    for (let indice = 0; indice < lista_avaliacoes.length; indice++) {
        let avaliacao = lista_avaliacoes[indice];
        soma += Number(avaliacao.nota_localizacao)
            + Number(avaliacao.nota_estrutura)
            + Number(avaliacao.nota_ambiente);
        total_notas += 3;
    }

    let media;
    if (total_notas > 0) {
        media = (soma / total_notas).toFixed(1);
    } else {
        media = "0.0";
    }

    document.getElementById("kpi_media").innerHTML = "nota média<br>" + media + "/5";
    document.getElementById("kpi_total").innerHTML = "avaliações recebidas<br>" + lista_avaliacoes.length;
}

// Calcula a média de uma categoria, como nota_estrutura.
function media_categoria(lista_avaliacoes, campo) {
    let soma = 0;
    let quantidade = 0;

    for (let indice = 0; indice < lista_avaliacoes.length; indice++) {
        let avaliacao = lista_avaliacoes[indice];
        let nota = Number(avaliacao[campo]);

        if (!isNaN(nota) && nota > 0) {
            soma += nota;
            quantidade++;
        }
    }

    if (quantidade == 0) {
        return 0;
    } else {
        return Number((soma / quantidade).toFixed(1));
    }
}

// Monta o gráfico com a média de cada categoria.
function desenhar_grafico(lista_avaliacoes) {
    let medias = [
        media_categoria(lista_avaliacoes, "nota_localizacao"),
        media_categoria(lista_avaliacoes, "nota_estrutura"),
        media_categoria(lista_avaliacoes, "nota_ambiente")
    ];

    let elemento_grafico = document.getElementById("myChart");

    if (grafico != null) {
        grafico.destroy();
    }

    grafico = new Chart(elemento_grafico, {
        type: "bar", 
        data: {
            labels: ["Localização", "Estrutura", "Ambiente"], 
            datasets: [{
                label: "Nota média", 
                data: medias,        
                backgroundColor: ["#F1C40F", "#2ECC71", "#3498DB"] 
            }]
        },
        options: {
            responsive: true, 
            maintainAspectRatio: false, 
            plugins: { legend: { display: false } }, 
            scales: {
                y: {
                    beginAtZero: true, 
                    max: 5,            
                    ticks: { precision: 0 } 
                }
            }
        }
    });
}

// Monta a lista de comentários dentro da div #lista_comentarios.
function listar_comentarios(lista_avaliacoes) {
    let area_comentarios = document.getElementById("lista_comentarios");

    if (lista_avaliacoes.length == 0) {
        area_comentarios.innerHTML = "<p>Nenhum comentário ainda.</p>";
    } else {
        let html = "";

        for (let indice = 0; indice < lista_avaliacoes.length; indice++) {
            let avaliacao = lista_avaliacoes[indice];

            html += "<div class='comentario'>";
            html += "<strong>" + escapar(avaliacao.nome_usuario) + "</strong>";
            html += "<p>" + escapar(avaliacao.comentario) + "</p>";
            html += "<small>Localização: " + escapar(String(avaliacao.nota_localizacao)) + "⭐ | ";
            html += "Estrutura: " + escapar(String(avaliacao.nota_estrutura)) + "⭐ | ";
            html += "Ambiente: " + escapar(String(avaliacao.nota_ambiente)) + "⭐</small>";
            html += "</div>";

            if (indice < lista_avaliacoes.length - 1) {
                html += "<hr>";
            }
        }

        area_comentarios.innerHTML = html;
    }
}

// Abre a página correspondente ao local selecionado.
function mudar() {
    let local = document.getElementById("selecao_local").value;

    if (local == "1") {
        window.location = "dashboard_pelezao.html"; 
    } else if (local == "2") {
        window.location = "dashboard_villa.html";   
    } else if (local == "3") {
        window.location = "dashboard_sesc.html";    
    }
}


// Executado quando a página carrega: mostra o usuário e busca as avaliações.
document.getElementById("nome_usuario").textContent = nome_usuario_atual();
ajustar_area_comentario();
carregar_comentarios();
