import { list } from '@vercel/blob';

export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    res.status(400).send('<html><body><h1>ID nao informado</h1></body></html>');
    return;
  }

  try {
    const { blobs } = await list({ prefix: `hoteis/${id}.html` });

    if (!blobs || blobs.length === 0) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(200).send(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Hotéis em preparação</title>
          <style>
            body { font-family: sans-serif; max-width: 600px; margin: 100px auto; padding: 20px; text-align: center; }
            h1 { color: #00BCD4; }
            p { color: #6B7280; line-height: 1.6; }
          </style>
        </head>
        <body>
          <h1>Página de hotéis em preparação</h1>
          <p>Seus hotéis selecionados ainda estão sendo gerados. Aguarde alguns minutos e atualize a página.</p>
        </body>
        </html>
      `);
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
