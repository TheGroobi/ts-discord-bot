import YTDlpWrap from 'yt-dlp-wrap';
import fs, { createReadStream } from 'node:fs';
import { CommandInteraction, Message, VoiceBasedChannel } from 'discord.js';
import {
	AudioPlayer,
	AudioPlayerStatus,
	AudioResource,
	VoiceConnection,
	createAudioResource,
	getVoiceConnection,
	joinVoiceChannel,
} from '@discordjs/voice';
import { isValidURL } from '../utils/helper';
import { join } from 'node:path';
import { player } from '../bot';

const yt_dlp = new YTDlpWrap();
const songsDir = 'src/songs';
const songCount = fs.readdirSync(songsDir).length + 1;
const outputFile = `src/songs/song_${songCount}.ogg`;

async function downloadSong(url: string): Promise<string> {
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
			yt_dlp.exec(flags).on('close', () => resolve('Downloaded the song correctly!'))
		} catch (err) {
			console.error('Error downloading the song: ', err);
			reject(err);
		}
	});
}

function connectToVC(vc: VoiceBasedChannel): string {
	joinVoiceChannel({
		channelId: vc.id,
		guildId: vc.guild.id,
		adapterCreator: vc.guild.voiceAdapterCreator,
	});

	return 'Connecting to voice channel...';
}

async function playSong(
	url: string,
	vc: VoiceBasedChannel,
	i: CommandInteraction | Message
): Promise<void> {
	let msg = await downloadSong(url);

	if (i instanceof CommandInteraction) {
		await i.reply(msg);
	}

	connectToVC(vc);

	const connection = getVoiceConnection(vc.guild.id)!;

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

export async function pauseSong(player: AudioPlayer, i: CommandInteraction | Message) {
	if (player.state.status !== 'paused') {
		player.pause(true);
		await i.reply('Pausing the song');
	} else {
		try {
			player.unpause();
			await i.reply('Unpausing the song');
		} catch {
			await i.reply('There was a problem pausing the song, try again');
			return;
		}
	}
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

	playSong(url, member.voice.channel, i);
}

export async function stopCommand(player: AudioPlayer, i: Message | CommandInteraction) {
	if (player.state.status === 'idle') {
		i.reply('Nothing is currently playing');
		return;
	}

	if (player.stop()) {
		await i.reply('Stopped the current playing song');
	} else {
		await i.reply('Something went wrong stopping the song, please try again...');
	}
}
