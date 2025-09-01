let graficoBarras = null;
let graficoPizza = null; 
let graficoLinha = null;
//variaveis para armazenar o input
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("consumo-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    //adicionar um listener para envio dos dados do formulário
    const consumos = [];
    for (let i = 1; i <= 6; i++) {
      const input = document.getElementById("mes" + i);
      const valor = parseFloat(input.value);
      if (isNaN(valor)) {
        alert(`Preencha corretamente o mês ${i}`);
        return;
      }
      consumos.push(valor);
      //armazenar os valores no vetor
    }

    const tarifa = 0.821;
    const fatorCO2 = 0.084;
    const producaoSolarMensal = 450;

    const consumoTotal = consumos.reduce((a, b) => a + b, 0); //aplicar uma função acumuladora, somar todos os valores do vetor consumos sem utilizar um laço de repetição
    const custoTotal = consumoTotal * tarifa;
    const co2Total = consumoTotal * fatorCO2;
    const economiaKWh = Math.min(consumoTotal, producaoSolarMensal * 6); //retornar o menor valor entre o consumo e a produção solar 
    const economiaR$ = economiaKWh * tarifa;

    document.getElementById("graficos").style.display = "block";

    gerarGraficoBarras(consumos);
    gerarGraficoPizza(consumos, fatorCO2);
    gerarGraficoLinha(custoTotal, economiaR$);
  });
});

function gerarGraficoBarras(consumos) {
  const ctx = document.getElementById("graficoBarras").getContext("2d");
  if (graficoBarras && typeof graficoBarras.destroy === "function") {
    graficoBarras.destroy();
    //destruir um gráfico anterior antes de criar um próximo
  }

  graficoBarras = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Mês 1", "Mês 2", "Mês 3", "Mês 4", "Mês 5", "Mês 6"],
      datasets: [{
        label: "Consumo (kWh)",
        data: consumos, //dados coletados no vetor
        backgroundColor: "#4caf50"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function gerarGraficoPizza(consumos, fatorCO2) {
  const ctx = document.getElementById("graficoPizza").getContext("2d");
  if (graficoPizza && typeof graficoPizza.destroy === "function") {
    graficoPizza.destroy();
  }

  const co2PorMes = consumos.map(kwh => +(kwh * fatorCO2).toFixed(2)); //arredonda o valor para 2 casas decimais
  //valor do consumo mensal * fatorCarbono

  graficoPizza = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Mês 1", "Mês 2", "Mês 3", "Mês 4", "Mês 5", "Mês 6"],
      datasets: [{
        label: "CO₂ emitido por mês (kg)", // 🔧 Adicionado label para tooltip funcionar corretamente
        data: co2PorMes,
        backgroundColor: [
          "#c79081ff", "#66bb6a", "#0f110fff", "#46388eff", "#2e7d32", "#deecdfff"
        ]
      }]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              return `Mês: ${context.label} - ${context.raw} kg de CO₂`;
            }
          }
        }
      }
    }
  });
}

function gerarGraficoLinha(custoTotal, economiaR$) {
  const ctx = document.getElementById("graficoLinha").getContext("2d");
  if (graficoLinha && typeof graficoLinha.destroy === "function") {
    graficoLinha.destroy();
  }

  graficoLinha = new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Sem placas solares", "Com placas solares"],
      datasets: [{
        label: "Custo (R$)",
        data: [
          parseFloat(custoTotal.toFixed(2)), 
          parseFloat((custoTotal - economiaR$).toFixed(2))
        ], 
        //toFixed retorna uma string e o parseFloat converte de volta para um número
        borderColor: "#4caf50",
        backgroundColor: "#a5d6a7",
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
