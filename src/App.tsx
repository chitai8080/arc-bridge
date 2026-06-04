import { createViemAdapterFromProvider } from '@circle-fin/adapter-viem-v2'
import type { EIP1193Provider } from 'viem'
import { useState } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { BalanceCard } from './components/BalanceCard'
import { BridgeForm } from './components/BridgeForm'
import { StatusLog } from './components/StatusLog'
import type { StatusLogItem } from './components/StatusLog'
import { WalletControls } from './components/WalletControls'
import {
  DEFAULT_FROM_CHAIN,
  DEFAULT_TO_CHAIN,
  getBridgeChainByKey,
  type BridgeChainKey,
} from './config/bridgeChains'
import { attachBridgeStepListeners, createAppKit } from './lib/appKit'

type BridgeEventPayload = {
  values?: {
    state?: string
    txHash?: string
    explorerUrl?: string
    data?: {
      attestation?: string
    }
  }
}

const normalizeError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  return 'Bridge failed. Please try again.'
}

function App() {
  const { connector, isConnected, chainId } = useAccount()
  const { switchChainAsync } = useSwitchChain()

  const [fromChain, setFromChain] = useState<BridgeChainKey>(DEFAULT_FROM_CHAIN)
  const [toChain, setToChain] = useState<BridgeChainKey>(DEFAULT_TO_CHAIN)
  const [amount, setAmount] = useState<string>('1.00')

  const [isBridging, setIsBridging] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [logs, setLogs] = useState<StatusLogItem[]>([])

  const sourceChain = getBridgeChainByKey(fromChain)
  const destinationChain = getBridgeChainByKey(toChain)

  const pushLog = (item: Omit<StatusLogItem, 'id'>) => {
    setLogs((prev) => [
      ...prev,
      {
        ...item,
        id: Date.now() + prev.length,
      },
    ])
  }

  const buildStepLogger = (title: string, payload: BridgeEventPayload) => {
    pushLog({
      title,
      state:
        payload.values?.state === 'success'
          ? 'success'
          : payload.values?.state === 'error'
            ? 'error'
            : 'pending',
      detail: payload.values?.data?.attestation
        ? `Attestation: ${payload.values.data.attestation}`
        : undefined,
      txHash: payload.values?.txHash,
      explorerUrl: payload.values?.explorerUrl,
    })
  }

  const handleBridge = async () => {
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!isConnected || !connector) {
      setErrorMessage('Please connect your wallet first.')
      return
    }

    if (sourceChain.key === destinationChain.key) {
      setErrorMessage('Source and destination chains must be different.')
      return
    }

    const amountNumber = Number(amount)
    if (!amount || Number.isNaN(amountNumber) || amountNumber <= 0) {
      setErrorMessage('Amount must be a number greater than 0.')
      return
    }

    setIsBridging(true)
    setLogs([])

    try {
      if (chainId !== sourceChain.wagmiChain.id) {
        pushLog({
          title: 'Switch Network',
          state: 'pending',
          detail: `Switching wallet network to ${sourceChain.label}.`,
        })
        await switchChainAsync({ chainId: sourceChain.wagmiChain.id })
      }

      const provider = (await connector.getProvider()) as EIP1193Provider
      const adapter = await createViemAdapterFromProvider({ provider })
      const kit = createAppKit()
      const detachListeners = attachBridgeStepListeners(kit, (step, payload) => {
        buildStepLogger(step, payload)
      })

      pushLog({
        title: 'Bridge Started',
        state: 'pending',
        detail: `Bridging ${amount} USDC from ${sourceChain.label} to ${destinationChain.label}.`,
      })

      const result = await kit.bridge({
        from: {
          adapter,
          chain: sourceChain.bridgeChain,
        },
        to: {
          adapter,
          chain: destinationChain.bridgeChain,
        },
        amount,
        token: 'USDC',
      })

      detachListeners()

      result.steps.forEach((step) => {
        pushLog({
          title: step.name,
          state:
            step.state === 'success' ? 'success' : step.state === 'error' ? 'error' : 'pending',
          detail: step.state === 'error' ? String(step.error) : undefined,
          txHash: step.txHash,
          explorerUrl: step.explorerUrl,
        })
      })

      if (result.state === 'success') {
        setSuccessMessage('Bridge completed successfully.')
      } else {
        const failedStep = result.steps.find((step) => step.state === 'error')
        setErrorMessage(`Bridge ended with error at step: ${failedStep?.name ?? 'unknown'}.`)
      }
    } catch (error) {
      const message = normalizeError(error)
      pushLog({ title: 'Bridge Error', state: 'error', detail: message })
      setErrorMessage(message)
    } finally {
      setIsBridging(false)
    }
  }

  return (
    <main className="mx-auto grid min-h-screen w-full max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="relative overflow-hidden rounded-3xl border border-slate-200/70 bg-white/85 p-6 shadow-[0_18px_55px_-30px_rgba(2,132,199,0.45)] backdrop-blur-sm sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-300/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-14 h-56 w-56 rounded-full bg-teal-300/30 blur-3xl" />
        <div className="relative">
          <p className="mb-2 inline-flex rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-800">
            Circle App Kit
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">App Kit Bridge Demo</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Bridge USDC in one screen with wallet connect, live balances, and real-time bridge step updates.
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="grid gap-6">
          <WalletControls chainLabel={sourceChain.label} />
          <BalanceCard sourceChain={sourceChain} />
        </div>

        <BridgeForm
          fromChain={fromChain}
          toChain={toChain}
          amount={amount}
          isSubmitting={isBridging}
          onFromChange={setFromChain}
          onToChange={setToChain}
          onAmountChange={setAmount}
          onSubmit={() => void handleBridge()}
        />
      </div>

      <StatusLog logs={logs} successMessage={successMessage} errorMessage={errorMessage} />
    </main>
  )
}

export default App
