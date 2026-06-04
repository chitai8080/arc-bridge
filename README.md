# Arc Bridge Frontend (App Kit)

Single-page frontend for bridging USDC with Circle App Kit.

## Features

- Connect wallet (browser injected wallet like MetaMask)
- Disconnect wallet
- Show available USDC balance on selected source chain
- Bridge form in one screen:
  - Source chain
  - Destination chain
  - Amount
  - Bridge button
- Transaction status logs by step (approve, burn, fetchAttestation, mint)

## Tech Stack

- React + Vite + TypeScript
- `@circle-fin/app-kit`
- `@circle-fin/adapter-viem-v2`
- `wagmi` + `viem`

## App Kit Configuration Location

- App Kit is configured in [src/lib/appKit.ts](src/lib/appKit.ts).
- Bridge flow creates the SDK from this config module in [src/App.tsx](src/App.tsx).
- Note: Bridge in App Kit does not require a `KIT_KEY`.

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. (Optional) Configure custom RPC endpoints:

```bash
cp .env.example .env
```

3. Start dev server:

```bash
npm run dev
```

## Environment Variables

All env vars are optional.

- `VITE_SEPOLIA_RPC_URL`
- `VITE_BASE_SEPOLIA_RPC_URL`
- `VITE_ARC_TESTNET_RPC_URL`
- `VITE_APPKIT_DISABLE_ERROR_REPORTING` (optional, default `false`)

If not provided, wagmi uses default public RPC settings.

## What Is Real vs Mock

- Real:
  - Wallet connect/disconnect
  - On-chain USDC balance read (ERC-20 `balanceOf`)
  - Bridge execution via App Kit `kit.bridge(...)`
  - Bridge step logs from App Kit events and result steps

- Mock:
  - None in the bridge flow itself.
  - No backend APIs are used.
