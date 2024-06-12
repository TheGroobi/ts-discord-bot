import path from 'node:path';
import fs from 'node:fs';

export function loadModule<T>(modulePath: string): T {
	return require(modulePath) as T;
}
export function isValidURL(str: string): boolean {
	const pattern = new RegExp(
		'^(https?:\\/\\/)?' + // protocol
			'((open\\.)?spotify\\.com\\/|' + // Spotify
			'(www\\.)?(youtube\\.com|youtu\\.be)\\/|' + // YouTube
			'(www\\.)?soundcloud\\.com\\/)' + // SoundCloud
			'.*$',
		'i' // rest of the URL
	);
	return pattern.test(str);
}

const songsDir = 'src/songs';

export function removeLastPlayedSong() {
	fs.readdir(songsDir, (err, f) => {
		if (err) {
			console.error(`Unable to scan directory: ${err}`);
			return;
		}

		const filePath = path.join(songsDir, f[0]);
		fs.unlink(filePath, err => {
			if (err) {
				console.error(`Unable to delete file: ${filePath}`);
				return;
			}
			console.log(`Deleted file: ${filePath}`);
		});
	});
}

export function removeAllSongs() {
	fs.readdir(songsDir, (err, files) => {
		if (err) {
			console.error(`Unable to scan songsDir: ${err}`);
			return;
		}
		
		files.forEach((file) => {
			const filePath = path.join(songsDir, file);
			fs.unlink(filePath, (err) => {
				if (err) {
					console.error(`Unable to delete file: ${filePath}`);
					return;
				}
				console.log(`Deleted file: ${filePath}`);
			});
		});
	});
}
