import { Minus, Plus } from "lucide-react";

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
}

export function NumberStepper({
  value,
  onChange,
  step = 1,
  min,
  max,
}: NumberStepperProps) {
  function clamp(n: number) {
    let v = n;
    if (min !== undefined) v = Math.max(min, v);
    if (max !== undefined) v = Math.min(max, v);
    return v;
  }

  return (
    <div className="flex h-10 items-center rounded-lg border border-slate-200 bg-white px-1">
      <button
        type="button"
        onClick={() => onChange(clamp(value - step))}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!Number.isNaN(n)) onChange(clamp(n));
        }}
        className="w-full min-w-0 flex-1 border-none bg-transparent text-center text-sm text-slate-800 focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        onClick={() => onChange(clamp(value + step))}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
