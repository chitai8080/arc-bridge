import { BRIDGE_CHAINS } from '../config/bridgeChains'
import type { BridgeChainKey } from '../config/bridgeChains'

type BridgeFormProps = {
  fromChain: BridgeChainKey
  toChain: BridgeChainKey
  amount: string
  isSubmitting: boolean
  onFromChange: (value: BridgeChainKey) => void
  onToChange: (value: BridgeChainKey) => void
  onAmountChange: (value: string) => void
  onSubmit: () => void
}

export const BridgeForm = ({
  fromChain,
  toChain,
  amount,
  isSubmitting,
  onFromChange,
  onToChange,
  onAmountChange,
  onSubmit,
}: BridgeFormProps) => {
  const fieldClassName =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-200'

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_12px_40px_-22px_rgba(15,23,42,0.5)] backdrop-blur-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Bridge USDC</h2>
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <label>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Source Chain</span>
          <select
            className={fieldClassName}
            style={{ WebkitTextFillColor: '#0f172a' }}
            value={fromChain}
            onChange={(event) => onFromChange(event.target.value as BridgeChainKey)}
          >
            {BRIDGE_CHAINS.map((chain) => (
              <option key={chain.key} value={chain.key}>
                {chain.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Destination Chain</span>
          <select
            className={fieldClassName}
            style={{ WebkitTextFillColor: '#0f172a' }}
            value={toChain}
            onChange={(event) => onToChange(event.target.value as BridgeChainKey)}
          >
            {BRIDGE_CHAINS.map((chain) => (
              <option key={chain.key} value={chain.key}>
                {chain.label}
              </option>
            ))}
          </select>
        </label>

        <label className="sm:col-span-2">
          <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-slate-500">Amount (USDC)</span>
          <input
            className={fieldClassName}
            style={{ WebkitTextFillColor: '#0f172a' }}
            type="number"
            min="0"
            step="0.000001"
            value={amount}
            onChange={(event) => onAmountChange(event.target.value)}
            placeholder="0.00"
          />
        </label>
      </div>

      <button
        type="button"
        className="inline-flex items-center justify-center rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
        onClick={onSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Bridging...' : 'Bridge'}
      </button>
    </section>
  )
}
