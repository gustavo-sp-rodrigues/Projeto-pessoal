let id_local = document.getElementById("selecao_local").value;
let grafico = null;

function nome_usuario_atual() {
    return sessionStorage.NOME_USUARIO ? sessionStorage.NOME_USUARIO : "visitante";
}

function escapar(texto) {
    let div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

function carregar_comentarios() {
    fetch("/comentarios/por_local/" + id_local)
        .then(function (resposta) { return resposta.json(); })
        .then(function (lista) {
            preencher_kpis(lista);
            desenhar_grafico(lista);
            listar_comentarios(lista);
        })
        .catch(function (erro) {
            console.log("Erro ao buscar comentários:", erro);
        });
}

function preencher_kpis(lista) {
    let soma = 0;
    lista.forEach(function (c) { soma += Number(c.nota); });

    let media = lista.length > 0 ? (soma / lista.length).toFixed(1) : "0.0";

    document.getElementById("kpi_media").innerHTML = "nota média<br>" + media + "/5";
    document.getElementById("kpi_total").innerHTML = "avaliações recebidas<br>" + lista.length;
}

function desenhar_grafico(lista) {
    let contagem = [0, 0, 0, 0, 0];

    lista.forEach(function (c) {
        let n = Number(c.nota);
        if (n >= 1 && n <= 5) { contagem[n - 1]++; }
    });

    let ctx = document.getElementById("myChart");

    if (grafico != null) { grafico.destroy(); }

    grafico = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["1★", "2★", "3★", "4★", "5★"],
            datasets: [{
                label: "Quantidade de notas",
                data: contagem,
                backgroundColor: ["#E74C3C", "#E67E22", "#F1C40F", "#2ECC71", "#3498DB"]
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { precision: 0 } } }
        }
    });
}

function listar_comentarios(lista) {
    let container = document.getElementById("lista_comentarios");

    if (lista.length == 0) {
        container.innerHTML = "<p>Nenhum comentário ainda.</p>";
        return;
    }

    let html = "";
    lista.forEach(function (c) {
        html += "<div class='comentario'>";
        html += "<strong>" + escapar(c.nome_usuario) + "</strong> (" + escapar(String(c.nota)) + "★)";
        html += "<p>" + escapar(c.comentario) + "</p>";
        html += "</div>";
    });
    container.innerHTML = html;
}

function enviar_comentario() {
    let id_usuario = sessionStorage.ID_USUARIO;

    if (!id_usuario) {
        alert("Faça login para enviar um comentário.");
        window.location.href = "espera.html";
        return;
    }

    let nota = document.getElementById("sel_nota").value;
    let texto = document.getElementById("txt_comentario").value;

    if (texto.trim() == "") {
        alert("Escreva um comentário antes de enviar.");
        return;
    }

    fetch("/comentarios/cadastrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            nota: nota,
            comentario: texto,
            fk_local: id_local,
            fk_usuario: id_usuario
        })
    }).then(function (resposta) {
        if (resposta.status == 201) {
            document.getElementById("txt_comentario").value = "";
            carregar_comentarios();
        } else {
            alert("Não foi possível enviar o comentário.");
        }
    }).catch(function (erro) {
        console.log("Erro ao enviar:", erro);
    });
}

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

document.getElementById("nome_usuario").textContent = nome_usuario_atual();
carregar_comentarios();
