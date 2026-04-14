export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    res.status(400).json({ error: 'ID não informado' });
    return;
  }

  try {
    const response = await fetch(
      `https://api.airtable.com/v0/${process.env.AIRTABLE_BASE_ID}/Pedidos/${id}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.AIRTABLE_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      res.status(404).send('<html><body><h1>Roteiro não encontrado</h1><p>Verifique o link.</p></body></html>');
      return;
    }

    const data = await response.json();
    const html = data.fields.HTML_Roteiro;

    if (!html) {
      res.status(200).send('<html><body><h1>Roteiro em preparação</h1><p>Tente novamente em alguns minutos!</p></body></html>');
      return;
    }

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);

  } catch (err) {
    res.status(500).send('<html><body><h1>Erro</h1><p>Tente novamente.</p></body></html>');
  }
}
