import YTDlpWrap from 'yt-dlp-wrap';
import fs, { createReadStream } from 'node:fs';
import { CommandInteraction, Message, VoiceBasedChannel } from 'discord.js';
import {
	AudioPlayer,
	AudioPlayerStatus,
	AudioResource,
	NoSubscriberBehavior,
	VoiceConnection,
	createAudioPlayer,
	createAudioResource,
	getVoiceConnection,
	joinVoiceChannel,
} from '@discordjs/voice';
import { isValidURL } from '../utils/helper';
import { join } from 'node:path';

const yt_dlp = new YTDlpWrap();
const songsDir = 'src/songs';
const songCount = fs.readdirSync(songsDir).length + 1;
const outputFile = `src/songs/song_${songCount}.ogg`;

async function downloadSong(url: string): Promise<void> {
	console.log('Downloading the song...');

	// prettier-ignore
	return new Promise(async (resolve, reject) => {
		const flags = [
			url,
			'-f', 'bestaudio/best',
			'-o', outputFile,
			'--max-filesize', '10M',
			'--no-playlist',
			'--ffmpeg-location', 'C:/ffmpeg/bin',
			'--postprocessor-args', 'ffmpeg:-vn -acodec opus -b:a 192k',
		];

		try {
			console.log('Downloading audio...');
			yt_dlp.exec(flags).on('close', () => resolve())
		} catch (err) {
			console.error('Error downloading the song: ', err);
			reject(err);
		}
	});
}

function connectToVC(vc: VoiceBasedChannel): void {
	joinVoiceChannel({
		channelId: vc.id,
		guildId: vc.guild.id,
		adapterCreator: vc.guild.voiceAdapterCreator,
	});
}

async function playSong(url: string, vc: VoiceBasedChannel): Promise<void> {
	await downloadSong(url);
	connectToVC(vc);

	const connection = getVoiceConnection(vc.guild.id)!;
	const player = createAudioPlayer({
		behaviors: {
			noSubscriber: NoSubscriberBehavior.Pause,
		},
	});

	let queueIndex: number = 0;
	playNextSong(player, connection, queueIndex);

	player.on(AudioPlayerStatus.Idle, () => {
		queueIndex++;
		//remove the song played from the folder/queue
		if (queueIndex + 1 > fs.readdirSync('src/songs').length) {
			setTimeout(() => {
				connection.destroy();
			}, 5000);
		} else {
			playNextSong(player, connection, queueIndex);
		}
	});
}

function getNextSong(i: number) {
	return createPlayableSongResource(i);
}

function playNextSong(player: AudioPlayer, connection: VoiceConnection, queueIndex: number) {
	try {
		let song = getNextSong(queueIndex);
		console.log('Getting the song with index: ', queueIndex);
		player.play(song);
		connection.subscribe(player);
	} catch (e) {
		console.error(e);
	}
}

function createPlayableSongResource(index: number): AudioResource {
	return createAudioResource(
		createReadStream(join(__dirname, `../songs/${fs.readdirSync(songsDir)[index]}`))
	);
}

export function pauseSong(player: AudioPlayer, paused: Boolean) {
	if (!paused) {
		player.pause(true);
	} else {
		player.unpause();
	}
	return (paused = !paused);
}

export async function playCommand(url: string, i: Message | CommandInteraction): Promise<void> {
	let member = i instanceof Message ? i.member : i.guild?.members.cache.get(i.user.id);

	if (!isValidURL(url)) {
		await i.reply('The URL provided is not a valid song link, please try with a valid URL.');
		return;
	}

	if (!member?.voice.channel) {
		await i.reply('You must be connected to a voice channel to play a song.');
		return;
	}

	playSong(url, member.voice.channel);
}
