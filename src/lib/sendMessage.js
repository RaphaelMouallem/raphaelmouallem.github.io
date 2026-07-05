export async function sendMessage({ name, message, email }) {
  const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY

  if (!accessKey) {
    throw new Error('missing Web3Forms access key — set VITE_WEB3FORMS_ACCESS_KEY in .env')
  }

  const res = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: accessKey,
      name,
      message,
      email,
      botcheck: '',
    }),
  })

  if (!res.ok) throw new Error('send failed')
}
