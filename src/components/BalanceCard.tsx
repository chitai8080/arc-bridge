import { useEffect, useMemo, useState } from 'react'
import { erc20Abi, formatUnits } from 'viem'
import { useAccount, usePublicClient } from 'wagmi'
import type { BridgeChainOption } from '../config/bridgeChains'

type BalanceCardProps = {
  sourceChain: BridgeChainOption
}

export const BalanceCard = ({ sourceChain }: BalanceCardProps) => {
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient({ chainId: sourceChain.wagmiChain.id })

  const [balance, setBalance] = useState<string>('0.00')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const shortAddress = useMemo(() => {
    if (!address) {
      return '-'
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }, [address])

  const loadBalance = async () => {
    if (!address || !isConnected || !publicClient) {
      setBalance('0.00')
      setError(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const rawBalance = await publicClient.readContract({
        address: sourceChain.usdcAddress,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address],
      })

      const parsed = Number(formatUnits(rawBalance, 6))
      setBalance(parsed.toLocaleString(undefined, { maximumFractionDigits: 6 }))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Could not read token balance.'
      setError(message)
      setBalance('0.00')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadBalance()
  }, [address, isConnected, publicClient, sourceChain.usdcAddress])

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white/85 p-5 shadow-[0_12px_40px_-22px_rgba(15,23,42,0.5)] backdrop-blur-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Available Balance</h2>
      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Wallet</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{shortAddress}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Chain</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{sourceChain.label}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Token</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">USDC</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Balance</p>
          <p className="mt-1 text-sm font-semibold text-slate-900">{isLoading ? 'Loading...' : balance}</p>
        </div>
      </div>
      <button
        type="button"
        className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
        onClick={() => void loadBalance()}
        disabled={isLoading}
      >
        Refresh Balance
      </button>
      {error ? (
        <p className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>
      ) : null}
    </section>
  )
}
