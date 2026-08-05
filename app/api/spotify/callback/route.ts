import { NextRequest } from "next/server";

const TOKEN_URL = "https://accounts.spotify.com/api/token";

export async function GET(req: NextRequest) {
  const code  = req.nextUrl.searchParams.get("code");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code) {
    return new Response(`<html><body><h2>Error: ${error ?? "no code"}</h2></body></html>`, {
      headers: { "Content-Type": "text/html" },
    });
  }

  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type:   "authorization_code",
      code,
      redirect_uri: "http://localhost:3000/api/spotify/callback",
    }),
  });

  const data = await res.json();

  if (!data.refresh_token) {
    return new Response(
      `<html><body><h2>Something went wrong</h2><pre>${JSON.stringify(data, null, 2)}</pre></body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }

  return new Response(
    `<html>
      <body style="font-family:monospace;padding:40px;max-width:800px">
        <h2>Got it! Add this to .env.local:</h2>
        <pre style="background:#f0f0f0;padding:20px;border-radius:8px;word-break:break-all">SPOTIFY_REFRESH_TOKEN=${data.refresh_token}</pre>
        <p>Then remove the SPOTIFY_ACCESS_TOKEN line and restart the dev server.</p>
      </body>
    </html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
