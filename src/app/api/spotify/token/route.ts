import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
  const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return NextResponse.json(
      { error: "Missing Spotify credentials" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64")}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Spotify API Error:", response.status, errorText);
      return NextResponse.json(
        {
          error: `Failed to get access token: ${response.status} ${errorText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ access_token: data.access_token });
  } catch (error) {
    console.error("Error getting Spotify token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

