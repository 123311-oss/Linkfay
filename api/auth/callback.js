module.exports = async (req, res) => {
  const { code, error } = req.query;

  if (error) {
    return res.status(400).json({
      ok: false,
      error
    });
  }

  if (!code) {
    return res.status(400).json({
      ok: false,
      message: "Código de autorização não recebido."
    });
  }

  try {
    const response = await fetch("https://api.mercadolibre.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.MELI_CLIENT_ID,
        client_secret: process.env.MELI_CLIENT_SECRET,
        code,
        redirect_uri: "https://linkfay.vercel.app/api/auth/callback"
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        ok: false,
        error: data
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Mercado Livre conectado com sucesso!",
      user_id: data.user_id,
      scope: data.scope
    });

  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "Erro ao conectar com o Mercado Livre."
    });
  }
};
