import YTDlpWrap from 'yt-dlp-wrap';
import fs, { createReadStream } from 'node:fs';
import { CommandInteraction, Message, VoiceBasedChannel } from 'discord.js';
import {
	AudioPlayer,
	AudioPlayerStatus,
	AudioResource,
	VoiceConnection,
	createAudioResource,
	joinVoiceChannel,
} from '@discordjs/voice';
import { isValidURL, removeAllSongs, removeLastPlayedSong } from '../utils/helper';
import { join } from 'node:path';
import { player } from '../bot';

const yt_dlp = new YTDlpWrap();
const songsDir = 'src/songs';

async function downloadSong(url: string): Promise<void> {
	let songCount =
		fs.readdirSync(songsDir).at(-1) !== undefined
			? Number(fs.readdirSync(songsDir).at(-1)?.split('.ogg')[0]) + 1
			: 1;
	// prettier-ignore
	return new Promise(async (resolve, reject) => {
		const flags = [
			url,
			'-f', 'bestaudio/best',
			'-o', `src/songs/${songCount}.ogg`,
			'--max-filesize', '10M',
			'--no-playlist',
			'--ffmpeg-location', 'C:/ffmpeg/bin',
			'--postprocessor-args', 'ffmpeg:-vn -acodec opus -b:a 192k',
		];

		try {
			console.log('Downloading audio...');
			yt_dlp.exec(flags).on('close', () => resolve()).on('ytDlpEvent', (eT, eD) => console.log(eT, eD))
		} catch (err) {
			console.error('Error downloading the song: ', err);
			reject(err);
		}
	});
}

function connectToVC(vc: VoiceBasedChannel): VoiceConnection {
	return joinVoiceChannel({
		channelId: vc.id,
		guildId: vc.guild.id,
		adapterCreator: vc.guild.voiceAdapterCreator,
		selfDeaf: true,
		selfMute: false,
	});
}

async function playSong(
	url: string,
	vc: VoiceBasedChannel,
	i: CommandInteraction | Message
): Promise<void> {
	if (player.state.status === 'playing') {
		i.reply(`Song added to the queue at position ${fs.readdirSync(songsDir).length}`);
		await downloadSong(url);
		return;
	}

	if (i instanceof CommandInteraction) {
		await i.reply('Cooking the song up...');
	}
	await downloadSong(url);

	const connection = connectToVC(vc);
	playNextSong(player, connection);

	player.on(AudioPlayerStatus.Idle, () => {
		removeLastPlayedSong();
		if (1 === fs.readdirSync(songsDir).length) {
			setTimeout(() => {
				connection.setSpeaking(false);
				connection.destroy();
			}, 2500);
		} else {
			playNextSong(player, connection);
		}
	});
}

function playNextSong(p: AudioPlayer, connection: VoiceConnection) {
	try {
		let song = createPlayableSongResource();
		connection.setSpeaking(true);
		p.play(song);
		connection.subscribe(p);
	} catch (e) {
		console.error(e);
	}
}

function createPlayableSongResource(): AudioResource {
	return createAudioResource(
		createReadStream(join(__dirname, `../songs/${fs.readdirSync(songsDir)[0]}`))
	);
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

	if (fs.readdirSync(songsDir).length === 10) {
		await i.reply('Max queue size is 10!');
		return;
	}

	playSong(url, member.voice.channel, i);
}

export async function stopCommand(p: AudioPlayer, i: Message | CommandInteraction) {
	if (p.state.status === 'idle') {
		i.reply('Nothing is currently playing');
		return;
	}

	if (p.stop()) {
		await i.reply('Stopped the bot');
		
	}

	removeAllSongs();

	await i.reply('Something went wrong stopping the song, please try again...');
}

export async function pauseCommand(p: AudioPlayer, i: CommandInteraction | Message) {
	if (p.state.status !== 'paused') {
		p.pause(true);
		await i.reply('Pausing the song');
	} else {
		try {
			p.unpause();
			await i.reply('Unpausing the song');
		} catch {
			await i.reply('There was a problem pausing the song, try again');
			return;
		}
	}
}
