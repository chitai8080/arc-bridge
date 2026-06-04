import { AppKit } from '@circle-fin/app-kit'

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

type StepName = 'approve' | 'burn' | 'fetchAttestation' | 'mint'

type StepHandler = (step: StepName, payload: BridgeEventPayload) => void

const parseBooleanEnv = (value: string | undefined): boolean => {
  if (!value) {
    return false
  }
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase())
}

export const createAppKit = (): AppKit => {
  return new AppKit({
    disableErrorReporting: parseBooleanEnv(import.meta.env.VITE_APPKIT_DISABLE_ERROR_REPORTING),
  })
}

export const attachBridgeStepListeners = (kit: AppKit, onStep: StepHandler): (() => void) => {
  const approveHandler = (payload: unknown) => onStep('approve', payload as BridgeEventPayload)
  const burnHandler = (payload: unknown) => onStep('burn', payload as BridgeEventPayload)
  const attestationHandler = (payload: unknown) =>
    onStep('fetchAttestation', payload as BridgeEventPayload)
  const mintHandler = (payload: unknown) => onStep('mint', payload as BridgeEventPayload)

  kit.on('bridge.approve', approveHandler)
  kit.on('bridge.burn', burnHandler)
  kit.on('bridge.fetchAttestation', attestationHandler)
  kit.on('bridge.mint', mintHandler)

  return () => {
    kit.off('bridge.approve', approveHandler)
    kit.off('bridge.burn', burnHandler)
    kit.off('bridge.fetchAttestation', attestationHandler)
    kit.off('bridge.mint', mintHandler)
  }
}
