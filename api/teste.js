export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'ok' });
  }

  var token = process.env.AIRTABLE_TOKEN;
  var baseId = process.env.AIRTABLE_BASE_ID;
  var d = req.body;

  try {
    var response = await fetch('https://api.airtable.com/v0/' + baseId + '/Pedidos', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        records: [{
          fields: {
            Nome: d.nome || 'Teste',
            Email: d.email || '',
            Destino: d.destino || '',
            Status: 'Pendente'
          }
        }]
      })
    });

    var data = await response.json();
    return res.status(200).json({ airtableStatus: response.status, data: data });
  } catch (err) {
    return res.status(200).json({ erro: err.message });
  }
}
