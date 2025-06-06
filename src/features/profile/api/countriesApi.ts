export const getCountries = async (): Promise<string[]> => {
  try {
    const res = await fetch('https://countriesnow.space/api/v0.1/countries')

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const { data } = await res.json()

    return data.map((item: { country: string }) => item.country).sort((a: string, b: string) => a.localeCompare(b))
  } catch (error) {
    console.error('getCountries failed:', error)
    throw new Error('Could not fetch countries')
  }
}

export const getCitiesForCountry = async (country: string): Promise<string[]> => {
  try {
    const res = await fetch('https://countriesnow.space/api/v0.1/countries/cities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ country }),
    })
    const { data } = await res.json()
    return data
  } catch (error) {
    throw new Error('Could not fetch cities')
  }
}
