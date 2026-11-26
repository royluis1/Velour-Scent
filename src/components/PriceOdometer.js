import { useLayoutEffect, useRef, useState } from 'react';
import { formatPrice } from '../utils/api';
import './Motion.css';

function Digit({ value, place }) {
  const digit = Number(value);
  const previous = useRef(digit);
  const [position, setPosition] = useState(10 + digit);

  useLayoutEffect(() => {
    if (previous.current === digit) return;
    const increment = (digit - previous.current + 10) % 10;
    previous.current = digit;
    setPosition((current) => current + increment);
  }, [digit]);

  return (
    <span className="price-odometer__digit" aria-hidden="true" data-place={place}>
      <span className="price-odometer__strip" style={{ transform: `translateY(${-position * 1.15}em)` }}>
        {Array.from({ length: 30 }, (_, index) => <span key={index}>{index % 10}</span>)}
      </span>
    </span>
  );
}

export default function PriceOdometer({ value, className = '' }) {
  const amount = Math.max(0, Math.round(Number(value) || 0));
  const formatted = amount.toLocaleString('es-AR');
  const reversed = Array.from(formatted).reverse();
  const width = reversed.reduce((total, character) => total + (character === '.' ? 0.28 : 0.61), 0);

  return (
    <span className={`price-odometer ${className}`.trim()} aria-label={formatPrice(amount)} aria-live="polite">
      <span className="price-odometer__currency" aria-hidden="true">$&nbsp;</span>
      <span className="price-odometer__digits" aria-hidden="true" style={{ width: `${width}em` }}>
        {reversed.map((character, place) => character === '.'
          ? <span className="price-odometer__separator" key={`separator-${place}`}>.</span>
          : <Digit value={character} place={place} key={`digit-${place}`} />)}
      </span>
    </span>
  );
}
