fetch('/api/teste', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nome: 'Teste Final',
    email: 'gabriel.lorenzi@grupodicas.com',
    destino: 'Roma 3 dias',
    dataChegada: '2026-08-01',
    dataPartida: '2026-08-04',
    duracaoDias: 3,
    quantasPessoas: 2,
    viajantes: 'Casal',
    criancas: false,
    orcamento: 'Moderado',
    interesses: 'Gastronomia',
    primeiraVez: true
  })
}).then(r => r.json()).then(d => console.log('RESULTADO:', d))
