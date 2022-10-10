export const walletErrorCatch = (tx: any) => {
  if (tx?.status === 1) {
    // alert('Wallet Error: Could not send transaction, please try again in several seconds - ' + tx?.message)
    alert('Wallet Error: Could not send transaction, please wait until the next block goes through')
    return true
  }
  if (tx.error) {
    alert(tx.message)
    return true
  }
  return false
}
