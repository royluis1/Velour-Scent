import './Motion.css';

export default function SplitText({ text, className = '' }) {
  let index = 0;
  const words = String(text).split(/(\s+)/);
  return (
    <span className={`split-text ${className}`.trim()} aria-label={text}>
      {words.map((word, wordIndex) => {
        if (!word) return null;
        if (/^\s+$/.test(word)) {
          return Array.from(word).map(() => {
            const letterIndex = index++;
            return (
              <span className="split-text__space" aria-hidden="true" key={`space-${letterIndex}`}>
                <span className="split-text__letter" style={{ '--i': letterIndex }} aria-hidden="true">&nbsp;</span>
              </span>
            );
          });
        }
        return (
          <span className="split-text__word" aria-hidden="true" key={`${word}-${wordIndex}`}>
            {Array.from(word).map((character) => {
              const letterIndex = index++;
              return <span className="split-text__letter" style={{ '--i': letterIndex }} key={letterIndex}>{character}</span>;
            })}
          </span>
        );
      })}
    </span>
  );
}
