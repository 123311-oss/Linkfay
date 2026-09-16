const crypto = require("crypto");

module.exports = (req, res) => {
  const codeVerifier = crypto.randomBytes(32).toString("base64url");

  const codeChallenge = crypto
    .createHash("sha256")
    .update(codeVerifier)
    .digest("base64url");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.MELI_CLIENT_ID,
    redirect_uri: "https://linkfay.vercel.app/api/auth/callback",
    code_challenge: codeChallenge,
    code_challenge_method: "S256",
  });

  res.setHeader(
    "Set-Cookie",
    meli_code_verifier=${codeVerifier}; Path=/; HttpOnly; Secure; SameSite=Lax
  );

  res.writeHead(302, {
    Location: https://auth.mercadolivre.com.br/authorization?${params.toString()},
  });

  res.end();
};
