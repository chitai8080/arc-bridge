import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { SUPPORTED_WAGMI_CHAINS } from '../config/bridgeChains'
import { arcTestnet, baseSepolia, sepolia } from 'viem/chains'

const rpcByChain: Record<number, string | undefined> = {
  11155111: import.meta.env.VITE_SEPOLIA_RPC_URL,
  84532: import.meta.env.VITE_BASE_SEPOLIA_RPC_URL,
  5042002: import.meta.env.VITE_ARC_TESTNET_RPC_URL,
}

const transports = {
  [sepolia.id]: http(rpcByChain[sepolia.id]),
  [baseSepolia.id]: http(rpcByChain[baseSepolia.id]),
  [arcTestnet.id]: http(rpcByChain[arcTestnet.id]),
}

export const wagmiConfig = createConfig({
  chains: SUPPORTED_WAGMI_CHAINS,
  connectors: [injected({ shimDisconnect: true })],
  transports,
})
