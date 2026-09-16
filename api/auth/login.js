const crypto = require("crypto");

function base64url(buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

module.exports = (req, res) => {
  try {
    const codeVerifier = base64url(crypto.randomBytes(32));

    const codeChallenge = base64url(
      crypto.createHash("sha256").update(codeVerifier).digest()
    );

    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.MELI_CLIENT_ID,
      redirect_uri: "https://linkfay.vercel.app/api/auth/callback",
      code_challenge: codeChallenge,
      code_challenge_method: "S256"
    });

    res.setHeader(
      "Set-Cookie",
      meli_code_verifier=${encodeURIComponent(codeVerifier)}; Path=/; HttpOnly; Secure; SameSite=Lax
    );

    res.writeHead(302, {
      Location:
        "https://auth.mercadolivre.com.br/authorization?" +
        params.toString()
    });

    res.end();
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      message: "Erro ao iniciar autorização",
      error: error.message
    });
  }
};
