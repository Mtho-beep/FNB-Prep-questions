import { useLocalStorage } from './useLocalStorage'
import type { ProviderPreference } from '../services/aiProvider'

// Per-device voice preferences (voices differ per browser, so these stay in
// LocalStorage rather than the synced progress state).

export interface VoiceSettings {
  voiceMode: boolean
  autoSpeak: boolean
  autoListen: boolean
  liveFeedback: boolean
  voiceURI: string
  rate: number
  pitch: number
  lang: string
  provider: ProviderPreference
}

export const defaultVoiceSettings: VoiceSettings = {
  voiceMode: true,
  autoSpeak: true,
  autoListen: false,
  liveFeedback: false,
  voiceURI: '',
  rate: 1,
  pitch: 1,
  lang: 'en-ZA',
  provider: 'auto',
}

export function useVoiceSettings() {
  const [stored, setStored] = useLocalStorage<VoiceSettings>('fnb-ai-interview-prep:voice-settings:v1', defaultVoiceSettings)
  const settings = { ...defaultVoiceSettings, ...stored }
  const update = (patch: Partial<VoiceSettings>) => setStored((prev) => ({ ...defaultVoiceSettings, ...prev, ...patch }))
  return { settings, update }
}
