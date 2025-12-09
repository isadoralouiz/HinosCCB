// --- 1. CONFIGURAÇÃO DE DADOS E VARIÁVEIS GLOBAIS ---
const HINARIOS_INFO = {
    // Ajuste o 'max' do Hinário 3 quando souber o número exato
    '3': { max: 300, file: 'hinos3.json', data: null }, 
    '4': { max: 450, file: 'hinos4.json', data: null },
    '5': { max: 481, file: 'hinos5.json', data: null }
};

const selectHinario = document.getElementById('hinario-select');
const inputNumber = document.getElementById('hino-number');
const contentArea = document.getElementById('hino-content');
const btnBuscar = document.getElementById('buscar-hino');

// --- 2. FUNÇÕES DE CARREGAMENTO E BUSCA ---

/**
 * Busca o arquivo JSON do hinário selecionado (se não foi carregado) 
 * usando o fetch.
 */
async function fetchJson(hinarioKey) {
    const info = HINARIOS_INFO[hinarioKey];

    // Retorna os dados se já estiverem em memória (evita re-carregar)
    if (info.data) {
        return info.data;
    }

    try {
        // Tenta carregar o arquivo JSON
        const response = await fetch(info.file);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Armazena os dados ('letras') para uso futuro
        info.data = data.letras; 
        
        return info.data;
        
    } catch (error) {
        console.error(`Erro ao carregar o Hinário ${hinarioKey} (${info.file}):`, error);
        // Exibe uma mensagem de erro na área de conteúdo
        contentArea.innerHTML = `
            <h2>Erro de Carregamento</h2>
            <p>Não foi possível carregar os dados do Hinário ${hinarioKey}.</p>
            <p>Por favor, verifique se o arquivo <strong>${info.file}</strong> está na mesma pasta.</p>
        `;
        contentArea.classList.add('ativo'); 
        return null;
    }
}

/**
 * Função principal: Carrega o hino, faz a validação e exibe a letra.
 */
async function carregarHino() {
    const hinario = selectHinario.value;
    const numero = inputNumber.value;
    const info = HINARIOS_INFO[hinario];
    const max = info.max;

    // 1. Validação
    if (numero < 1 || numero > max) {
        alert(`Por favor, digite um número de hino válido entre 1 e ${max} para o Hinário ${hinario}.`);
        return;
    }

    // 2. Carregamento dos Dados
    const letrasDoHinario = await fetchJson(hinario); 

    if (!letrasDoHinario) {
        // O erro foi tratado dentro de fetchJson
        return; 
    }

    const letra = letrasDoHinario[numero];

    // 3. Exibição e Transição (Efeito Subjetivo)
    // Remove a classe 'ativo' para iniciar o fade-out
    contentArea.classList.remove('ativo'); 

    setTimeout(() => {
        if (letra) {
            contentArea.innerHTML = `
                <h2>Hino nº ${numero} (Hinário ${hinario})</h2>
                <pre>${letra}</pre>
            `;
        } else {
            contentArea.innerHTML = `
                <h2>Hino nº ${numero} (Hinário ${hinario})</h2>
                <p>A letra deste hino (${numero}) ainda não foi inserida no arquivo JSON.</p>
            `;
        }
        // Adiciona a classe 'ativo' novamente para o fade-in
        contentArea.classList.add('ativo');
    }, 300); // 300ms corresponde à transição CSS (0.3s)
}


// --- 3. EVENT LISTENERS (INTERATIVIDADE) ---

// 1. Atualiza o máximo de hinos ao mudar o hinário
selectHinario.addEventListener('change', function() {
    const hinarioSelecionado = this.value;
    const maxHino = HINARIOS_INFO[hinarioSelecionado].max;
    
    inputNumber.max = maxHino;
    
    // Garante que o número digitado não ultrapasse o novo máximo
    if (parseInt(inputNumber.value) > maxHino) {
        inputNumber.value = 1;
    }
});

// 2. Chama a função de busca ao clicar no botão
btnBuscar.addEventListener('click', carregarHino);

// 3. Permite buscar hino pressionando Enter no campo de número
inputNumber.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        carregarHino();
    }
});

// Inicializa o valor máximo para o hinário padrão (4) ao carregar a página
selectHinario.dispatchEvent(new Event('change'));