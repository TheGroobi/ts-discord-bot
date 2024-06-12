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