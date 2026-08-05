// Two modes — use whichever you have:
//
// QUICK TEST (access token expires in ~1 hour, regenerate at developer.spotify.com):
//   SPOTIFY_ACCESS_TOKEN=your_token_here
//
// PRODUCTION (permanent, never expires):
//   SPOTIFY_CLIENT_ID=...
//   SPOTIFY_CLIENT_SECRET=...
//   SPOTIFY_REFRESH_TOKEN=...
//
// To get a permanent refresh token:
//   1. developer.spotify.com → create an app → add http://localhost:3000 as redirect URI
//   2. Visit: https://accounts.spotify.com/authorize?client_id=CLIENT_ID&response_type=code
//             &redirect_uri=http://localhost:3000&scope=user-read-currently-playing
//   3. Copy the `code` param from the redirect URL, then run:
//      curl -X POST https://accounts.spotify.com/api/token \
//        -u "CLIENT_ID:CLIENT_SECRET" \
//        -H "Content-Type: application/x-www-form-urlencoded" \
//        -d "grant_type=authorization_code&code=CODE&redirect_uri=http://localhost:3000"
//   4. Copy refresh_token → add to .env.local

const NOW_PLAYING = "https://api.spotify.com/v1/me/player/currently-playing";
const TOKEN_URL   = "https://accounts.spotify.com/api/token";

async function getAccessToken(): Promise<string | null> {
  // Mode 1: direct access token (quick test, ~1hr lifespan)
  if (process.env.SPOTIFY_ACCESS_TOKEN) {
    return process.env.SPOTIFY_ACCESS_TOKEN;
  }

  // Mode 2: refresh token flow (permanent)
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_REFRESH_TOKEN } = process.env;
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET || !SPOTIFY_REFRESH_TOKEN) return null;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type:    "refresh_token",
      refresh_token: SPOTIFY_REFRESH_TOKEN,
    }),
  });

  const data = await res.json();
  return data.access_token ?? null;
}

export async function GET() {
  try {
    const access_token = await getAccessToken();
    if (!access_token) return Response.json({ isPlaying: false });

    const res = await fetch(NOW_PLAYING, {
      headers: { Authorization: `Bearer ${access_token}` },
      cache: "no-store",
    });

    if (res.status === 204 || res.status >= 400) {
      return Response.json({ isPlaying: false });
    }

    const data = await res.json();

    if (!data?.is_playing || data?.item?.type !== "track") {
      return Response.json({ isPlaying: false });
    }

    return Response.json({
      isPlaying:  true,
      title:      data.item.name,
      artist:     data.item.artists.map((a: { name: string }) => a.name).join(", "),
      albumArt:   data.item.album.images[0]?.url ?? null,
      songUrl:    data.item.external_urls.spotify,
      previewUrl: data.item.preview_url ?? null,
    });
  } catch {
    return Response.json({ isPlaying: false });
  }
}
