import { put } from '@vercel/blob';

export const maxDuration = 300;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const dados = req.body;

    const prompt = `Voce e um especialista em viagens do Grupo Dicas (grupodicas.com), o maior site de dicas de viagem do Brasil. Crie um roteiro de viagem personalizado, detalhado e com foco em ajudar brasileiros a economizar.

DADOS DO USUARIO
- Nome: ${dados.nome}
- Destino: ${dados.destino}
- Data de ida: ${dados.dataChegada}
- Data de volta: ${dados.dataPartida}
- Duracao: ${dados.duracaoDias} dias
- Numero de pessoas: ${dados.quantasPessoas}
- Tipo de viajante: ${dados.viajantes}
- Criancas: ${dados.criancas}
- Estilo de viagem: ${dados.orcamento}
- Interesses: ${dados.interesses}
- Primeira vez no destino: ${dados.primeiraVez}

FORMATO DE SAIDA
Gere APENAS codigo HTML completo (sem explicacoes, sem markdown, sem backticks). O HTML deve usar fonte Poppins (Google Fonts), cores primaria #00BCD4 e secundaria #E91E8C, design responsivo e moderno.

SECOES OBRIGATORIAS

1. CAPA - Fundo gradiente cyan, logo GRUPO DICAS, badge Roteiro Personalizado, titulo com paises, datas, numero de pessoas, estilo viagem, nome do viajante.

2. RESUMO DA VIAGEM - Grid com datas, duracao, viajantes. Timeline dos destinos com bandeiras. OBRIGATORIO: clima e temperatura de CADA cidade no periodo.

3. ONDE FICAR - Para CADA cidade: melhor regiao, 2 hoteis com nota Booking minimo 8.0, avaliacoes 700+, distancias a pe, botao com link Booking. Destacar cancelamento gratuito.

4. ANTES DE VIAJAR - Checklist: documentos, reservas, itens. Se Europa: SEGURO VIAGEM OBRIGATORIO.

5. ROTEIRO DIA A DIA - Para CADA dia: header com gradiente, titulo criativo, 4-6 atividades com horario, emoji, descricao envolvente, preco em R$, dicas, distancia proxima parada, botao CTA Civitatis para TODAS atracoes. Resumo do dia com passos e gastos.

6. TRANSPORTE ENTRE CIDADES - Box amarelo com 3 opcoes, precos, recomendacao.

7. DICAS PARA ECONOMIZAR - 6 dicas em cards grid 2x3.

8. BOXES DOS PARCEIROS - TODOS obrigatorios:
a) Seguro Viagem (verde #059669) - Link: https://www.seguroviagem.srv.br/?ag=215&lead_tag=App_[Pais]&promo=18exclusivogrupodicas - NUNCA citar Seguros Promo
b) Chip de Viagem (roxo #7C3AED) - Link: https://americachip.com/?oid=12&affid=103&sub1=App - NUNCA citar America Chip
c) Conta Global (vermelho #DC2626) - Cupom GABRIELLORENZI20 - Link: https://nomad.onelink.me/wIQT/gabriellorenzi15 - NUNCA citar Nomad
d) Aluguel de Carros (laranja #EA580C) - Link: https://www.rentcars.com/pt-br/?campaign=App&content=[Pais]&requestorid=42&source=Carro - NUNCA citar RentCars

9. CONTRACAPA - Fundo escuro, logo, tagline, site, icones sociais, nome viajante.

LINKS DE AFILIADOS
CIVITATIS (passeios e ingressos): https://www.civitatis.com/pt/[cidade]/[passeio]/?aid=3472&cmp=App_[Pais]
BOOKING (hoteis - UNICO que pode citar nome): https://www.booking.com/hotel/[codigo-pais]/[nome-hotel].pt-br.html?aid=390200&label=App_[Pais]
RAIL EUROPE (trens - nunca citar nome): https://click.linksynergy.com/deeplink?id=czqBaUUVmPg&mid=42638&murl=https%3A%2F%2Fwww.raileurope.com%2F%3Fcountry%3DBR%26locale%3Dpt%26currency%3DEUR&u1=App

TOM DE VOZ: Amigavel, como amigo que ja foi. Entusiasmo genuino. Precos em R$. Vendedor sutil nos links.

Retorne APENAS o HTML completo, comecando com <!DOCTYPE html>.`;

    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 60000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    const claudeData = await claudeResponse.json();

    if (!claudeData.content || !claudeData.content[0]) {
      res.status(500).json({ error: 'Claude nao retornou conteudo', details: claudeData });
      return;
    }

    let html = claudeData.content[0].text;
    html = html.replace(/^```html\s*/i, '').replace(/```\s*$/i, '').trim();

    const blob = await put('roteiros/' + dados.recordId + '.html', html, {
      access: 'public',
      contentType: 'text/html; charset=utf-8',
      addRandomSuffix: false
    });

    res.status(200).json({
      success: true,
      url: 'https://grupo-dicas-roteiro.vercel.app/api/roteiro?id=' + dados.recordId
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
