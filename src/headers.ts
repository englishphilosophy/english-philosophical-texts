export default (contentType?: string): Headers => {
  const h = new Headers()
  h.set('date', new Date().toUTCString())
  if (contentType) {
    h.set('content-type', contentType)
  }
  return h
}
