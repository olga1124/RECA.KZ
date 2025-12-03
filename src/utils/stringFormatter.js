
export function headlineFormatter(title) {

	const words = title.split(' ');
	const firstWord = words.shift();
	const restOfTitle = words.length > 0 ? words.join(' ') : '';

	return <h2>{firstWord} <span>{restOfTitle}</span></h2>
};

export function subheaderFormatter(title) {

	const words = title.split(' ');
	const firstWord = words.shift();
	const restOfTitle = words.length > 0 ? words.join(' ') : '';

	return <h2 className="ttt">{firstWord} <span>{restOfTitle}</span></h2>
};