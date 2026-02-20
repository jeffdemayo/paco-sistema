import React, { useState } from 'react';
import { menuInicial } from './database';

function App() {
  const [caixaAberto, setCaixaAberto] = useState(false);
  const [itensMenu, setItensMenu] = useState(menuInicial);
  const [registroAbertura, setRegistroAbertura] = useState(null);

  const abrirTurno = () => {
    setRegistroAbertura(new Date().toLocaleString()); // Guarda data e hora
    setCaixaAberto(true);
  };

  const fecharTurno = () => {
    const dataFechamento = new Date().toLocaleString();
    const total = itensMenu.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    
    // Gerando o resumo do turno para o "arquivo"
    const resumo = `
      --- RELATÓRIO DE FECHAMENTO ---
      Restaurante: Paco Bigotes
      Abertura: ${registroAbertura}
      Fechamento: ${dataFechamento}
      Total Faturado: ${total.toFixed(2)}€
      -------------------------------
    `;
    
    alert(resumo); // Mostra o relatório na tela
    console.log(resumo); // Salva no log do navegador

    // Lógica para zerar tudo para o próximo
    setItensMenu(menuInicial);
    setCaixaAberto(false);
    setRegistroAbertura(null);
  };

  const registrarVenda = (id) => {
    const novaLista = itensMenu.map((item) => {
      if (item.id === id) {
        return { ...item, quantidade: item.quantidade + 1 };
      }
      return item;
    });
    setItensMenu(novaLista);
  };

  const faturamentoTotal = itensMenu.reduce(
    (acc, item) => acc + item.preco * item.quantidade, 
    0
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Paco Bigotes - PDV 2.0</h1>
      
      {!caixaAberto ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <p>O sistema está bloqueado. Inicie o turno de trabalho.</p>
          <button onClick={abrirTurno} style={{ padding: '15px 30px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '18px' }}>
            Abrir Caixa
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p><strong>Aberto em:</strong> {registroAbertura}</p>
            <button onClick={fecharTurno} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', cursor: 'pointer' }}>
              Encerrar Turno e Gerar Relatório
            </button>
          </div>
          
          <hr />
          <h2>Faturamento Atual: <span style={{color: 'green'}}>{faturamentoTotal.toFixed(2)}€</span></h2>
          
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '20px' }}>
            {itensMenu.map((item) => (
              <div key={item.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', width: '150px', textAlign: 'center', backgroundColor: '#fff' }}>
                <h3>{item.nome}</h3>
                <p>{item.preco.toFixed(2)}€</p>
                <p>Qtd: <strong>{item.quantidade}</strong></p>
                <button onClick={() => registrarVenda(item.id)} style={{ cursor: 'pointer', width: '100%' }}>Vender</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;