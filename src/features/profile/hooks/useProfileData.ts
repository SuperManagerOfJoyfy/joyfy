import { useEffect, useState } from 'react'

type Option = { value: string; label: string }

type Region = {
  id: string
  name: string
  latitude: number
  longitude: number
  type: string
  continentCode: string
  countryCode: string
  division1Code: string | null
  division2Code: string | null
  division3Code: string | null
  division4Code: string | null
  population: string
  timezone: string
  parentRegions: Array<{
    id: string
    name: string
  }>
}

type RegionConnection = {
  edges: Array<{
    node: Region
    cursor: string
  }>
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    startCursor: string | null
    endCursor: string | null
  }
}

const API_KEY = process.env.NEXT_PUBLIC_OXILOR_API_KEY
const BASE_URL = 'https://data-api.oxilor.com/rest'

export const useProfileData = () => {
  const [countries, setCountries] = useState<Option[]>([])
  const [cities, setCities] = useState<Option[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCountry, setSelectedCountry] = useState('')

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true)

        const response = await fetch(`${BASE_URL}/countries`, {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: Region[] = await response.json()

        setCountries(
          data.map((country: Region) => ({
            value: country.countryCode,
            label: country.name,
          }))
        )
      } catch (error) {
        console.error('Failed to fetch countries:', error)
        setCountries([])
      } finally {
        setLoading(false)
      }
    }

    fetchCountries()
  }, [])

  useEffect(() => {
    if (!selectedCountry) {
      setCities([])
      return
    }

    const fetchCities = async () => {
      try {
        setLoading(true)

        const response = await fetch(`${BASE_URL}/regions?type=city&countryCode=${selectedCountry}&first=100`, {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data: RegionConnection = await response.json()

        setCities(
          data.edges.map((edge) => ({
            value: edge.node.id,
            label: edge.node.name,
          }))
        )
      } catch (error) {
        console.error('Failed to fetch cities:', error)
        setCities([])
      } finally {
        setLoading(false)
      }
    }

    fetchCities()
  }, [selectedCountry])

  return { countries, cities, loading, setSelectedCountry }
}
