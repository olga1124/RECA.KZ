
export function headlineFormatter(title) {

    const words = title.split(' ');
    const firstWord = words.shift();
    const restOfTitle = words.length > 0 ? words.join(' ') : '';

    return  <h1>{firstWord} <span>{restOfTitle}</span></h1>
};

export function subheaderFormatter(title) {

    const words = title.split(' ');
    const firstWord = words.shift();
    const restOfTitle = words.length > 0 ? words.join(' ') : '';

    return  <h2>{firstWord} <span>{restOfTitle}</span></h2>
};