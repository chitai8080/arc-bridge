export type StatusLogItem = {
  id: number
  title: string
  state: 'info' | 'success' | 'error' | 'pending'
  detail?: string
  txHash?: string
  explorerUrl?: string
}

type StatusLogProps = {
  logs: StatusLogItem[]
  successMessage: string | null
  errorMessage: string | null
}

export const StatusLog = ({ logs, successMessage, errorMessage }: StatusLogProps) => {
  const getStateStyle = (state: StatusLogItem['state']) => {
    if (state === 'success') {
      return {
        card: 'border-emerald-200 bg-emerald-50/50',
        chip: 'bg-emerald-100 text-emerald-700',
      }
    }
    if (state === 'error') {
      return {
        card: 'border-rose-200 bg-rose-50/50',
        chip: 'bg-rose-100 text-rose-700',
      }
    }
    if (state === 'pending') {
      return {
        card: 'border-amber-200 bg-amber-50/50',
        chip: 'bg-amber-100 text-amber-700',
      }
    }
    return {
      card: 'border-slate-200 bg-white',
      chip: 'bg-slate-100 text-slate-600',
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_12px_40px_-22px_rgba(15,23,42,0.5)] backdrop-blur-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Bridge Status</h2>
      {successMessage ? (
        <p className="mb-3 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMessage}
        </p>
      ) : null}
      {errorMessage ? (
        <p className="mb-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorMessage}</p>
      ) : null}

      <div className="grid gap-3" role="log" aria-live="polite">
        {logs.length === 0 ? (
          <p className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
            No activity yet. Submit a bridge to see step-by-step status.
          </p>
        ) : null}
        {logs.map((item) => (
          <article
            key={item.id}
            className={`rounded-xl border px-3 py-3 ${getStateStyle(item.state).card}`}
          >
            <div className="flex items-center justify-between gap-3">
              <strong className="text-sm text-slate-900">{item.title}</strong>
              <span
                className={`rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${getStateStyle(item.state).chip}`}
              >
                {item.state}
              </span>
            </div>
            {item.detail ? <p className="mt-2 text-sm text-slate-700">{item.detail}</p> : null}
            {item.txHash ? <p className="mt-2 break-all font-mono text-xs text-slate-600">tx: {item.txHash}</p> : null}
            {item.explorerUrl ? (
              <p className="mt-2">
                <a
                  className="text-sm font-semibold text-cyan-700 underline decoration-cyan-300 underline-offset-2 transition hover:text-cyan-800"
                  href={item.explorerUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View on Explorer
                </a>
              </p>
            ) : null}
          </article>
        ))}
      </div>
    </section>
  )
}
