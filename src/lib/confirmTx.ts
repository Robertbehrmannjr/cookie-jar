import type { Connection } from '@solana/web3.js'

/**
 * Confirms a transaction by polling getSignatureStatuses instead of relying on
 * the websocket signature subscription that connection.confirmTransaction
 * uses by default. Cookie Chain's websocket endpoint lives on a different
 * host than its RPC one, so a misconfigured (or briefly unhealthy) ws
 * connection would otherwise leave the UI stuck on "confirming" forever.
 */
export async function confirmBySignaturePolling(
  connection: Connection,
  signature: string,
  { timeoutMs = 60_000, intervalMs = 500 } = {},
): Promise<void> {
  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    const { value } = await connection.getSignatureStatuses([signature])
    const status = value[0]
    if (status?.err) {
      throw new Error(`Transaction failed: ${JSON.stringify(status.err)}`)
    }
    if (status?.confirmationStatus === 'confirmed' || status?.confirmationStatus === 'finalized') {
      return
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }
  throw new Error('Timed out waiting for confirmation. Check the signature on CookieScan.')
}
