// Seleciona os elementos do DOM que serão manipulados
let cardContainer = document.querySelector(".card-container");
let campoBusca = document.querySelector("header input");
let dados = []; // Inicializa a variável que armazenará os dados do JSON

// Adiciona um ouvinte de evento para detectar quando a tecla "Enter" é pressionada no input
campoBusca.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        iniciarBusca();
    }
});

// Função assíncrona principal que gerencia a busca
async function iniciarBusca() {
    // Remove a classe que centraliza o layout, permitindo que o conteúdo suba e os resultados apareçam
    document.body.classList.remove("centralizado");
    
    // Verifica se os dados já foram carregados. Se não, faz o fetch do arquivo JSON.
    if (dados.length === 0) {
    try {
        let resposta = await fetch("data.json");
        dados = await resposta.json();
    } catch (erro) {
        console.error("Erro ao carregar dados:", erro);
        return;
    }
}

// Obtém o valor digitado pelo usuário e converte para minúsculas para garantir a comparação correta
const termoBusca = campoBusca.value.toLowerCase();

// Filtra o array de dados verificando se o termo ou a definição incluem o texto digitado
const dadosFiltrados = dados.filter(dado => dado.termo.toLowerCase().includes(termoBusca) || dado.definicao.toLowerCase().includes(termoBusca)
);

// Chama a função responsável por desenhar os cards na tela com os dados filtrados
renderizarCards(dadosFiltrados);
}

// Função que cria o HTML dos cards e os insere na página
function renderizarCards(dados) {
    // Limpa o conteúdo anterior do container para não duplicar resultados
    cardContainer.innerHTML = "";

    if (dados.length === 0) {
        cardContainer.innerHTML = `
            <div class="sem-resultados">
                <p class="mensagem-erro">Oops! Não encontramos o termo pesquisado :(</p>
                <p class="subtitulo-erro">Ajude a expandir nosso dicionário sugerindo este termo:</p>
                <form id="form-sugestao">
                    <!-- SUBSTITUA OS 'entry.XXXXXX' PELOS CÓDIGOS DO SEU GOOGLE FORMS -->
                    <input type="text" name="entry.1013709710" placeholder="Termo sugerido" value="${campoBusca.value}" required>
                    <textarea name="entry.1805336365" placeholder="Definição (opcional)" rows="4"></textarea>
                    <input type="text" name="entry.1475568582" placeholder="Seu nome (opcional)">
                    <button type="submit">Enviar</button>
                </form>
            </div>
        `;

        // Adiciona o evento de envio ao formulário recém-criado
        document.getElementById("form-sugestao").addEventListener("submit", function(e) {
            e.preventDefault(); // Impede o recarregamento da página
            
            // URL de envio do Google Forms (note o /formResponse no final em vez de /viewform)
            const googleFormUrl = "https://docs.google.com/forms/u/0/d/e/1FAIpQLSfYnJH5Av5iJOVlCHCZiSoAr4XYMLrQIQ7fyD6UWAbHDx5QXQ/formResponse";
            
            const formData = new FormData(this);

            fetch(googleFormUrl, {
                method: "POST",
                mode: "no-cors", // Necessário para enviar dados para o Google de outro site
                body: formData
            }).then(() => {
                alert("Obrigado! Sua sugestão foi enviada para nossa equipe.");
                this.reset(); // Limpa o formulário
            }).catch((erro) => {
                console.error("Erro:", erro);
                alert("Houve um erro ao enviar. Tente novamente.");
            });
        });

        return;
    }

    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
        <h2>${dado.termo}</h2>
        <p>${dado.definicao}</p>
        `
        cardContainer.appendChild(article);
    }
}