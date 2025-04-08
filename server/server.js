import SpotifyWebApi from "spotify-web-api-node";
import express from "express";
import { WebSocketServer } from "ws";
import fs from "fs";

const app = express();
const port = 3000;

const spotifyApi = new SpotifyWebApi({
  clientId: "38114792b11146ee98c8f57abe37dc91",
  clientSecret: "ed1731d1a5ab4c119845a4b493261b94",
  redirectUri: "http://localhost:3000/callback",
});

if (fs.existsSync("tokens.json")) {
  const tokens = JSON.parse(fs.readFileSync("tokens.json", "utf-8"));
  spotifyApi.setAccessToken(tokens.access_token);
  spotifyApi.setRefreshToken(tokens.refresh_token);
  console.log("Tokens loaded from file");
}

app.get("/login", (req, res) => {
  const scopes = ["user-modify-playback-state", "user-read-playback-state"];
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes);
  res.redirect(authorizeURL);
});

app.get("/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const data = await spotifyApi.authorizationCodeGrant(code);
    const { access_token, refresh_token } = data.body;

    spotifyApi.setAccessToken(access_token);
    spotifyApi.setRefreshToken(refresh_token);

    fs.writeFileSync(
      "tokens.json",
      JSON.stringify({ access_token, refresh_token })
    );

    res.send("Authentication succesful");
  } catch (error) {
    console.error("Authentication failed");
  }
});

const wss = new WebSocketServer({ port: 8080 });

const refreshToken = async () => {
  try {
    const data = await spotifyApi.refreshAccessToken();
    const newAccessToken = data.body.access_token;

    spotifyApi.setAccessToken(newAccessToken);

    const tokens = JSON.parse(fs.readFileSync("tokens.json", "utf-8"));
    tokens.access_token = newAccessToken;
    fs.writeFileSync("tokens.json", JSON.stringify(tokens));

    console.log("Access token refreshed");
  } catch (error) {
    console.error("Error refreshing access token:", error);
  }
};

wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", async (message) => {
    const { action } = JSON.parse(message.toString());

    if (action === "pause") {
      try {
        await refreshToken();
        await spotifyApi.pause();

        const playBackState = await spotifyApi.getMyCurrentPlaybackState();
        const status = playBackState.body.is_playing ? "playing" : "paused";

        ws.send(JSON.stringify({ status }));
      } catch (error) {
        console.error("Error pausing", error.body || error);
      }
    } else if (action === "play") {
      try {
        await refreshToken();
        await spotifyApi.play();

        const playBackState = await spotifyApi.getMyCurrentPlaybackState();
        const status = playBackState.body.is_playing ? "playing" : "paused";

        ws.send(JSON.stringify({ status }));
      } catch (error) {
        console.error("Error playing", error.body || error);
      }
    } else if (action === "forward") {
      try {
        await refreshToken();
        await spotifyApi.skipToNext();

        const playBackState = await spotifyApi.getMyCurrentPlaybackState();
        const status = playBackState.body.is_playing ? "playing" : "paused";

        ws.send(JSON.stringify({ status }));
      } catch (error) {
        console.error("Error forwarding", error.body || error);
      }
    } else if (action === "backward") {
      try {
        await refreshToken();
        await spotifyApi.skipToPrevious();

        const playBackState = await spotifyApi.getMyCurrentPlaybackState();
        const status = playBackState.body.is_playing ? "playing" : "paused";

        ws.send(JSON.stringify({ status }));
      } catch (error) {
        console.error("Error backwarding", error.body || error);
      }
    }
  });

  ws.on("close", () => console.log("Client disconnected"));
});

app.listen(port, () => {
  console.log(`Server running at http:localhost:${port}`);
});
