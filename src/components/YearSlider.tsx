import { useState } from 'react'

const MIN_YEAR = 1920
const MAX_YEAR = 2026

interface Props {
  value: number
  onChange: (year: number) => void
  onSubmit: (year: number) => void
  disabled?: boolean
}

export function YearSlider({ value, onChange, onSubmit, disabled }: Props) {
  const [hasMoved, setHasMoved] = useState(false)
  const [inputText, setInputText] = useState(String(value))

  const pct = ((value - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100

  function handleSlider(e: React.ChangeEvent<HTMLInputElement>) {
    const year = parseInt(e.target.value, 10)
    setHasMoved(true)
    setInputText(String(year))
    onChange(year)
  }

  function handleNumberInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInputText(e.target.value)
    const year = parseInt(e.target.value, 10)
    if (!isNaN(year) && year >= MIN_YEAR && year <= MAX_YEAR) {
      setHasMoved(true)
      onChange(year)
    }
  }

  function handleNumberBlur() {
    const year = parseInt(inputText, 10)
    if (isNaN(year) || year < MIN_YEAR || year > MAX_YEAR) {
      setInputText(String(value))
    } else {
      onChange(Math.max(MIN_YEAR, Math.min(MAX_YEAR, year)))
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && hasMoved) onSubmit(value)
  }

  return (
    <div className="w-full flex flex-col items-center gap-3 px-4 py-4 bg-charcoal-800/90 border-t border-white/10">
      <p className="font-sans text-sepia-300/70 text-xs tracking-widest uppercase">
        What year was this magazine published?
      </p>

      <div className="w-full max-w-xl flex flex-col gap-3">
        <div className="flex items-center gap-3">
          {/* Year Input Field */}
          <input
            type="number"
            min={MIN_YEAR}
            max={MAX_YEAR}
            value={inputText}
            onChange={handleNumberInput}
            onBlur={handleNumberBlur}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            className={`
              w-28 text-center font-mono font-medium text-3xl tabular-nums
              bg-charcoal-700 border rounded px-2 py-1 outline-none transition-colors
              [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
              ${
                hasMoved
                  ? 'border-gold-400/60 text-gold-400 focus:border-gold-400'
                  : 'border-white/10 text-sepia-400/60 focus:border-white/20'
              }
              ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
            `}
          />

          {/* Slider */}
          <div className="flex-1">
            <input
              type="range"
              min={MIN_YEAR}
              max={MAX_YEAR}
              step={1}
              value={value}
              onChange={handleSlider}
              disabled={disabled}
              className="year-slider w-full"
              style={{ '--pct': `${pct}%` } as React.CSSProperties}
            />
            <div className="flex justify-between mt-0.5 font-mono text-xs text-sepia-400/40 select-none">
              <span>{MIN_YEAR}</span>
              <span>{MAX_YEAR}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onSubmit(value)}
          disabled={!hasMoved || disabled}
          className={`
            w-full py-3 font-sans font-medium text-base rounded transition-all duration-150
            ${
              hasMoved && !disabled
                ? 'bg-gold-400 hover:bg-gold-300 text-charcoal-900 cursor-pointer shadow-[0_0_16px_rgba(201,168,76,0.25)]'
                : 'bg-charcoal-700 text-sepia-300/25 cursor-not-allowed'
            }
          `}
        >
          {hasMoved ? 'Submit Guess' : 'Move the slider or type a year'}
        </button>
      </div>
    </div>
  )
}
