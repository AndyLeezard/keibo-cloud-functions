// myFunction.ts
import * as functions from "firebase-functions"
import * as admin from "firebase-admin"
import { fetchAPI, sleep } from "../utils"
import * as API from "../API.json"

const CATEGORIES = [
  "layer-1",
  "smart-contract-platform",
  "binance-smart-chain",
  "stablecoins",
  "exchange-based-tokens",
  "decentralized-finance-defi",
  "meme-token",
  "non-fungible-tokens-nft",
  "governance",
  "layer-2",
  "yield-farming",
  "gaming",
  "metaverse",
  "play-to-earn",
  "privacy-coins",
  "sports",
  "insurance",
] as const

const functionCacheRef = "cloud_function_cache/update_categories"

export const update_categories = functions.pubsub
  .schedule("0 */2 * * *") /* every 8 hours */
  .timeZone("America/New_York")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .onRun(async (context) => {
    /** DO NOT MODIFY THIS VALUE, MODIFY ON THE FIREBASE CONSOLE. */
    let index = 0
    let size = 1
    const cache_snap = await admin
      .database()
      .ref(functionCacheRef)
      .get()
    const categories: string[] = []
    if (cache_snap.exists()) {
      const config = cache_snap.val() as {
        index: number
        size: number
      }
      index = config.index
      size = config.size
      for (let i = 0; i < size; i++) {
        if (index >= CATEGORIES.length) {
          index = 0
        }
        categories.push(CATEGORIES[index])
        index++
      }
    }
    await admin.database().ref(functionCacheRef).set({
      index: index,
      size: size,
    })
    const snapshots: Array<{ cat: string; coins: Coin[] }> = []
    let breaker = false
    for (let i = 0; i < categories.length && !breaker; i++) {
      if (i) {
        // SAFETY MEASURE TO AVOID RESPONSE STATUS 429 (TOO MANY REQUESTS)
        await sleep(i * 1500)
      }
      const [data, error] = await fetchAPI(
        API.getCategories.replace("${CATEGORY}", categories[i])
      )
      if (error) {
        console.error(
          `Cannot update category ${categories[i]} as it is not fetched properly!`
        )
        breaker = true
        break
      }
      console.error(`Updated category: ${categories[i]}`)
      snapshots.push({
        cat: categories[i],
        coins: (data as Coin[]).filter(
          (c) => c.market_cap_rank && c.market_cap_rank <= 250
        ),
      })
    }
    const registerSnapshot = async (
      snapshot: { cat: string; coins: Coin[] },
      index: number
    ) => {
      // info: global data cannot verify ids, only symbols
      const symbols = snapshot.coins.map((c) => c.symbol)
      const ids = snapshot.coins.map((c) => c.id)
      const payload = {
        symbols: symbols,
        ids: ids,
        rank: index,
      }
      await admin.database().ref(`categories/${snapshot.cat}`).set(payload)
    }
    return await Promise.all(
      snapshots.map((item, i) => registerSnapshot(item, i))
    )
  })
