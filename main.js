let historico =
JSON.parse(
localStorage.getItem("tmvHistorico")
) || [];

function atualizar(){

    const div =
    document.getElementById("historico");

    div.innerHTML = "";

    let somaArea = 0;
    let somaValor = 0;

    historico.forEach((item, indice)=>{

        somaArea += item.area;
        somaValor += item.valor;

        div.innerHTML += `
        <div class="item">

            <strong>${item.local}</strong><br>

            Área: ${item.area.toFixed(2)} m²<br>

            Valor: R$ ${item.valor.toFixed(2)}<br>

            <small>${item.data}</small>

            <div style="margin-top:10px">

                <button
                class="editar"
                onclick="editarItem(${indice})">
                ✏️ Editar
                </button>

                <button
                class="excluir"
                onclick="excluirItem(${indice})">
                🗑️ Excluir
                </button>

            </div>

        </div>
        `;
    });

    if(historico.length === 0){

        div.innerHTML =
        "<p>Nenhum cálculo salvo.</p>";

    }

    document.getElementById("totalArea")
    .innerHTML =
    "Metragem Total: " +
    somaArea.toFixed(2) +
    " m²";

    document.getElementById("totalValor")
    .innerHTML =
    "Valor Total Geral: R$ " +
    somaValor.toFixed(2);
}

function calcular(){

    const local =
    document.getElementById("local").value;

    const largura =
    parseFloat(
    document.getElementById("largura").value
    );

    const comprimento =
    parseFloat(
    document.getElementById("comprimento").value
    );

    const valorMetro =
    parseFloat(
    document.getElementById("valorMetro").value
    );

    if(
        !local ||
        isNaN(largura) ||
        isNaN(comprimento) ||
        isNaN(valorMetro)
    ){

        alert(
        "Preencha todos os campos."
        );

        return;
    }

    const area =
    largura * comprimento;

    const valor =
    area * valorMetro;

    document.getElementById("resultadoArea")
    .innerHTML =
    "Área: " +
    area.toFixed(2) +
    " m²";

    document.getElementById("resultadoValor")
    .innerHTML =
    "Valor: R$ " +
    valor.toFixed(2);

    historico.push({

        local,
        largura,
        comprimento,
        valorMetro,
        area,
        valor,

        data:
        new Date()
        .toLocaleString("pt-BR")

    });

    localStorage.setItem(
        "tmvHistorico",
        JSON.stringify(historico)
    );

    atualizar();

    document.getElementById("local").value = "";
    document.getElementById("largura").value = "";
    document.getElementById("comprimento").value = "";
    document.getElementById("valorMetro").value = "";
}

function excluirItem(indice){

    if(
        confirm(
        "Deseja excluir este ambiente?"
        )
    ){

        historico.splice(indice,1);

        localStorage.setItem(
            "tmvHistorico",
            JSON.stringify(historico)
        );

        atualizar();
    }
}

function editarItem(indice){

    const item =
    historico[indice];

    document.getElementById("local").value =
    item.local;

    document.getElementById("largura").value =
    item.largura;

    document.getElementById("comprimento").value =
    item.comprimento;

    document.getElementById("valorMetro").value =
    item.valorMetro;

    historico.splice(indice,1);

    localStorage.setItem(
        "tmvHistorico",
        JSON.stringify(historico)
    );

    atualizar();

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });
}

function resetar(){

    if(
        confirm(
        "Deseja apagar todo o histórico?"
        )
    ){

        historico = [];

        localStorage.removeItem(
        "tmvHistorico"
        );

        atualizar();

        document.getElementById("resultadoArea")
        .innerHTML =
        "Área: 0 m²";

        document.getElementById("resultadoValor")
        .innerHTML =
        "Valor: R$ 0,00";
    }
}

/* PWA / OFFLINE */

if("serviceWorker" in navigator){

    window.addEventListener(
    "load",
    ()=>{

        navigator
        .serviceWorker
        .register("./sw.js")
        .then(()=>{

            console.log(
            "TMV Gesso Offline Ativado"
            );

        })
        .catch((erro)=>{

            console.log(
            "Erro ao registrar SW:",
            erro
            );

        });

    });

}

atualizar();