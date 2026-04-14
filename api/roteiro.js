import { put, list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { id, html } = req.body;

      if (!id || !html) {
        res.status(400).json({ error: 'ID e HTML são obrigatórios' });
        return;
      }

      const blob = await put(`roteiros/${id}.html`, html, {
        access: 'public',
        contentType: 'text/html; charset=utf-8',
        addRandomSuffix: false
      });

      res.status(200).json({ url: blob.url, id: id });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
    return;
  }

  const { id } = req.query;

  if (!id) {
    res.status(400).send('ID não informado');
    return;
  }

  try {
    const { blobs } = await list({ prefix: `roteiros/${id}.html` });

    if (!blobs || blobs.length === 0) {
      res.status(404).send('<html><body><h1>Roteiro não encontrado</h1><p>Verifique o link.</p></body></html>');
      return;
    }

    const response = await fetch(blobs[0].url);
    const html = await response.text();

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
  } catch (err) {
    res.status(500).send('<html><body><h1>Erro</h1><p>' + err.message + '</p></body></html>');
  }
}
