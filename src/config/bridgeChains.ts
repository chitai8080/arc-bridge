import { arcTestnet, baseSepolia, sepolia } from 'viem/chains'
import type { Chain } from 'viem'

export type BridgeChainKey = 'ethereumSepolia' | 'baseSepolia' | 'arcTestnet'

export type BridgeChainOption = {
  key: BridgeChainKey
  label: string
  bridgeChain: 'Ethereum_Sepolia' | 'Base_Sepolia' | 'Arc_Testnet'
  wagmiChain: Chain
  usdcAddress: `0x${string}`
}

export const SUPPORTED_WAGMI_CHAINS = [sepolia, baseSepolia, arcTestnet] as const

export const BRIDGE_CHAINS: BridgeChainOption[] = [
  {
    key: 'ethereumSepolia',
    label: 'Ethereum Sepolia',
    bridgeChain: 'Ethereum_Sepolia',
    wagmiChain: sepolia,
    usdcAddress: '0x1c7d4b196cb0c7b01d743fbc6116a902379c7238',
  },
  {
    key: 'baseSepolia',
    label: 'Base Sepolia',
    bridgeChain: 'Base_Sepolia',
    wagmiChain: baseSepolia,
    usdcAddress: '0x036cbD53842c5426634e7929541ec2318f3dcf7e',
  },
  {
    key: 'arcTestnet',
    label: 'Arc Testnet',
    bridgeChain: 'Arc_Testnet',
    wagmiChain: arcTestnet,
    usdcAddress: '0x3600000000000000000000000000000000000000',
  },
]

export const DEFAULT_FROM_CHAIN: BridgeChainKey = 'ethereumSepolia'
export const DEFAULT_TO_CHAIN: BridgeChainKey = 'arcTestnet'

export const getBridgeChainByKey = (key: BridgeChainKey): BridgeChainOption => {
  const chain = BRIDGE_CHAINS.find((item) => item.key === key)
  if (!chain) {
    throw new Error(`Unsupported chain key: ${key}`)
  }
  return chain
}
