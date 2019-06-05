import 'isomorphic-unfetch'

async function fetchFromApi(endpoint) {
  const server = `${window.location.protocol}//${window.location.host}`
  const request = await fetch(`${server}${endpoint}`)
  return await request.json()
}

export {
  fetchFromApi
}