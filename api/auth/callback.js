module.exports = (req, res) => { 
  const { code, error } = req.query;

  if (error) {
    return res.status(400).json({
      ok: false,
      error: error
    });
  }

  if (!code) {
    return res.status(200).json({
      ok: true,
      message: "Callback do Mercado Livre ativo."
    });
  }

  return res.status(200).json({
    ok: true,
    message: "Código do Mercado Livre recebido."
  });
};
