import YTDlpWrap from 'yt-dlp-wrap';
import fs from 'node:fs';

const yt_dlp = new YTDlpWrap();

export function downloadSong(url: string): void {
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
		.on('ytDlpEvent', (eventType, eventData) => console.log(eventData))
		.on('error', e => console.error(e));
	console.log(ytDlpEventEmitter.ytDlpProcess?.pid);
}
