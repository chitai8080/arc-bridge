import { useAccount, useConnect, useDisconnect } from 'wagmi'

type WalletControlsProps = {
  chainLabel: string
}

const truncateAddress = (value: string): string =>
  `${value.slice(0, 6)}...${value.slice(-4)}`

export const WalletControls = ({ chainLabel }: WalletControlsProps) => {
  const { address, isConnected } = useAccount()
  const { connectors, connect, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()

  const activeConnector =
    connectors.find((connector) => connector.type === 'injected') ?? connectors[0]

  const handleConnect = () => {
    if (!activeConnector) {
      return
    }
    connect({ connector: activeConnector })
  }

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_12px_40px_-22px_rgba(15,23,42,0.5)] backdrop-blur-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Wallet</h2>
      {!isConnected ? (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-70"
            onClick={handleConnect}
            disabled={!activeConnector || isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
          {!activeConnector ? <p className="text-sm text-slate-500">No injected wallet detected.</p> : null}
        </div>
      ) : (
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Connected Address</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{address ? truncateAddress(address) : '-'}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Selected Source Chain</p>
              <p className="mt-1 text-sm font-semibold text-slate-900">{chainLabel}</p>
            </div>
          </div>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            onClick={() => disconnect()}
          >
            Disconnect Wallet
          </button>
        </div>
      )}
      {isConnecting ? <p className="mt-3 text-sm text-slate-500">Waiting for wallet confirmation.</p> : null}
    </section>
  )
}
