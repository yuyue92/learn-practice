export interface Highlight {
    id: string
    text: string
    color: string
    url: string
    pageTitle: string
    timestamp: number
    range: {
        startContainer: string
        startOffset: number
        endContainer: string
        endOffset: number
    }
}

export const COLORS = {
    yellow: '#FEF3C7',
    green: '#D1FAE5',
    blue: '#DBEAFE',
    pink: '#FCE7F3',
    purple: '#E9D5FF',
    orange: '#FED7AA'
} as const

export type ColorKey = keyof typeof COLORS