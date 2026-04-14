export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    res.status(400).send('ID não informado');
    return;
  }

  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;

  if (!token || !baseId) {
    res.status(500).send('<html><body><h1>Erro de configuração</h1><p>Token existe: ' + (!!token) + '</p><p>BaseID existe: ' + (!!baseId) + '</p></body></html>');
    return;
  }

  const url = `https://api.airtable.com/v0/${baseId}/Pedidos/${id}`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      res.status(404).send('<html><body><h1>Erro ao buscar roteiro</h1><p>Status: ' + response.status + '</p><p>URL: ' + url + '</p><p>Token primeiros 10: ' + token.substring(0,10) + '...</p><p>' + JSON.stringify(data) + '</p></body></html>');
      return;
    }

    const html = data.fields.HTML_Roteiro;

    if (!html) {
      res.status(200).send('<html><body><h1>Roteiro em preparação</h1><p>Tente novamente em alguns minutos!</p></body></html>');
      return;
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);

  } catch (err) {
    res.status(500).send('<html><body><h1>Erro interno</h1><p>' + err.message + '</p></body></html>');
  }
}
