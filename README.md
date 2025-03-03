# 🎵 TypeScript Discord Bot

> [!CAUTION]
> The bot currently is currently barely usable, there still may be some issues with playing the songs, queuing etc. 
> I haven't looked at this project in a while but there are plans of finishing it someday.

This is a simple Discord bot written in TypeScript that provides basic music playback functionality using `yt-dlp` wrapper written in ts.
The bot allows users to play, pause, and stop music in a voice channel.

The Bot currently handles:
- Spotify
- Youtube
- SoundCloud

## Commands

`/ping`

Replies with "Pong!" to check if the bot is working.

`/play <YouTube-Link>`

Downloads and converts the song to Opus, then plays it in the voice channel.

-   If no song is currently playing, it starts immediately.
-   If a song is playing, it adds the new song to the queue.
-   If you are not connected to a voice channel the song will not play

`/pause`

Pauses the current playing song.
If paused before, resumed the paused song.

`/quit`

Disconnects the bot from the voice channel and clears the queue.

## Installation & Setup

### Prerequisites

-   Node.js (latest LTS recommended)
-   TypeScript
-   `ffmpeg` installed and added to system path
-   `yt-dlp` installed (`pip install yt-dlp`)
-   A Discord Application with a bot token

### Clone the Repository

```sh
git clone https://github.com/TheGroobi/ts-discord-bot.git
cd ts-discord-bot
```

### Install Dependencies

```sh
npm install
```

-   Copy the example environment file and fill in with your env variables:

```sh
cp .env.example .env
```

-   Compile Typescript

```sh
npx tsc
```

-   Start the bot

```sh
npm start
```

Or if you're using Ts-node, simply:

```sh
npm start
```
