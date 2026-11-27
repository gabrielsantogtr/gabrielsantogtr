const visor = document.querySelector('#visor');
let atual = '0';
let anterior = null;
let operacao = null;
let novo = false;

function mostrar() {
    visor.textContent = atual.replace('.', ',');
}

function digitar(numero) {
    if (novo || atual === 'Erro') {
        atual = '0';
        novo = false;
    }
    if (numero === '.') {
        if (!atual.includes('.')) atual += '.';
    } else if (atual.length < 15) {
        atual = atual === '0' ? numero : atual + numero;
    }
}

function calcular() {
    if (anterior === null || operacao === null || novo) return;
    const b = Number(atual);
    let resultado;
    switch (operacao) {
        case '+': resultado = anterior + b; break;
        case '-': resultado = anterior - b; break;
        case '*': resultado = anterior * b; break;
        case '/': resultado = b === 0 ? NaN : anterior / b; break;
    }
    atual = Number.isFinite(resultado) ? String(Number(resultado.toPrecision(12))) : 'Erro';
    anterior = null;
    operacao = null;
    novo = true;
}

function escolher(op) {
    if (atual === 'Erro') return;
    if (operacao && !novo) calcular();
    if (atual === 'Erro') return;
    anterior = Number(atual);
    operacao = op;
    novo = true;
}

function acao(tipo) {
    if (tipo === 'limpar') {
        atual = '0';
        anterior = null;
        operacao = null;
        novo = false;
    } else if (tipo === 'apagar' && !novo) {
        atual = atual === 'Erro' ? '0' : atual.slice(0, -1) || '0';
        if (atual === '-') atual = '0';
    } else if (tipo === 'igual') calcular();
}

document.querySelector('.teclas').addEventListener('click', (evento) => {
    const botao = evento.target.closest('button');
    if (!botao) return;
    if (botao.dataset.num !== undefined) digitar(botao.dataset.num);
    else if (botao.dataset.op) escolher(botao.dataset.op);
    else acao(botao.dataset.acao);
    mostrar();
});
document.addEventListener('keydown', (evento) => {
    if (evento.target.tagName === 'BUTTON' && evento.key === 'Enter') return;
    const tecla = evento.key;
    if (/^[0-9.,]$/.test(tecla)) digitar(tecla === ',' ? '.' : tecla);
    else if (['+', '-', '*', '/'].includes(tecla)) escolher(tecla);
    else if (tecla === 'Enter' || tecla === '=') acao('igual');
    else if (tecla === 'Escape') acao('limpar');
    else if (tecla === 'Backspace') acao('apagar');
    else return;
    evento.preventDefault();
    mostrar();
});
