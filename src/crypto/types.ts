declare global {
  type Coin = {
    id: string
    name: string
    symbol: string
    current_price: number
    total_volume: number
    timestamp?: number
    image?: string
    market_cap?: number
    market_cap_rank?: number
    market_cap_change_percentage_24h?: number
    price_change_percentage_24h?: number
  }
}

export type Module = unknown
