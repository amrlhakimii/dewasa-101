import { useEffect, useRef, useState, type InputHTMLAttributes } from 'react';
import { Input } from '@/components/ui/input';

interface NumberFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> {
  value: number;
  onValueChange: (value: number) => void;
}

// A plain type="number" input forces the DOM value back to "0" the instant the
// field is cleared, which resets the cursor to position 0 — the next digit
// then gets prepended instead of appended, snowballing like an odometer
// (5 -> 50 -> 500...). Buffering the raw text ourselves avoids that entirely.
export function NumberField({ value, onValueChange, className, ...props }: NumberFieldProps) {
  const [text, setText] = useState(() => (value === 0 ? '' : String(value)));
  const isFocused = useRef(false);

  useEffect(() => {
    if (isFocused.current) return;
    setText(value === 0 ? '' : String(value));
  }, [value]);

  return (
    <Input
      type="text"
      inputMode="decimal"
      className={className}
      value={text}
      onFocus={() => {
        isFocused.current = true;
      }}
      onBlur={() => {
        isFocused.current = false;
        setText(value === 0 ? '' : String(value));
      }}
      onChange={(e) => {
        const raw = e.target.value;
        if (raw !== '' && !/^\d*\.?\d*$/.test(raw)) return;
        setText(raw);
        onValueChange(raw === '' || raw === '.' ? 0 : Number(raw));
      }}
      {...props}
    />
  );
}
