const { Redis } = require("@upstash/redis");

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

// Busca o token salvo de um usuário específico
async function getStoredTokens(userId) {
  const data = await redis.get(`meli:tokens:${userId}`);
  return data || null;
}

// Salva (ou atualiza) o token de um usuário no Redis
async function saveTokens(userId, tokens) {
  await redis.set(`meli:tokens:${userId}`, {
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    user_id: userId,
    scope: tokens.scope,
    expires_in: tokens.expires_in,
    saved_at: Date.now()
  });
}

// Pede um novo access_token pro Mercado Livre usando o refresh_token
async function refreshAccessToken(refreshToken) {
  const response = await fetch(
    "https://api.mercadolibre.com/oauth/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.MELI_CLIENT_ID,
        client_secret: process.env.MELI_CLIENT_SECRET,
        refresh_token: refreshToken
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Falha ao renovar token: ${JSON.stringify(data)}`
    );
  }

  return data;
}

// Função principal: devolve um access_token válido, renovando se preciso
async function getValidAccessToken(userId) {
  const stored = await getStoredTokens(userId);

  if (!stored) {
    return null;
  }

  const
