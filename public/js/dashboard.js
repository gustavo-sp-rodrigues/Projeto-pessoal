// Lê o valor do <select id="selecao_local">. Esse valor ("1", "2" ou "3")
let id_local = document.getElementById("selecao_local").value;

// Guarda a instância do gráfico criada pelo Chart.js.
let grafico = null;


function nome_usuario_atual() {
    return sessionStorage.NOME_USUARIO ? sessionStorage.NOME_USUARIO : "visitante";
}


// segurança trasformar em texto
function escapar(texto) {
    let div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

// Mostra o formulário de comentário apenas para quem está logado.
function ajustar_area_comentario() {
    let logado = sessionStorage.ID_USUARIO ? true : false;
    let formulario = document.querySelector(".form-comentario");
    let aviso = document.getElementById("aviso_visitante");
    let btn_sair = document.getElementById("btn_sair");

    if (logado) {

        formulario.style.display = "flex";
        aviso.style.display = "none";
        btn_sair.style.display = "block";
    } else {
        formulario.style.display = "none";
        aviso.style.display = "block";
        btn_sair.style.display = "none";
    }
}


function carregar_comentarios() {
    fetch("/comentarios/por_local/" + id_local)
        
        .then(function (resposta) { return resposta.json(); })
        .then(function (lista_comentario) {
            
            preencher_kpis(lista_comentario);
            desenhar_grafico(lista_comentario);
            listar_comentarios(lista_comentario);
        })
        .catch(function (erro) {
            
            console.log("Erro ao buscar comentários:", erro);
        });
}


function preencher_kpis(lista) {
    let soma = 0;         
    let total_notas = 0;   

    
    lista.forEach(function (c) {
        
        soma += Number(c.nota_localizacao) + Number(c.nota_estrutura) + Number(c.nota_ambiente);
       
        total_notas += 3;
    });

    
    let media = total_notas > 0 ? (soma / total_notas).toFixed(1) : "0.0";

   
  
    document.getElementById("kpi_media").innerHTML = "nota média<br>" + media + "/5";
    document.getElementById("kpi_total").innerHTML = "avaliações recebidas<br>" + lista.length;
}


function media_categoria(lista, campo) {
    let soma = 0;
    let quantidade = 0;

    lista.forEach(function (c) {
        
        let nota = Number(c[campo]);

        if (!isNaN(nota) && nota > 0) {
            soma += nota;
            quantidade++;
        }
    });

   
    if (quantidade == 0) { return 0; }
    return Number((soma / quantidade).toFixed(1));
}


function desenhar_grafico(lista) {
    
    let medias = [
        media_categoria(lista, "nota_localizacao"),
        media_categoria(lista, "nota_estrutura"),
        media_categoria(lista, "nota_ambiente")
    ];

    
    let ctx = document.getElementById("myChart");

   
    if (grafico != null) { grafico.destroy(); }

  
    grafico = new Chart(ctx, {
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
function listar_comentarios(lista) {
    let container = document.getElementById("lista_comentarios");

    
    if (lista.length == 0) {
        container.innerHTML = "<p>Nenhum comentário ainda.</p>";
        return;
    }

    let html = "";

// escapar segurança
    lista.forEach(function (c, indice) {
        html += "<div class='comentario'>";
        html += "<strong>" + escapar(c.nome_usuario) + "</strong>"; 
        html += "<p>" + escapar(c.comentario) + "</p>";           
        html += "<small>Localização: " + escapar(String(c.nota_localizacao)) + "⭐ | ";
        html += "Estrutura: " + escapar(String(c.nota_estrutura)) + "⭐ | ";
        html += "Ambiente: " + escapar(String(c.nota_ambiente)) + "⭐</small>";
        html += "</div>";

       
        if (indice < lista.length - 1) {
            html += "<hr>";
        }
    });

    
    container.innerHTML = html;
}


function enviar_comentario() {
   
    let id_usuario = sessionStorage.ID_USUARIO;

   


    let nota_localizacao = document.getElementById("nota_localizacao").value;
    let nota_estrutura = document.getElementById("nota_estrutura").value;
    let nota_ambiente = document.getElementById("nota_ambiente").value;
    let texto = document.getElementById("txt_comentario").value;

    
    if (texto.trim() == "") {
        alert("Escreva um comentário antes de enviar.");
        return;
    }

    // fetch() envia dados para o backend.
    
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
ajustar_area_comentario();
carregar_comentarios();
