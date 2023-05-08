import axios, { AxiosError } from "axios"

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))
export const fetchAPI = async (
  api: string
): Promise<[response_data: unknown, error: Error | AxiosError | null]> => {
  try {
    const result = await axios.get(api)
    return [result.data, null]
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const error_output = (error as any)?.message ?? JSON.stringify(error)
    console.error(error_output)
    return [null, error_output]
  }
}
