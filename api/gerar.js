import { put } from '@vercel/blob';

export const maxDuration = 300;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const dados = req.body;

    const prompt = `Você é um especialista em viagens do Grupo Dicas (grupodicas.com), o maior site de dicas de viagem do Brasil. Crie um roteiro de viagem personalizado, detalhado e com foco em ajudar brasileiros a economizar.

## DADOS DO USUÁRIO

- Nome: ${dados.nome}
- Destino: ${dados.destino}
- Data de ida: ${dados.dataChegada}
- Data de volta: ${dados.dataPartida}
- Duração: ${dados.duracaoDias} dias
- Número de pessoas: ${dados.quantasPessoas}
- Tipo de viajante: ${dados.viajantes}
- Crianças: ${dados.criancas}
- Estilo de viagem: ${dados.orcamento}
- Interesses: ${dados.interesses}
- Primeira vez no destino: ${dados.primeiraVez}

## FORMATO DE SAÍDA

Gere APENAS código HTML completo (sem explicações, sem markdown, sem backticks). O HTML deve usar:
- Fonte: Poppins (Google Fonts)
- Cores: Primária #00BCD4, Secundária #E91E8C
- CSS com variáveis: --primary, --primary-dark (#0097A7), --primary-light (#E0F7FA), --magenta (#E91E8C), --text (#1A1A2E), --text-light (#6B7280), --gray (#F3F4F6), --success (#10B981), --warning (#F59E0B)
- Design responsivo, moderno e profissional
- Pronto para visualizar no navegador

## SEÇÕES OBRIGATÓRIAS (TODAS devem estar presentes)

### 1. CAPA
- Fundo gradiente com --primary e --primary-dark
- Logo "GRUPO DICAS" (GRUPO em branco, DICAS em opacidade 0.8) com ícone ✈️
- Badge "Roteiro Personalizado"
- Título grande com países/destinos
- Subtítulo com cidades separadas por •
- Info cards: datas, número de pessoas, estilo de viagem
- Rodapé: "Preparado especialmente para [Nome]"

### 2. RESUMO DA VIAGEM
- Grid 2x2: Data Chegada, Data Partida, Duração (dias/noites), Viajantes
- Timeline visual dos destinos com dots numerados, bandeiras dos países, dias em cada cidade
- OBRIGATÓRIO: Box de clima/temperatura esperada para CADA cidade no período da viagem

### 3. ONDE FICAR
- Texto dizendo que são hotéis que a equipe já ficou e indica
- Box verde de dica de economia sobre cancelamento gratuito
- Para CADA cidade: título com bandeira, melhor região explicada, 2 hotéis com:
  - Badge de nota do Booking (mínimo 8.0) em verde
  - Número de avaliações (mínimo 700)
  - Descrição curta
  - Tags de distância a pé dos pontos turísticos
  - Botão "Ver preços e fotos →" com link do Booking

### 4. ANTES DE VIAJAR (CHECKLIST)
- Seções: Documentação, Reservas/Ingressos, Itens para levar
- Grid 2 colunas com checkboxes
- Se Europa: destacar SEGURO VIAGEM OBRIGATÓRIO

### 5. ROTEIRO DIA A DIA (OBRIGATÓRIO PARA TODOS OS DIAS)
Para CADA dia da viagem:
- Header com gradiente: número do dia, título criativo, data, localização
- Timeline de atividades (linha vertical com dots) com 4-6 atividades por dia
- Cada atividade DEVE ter:
  - Horário em cor --primary
  - Título com emoji
  - Descrição envolvente (2-3 frases)
  - Tags de detalhes: preço em R$, duração, tipo
  - Dica especial em box com fundo --primary-light
  - Box "Próxima parada" com tempo de deslocamento
  - OBRIGATÓRIO: Botão CTA com link de afiliado da Civitatis para TODAS as atrações
- Re
