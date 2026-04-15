export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).json({ status: 'ok', method: req.method });
  }

  var token = process.env.AIRTABLE_TOKEN;
  var baseId = process.env.AIRTABLE_BASE_ID;

  return res.status(200).json({
    tokenExiste: token ? true : false,
    tokenInicio: token ? token.substring(0, 8) : 'vazio',
    baseId: baseId || 'vazio',
    dados: req.body
  });
}
