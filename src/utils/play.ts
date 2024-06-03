import YTDlpWrap from 'yt-dlp-wrap';
import fs from 'node:fs';
import { VoiceBasedChannel } from 'discord.js';
import {
	NoSubscriberBehavior,
	createAudioPlayer,
	getVoiceConnection,
	joinVoiceChannel,
} from '@discordjs/voice';

const yt_dlp = new YTDlpWrap();

function downloadSong(url: string): void {
	// prettier-ignore
	const flags = [
        url,
        '-f', 'bestaudio/best',
        '-o', `src/songs/song_${fs.readdirSync('src/songs').length + 1}.opus`,
        '--max-filesize', '10M',
        '--no-playlist',
        '--ffmpeg-location', 'C:/ffmpeg/bin',
        '--postprocessor-args', 'ffmpeg:-vn -acodec opus -b:a 192k'
	];

	console.log('Downloading the song...');

	let ytDlpEventEmitter = yt_dlp
		.exec(flags)
		.on('ytDlpEvent', (eventType, eventData) => console.log(eventType, eventData))
		.on('error', e => console.error(e));
	console.log(ytDlpEventEmitter.ytDlpProcess?.pid);
}

function connectToVC(vc: VoiceBasedChannel): void {
	joinVoiceChannel({
		channelId: vc.id,
		guildId: vc.guild.id,
		adapterCreator: vc.guild.voiceAdapterCreator,
	});
}

export function playSong(url: string, vc: VoiceBasedChannel): void {
	downloadSong(url)
	connectToVC(vc)
	const connection = getVoiceConnection(vc.guild.id);
	const player = createAudioPlayer({
		behaviors: {
			noSubscriber: NoSubscriberBehavior.Pause,
		},
	});

	// const audioPlayer = connection?.subscribe()
}
