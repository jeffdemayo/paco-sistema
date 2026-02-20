import React, { useState, useEffect } from 'react';
import { menuInicial } from './database';

function App() {
  const [caixaAberto, setCaixaAberto] = useState(false);
  const [itensMenu, setItensMenu] = useState(menuInicial);
  const [registroAbertura, setRegistroAbertura] = useState(null);

  // --- PERSISTÊNCIA DE DADOS ---
  useEffect(() => {
    const dadosSalvos = localStorage.getItem('vendasPaco');
    const aberturaSalva = localStorage.getItem('aberturaPaco');
    if (dadosSalvos) {
      setItensMenu(JSON.parse(dadosSalvos));
      setCaixaAberto(true);
    }
    if (aberturaSalva) setRegistroAbertura(aberturaSalva);
  }, []);

  useEffect(() => {
    if (caixaAberto) {
      localStorage.setItem('vendasPaco', JSON.stringify(itensMenu));
      if (registroAbertura) localStorage.setItem('aberturaPaco', registroAbertura);
    }
  }, [itensMenu, caixaAberto, registroAbertura]);

  // --- FUNÇÕES DE NEGÓCIO ---
  const abrirTurno = () => {
    setRegistroAbertura(new Date().toLocaleString());
    setCaixaAberto(true);
  };

  const fecharTurno = () => {
    const totalFaturado = itensMenu.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    const totalPerdido = itensMenu.reduce((acc, item) => acc + (item.preco * item.quebra), 0);
    alert(`--- FECHAMENTO ---\nTotal Ganho: ${totalFaturado.toFixed(2)}€\nTotal Perdido: ${totalPerdido.toFixed(2)}€\n\nCaixa Zerado.`);

    localStorage.clear();
    setItensMenu(menuInicial);
    setCaixaAberto(false);
    setRegistroAbertura(null);
  };

  const registrarVenda = (id) => {
    setItensMenu(itensMenu.map(item => item.id === id ? { ...item, quantidade: item.quantidade + 1 } : item));
  };

  const removerVenda = (id) => {
    setItensMenu(itensMenu.map(item => item.id === id ? { ...item, quantidade: Math.max(0, item.quantidade - 1) } : item));
  };

  const registrarQuebra = (id) => {
    setItensMenu(itensMenu.map(item => item.id === id ? { ...item, quebra: item.quebra + 1 } : item));
  };

  const removerQuebra = (id) => {
    setItensMenu(itensMenu.map(item => item.id === id ? { ...item, quebra: Math.max(0, item.quebra - 1) } : item));
  };

  const categorias = [...new Set(menuInicial.map(item => item.categoria))];
  const faturamentoTotal = itensMenu.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Paco Bigotes PDV 2.5</h1>

      {!caixaAberto ? (
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <button onClick={abrirTurno} style={{ padding: '20px 40px', fontSize: '20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Abrir Novo Turno
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', backgroundColor: '#fff', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <span><strong>Início:</strong> {registroAbertura}</span>
            <span style={{ fontSize: '1.2em', color: 'green' }}><strong>Total: {faturamentoTotal.toFixed(2)}€</strong></span>
            <button onClick={fecharTurno} style={{ backgroundColor: '#ff4d4d', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer' }}>
              Fechar Caixa
            </button>
          </div>

          {categorias.map(cat => (
            <div key={cat} style={{ marginBottom: '30px' }}>
              <h2 style={{ borderBottom: '2px solid #ddd', paddingBottom: '5px', color: '#555' }}>{cat}</h2>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {itensMenu.filter(i => i.categoria === cat).map(item => (
                  <div key={item.id} style={{ backgroundColor: '#fff', border: '1px solid #ddd', padding: '15px', borderRadius: '8px', width: '200px', textAlign: 'center' }}>
                    <h4 style={{ margin: '5px 0' }}>{item.nome}</h4>
                    <p style={{ color: '#888', margin: '5px 0' }}>{item.preco.toFixed(2)}€</p>
                    <div style={{ fontSize: '1.5em', fontWeight: 'bold', margin: '10px 0' }}>x{item.quantidade}</div>

                    {/* BOTÕES DE VENDA LADO A LADO */}
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '8px' }}>
                      <button onClick={() => registrarVenda(item.id)} style={{ flex: 1, padding: '8px', cursor: 'pointer', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px' }}>+ Venda</button>
                      <button onClick={() => removerVenda(item.id)} style={{ flex: 1, padding: '8px', cursor: 'pointer', backgroundColor: '#eee', border: '1px solid #ccc', borderRadius: '4px' }}>- Venda</button>
                    </div>

                    {/* BOTÕES DE QUEBRA LADO A LADO */}
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <button onClick={() => registrarQuebra(item.id)} style={{ flex: 1, padding: '5px', cursor: 'pointer', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.75em' }}>+ Quebra</button>
                      <button onClick={() => removerQuebra(item.id)} style={{ flex: 1, padding: '5px', cursor: 'pointer', backgroundColor: '#cc0000', color: 'white', border: 'none', borderRadius: '4px', fontSize: '0.75em' }}>- Quebra</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;