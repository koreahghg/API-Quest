export interface StatusHint {
  code: number | 'cors' | 'network' | 'parse' | 'invalid_url'
  title: string
  explanation: string
  commonMistakes: string[]
  nextSteps: string[]
}
