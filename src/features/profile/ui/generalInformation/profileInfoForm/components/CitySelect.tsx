import { useEffect, useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { getCitiesForCountry } from '@/features/profile/api/countriesApi'
import { SelectBox, SelectItem } from '@/shared/ui'
import s from '../ProfileInfoForm.module.scss'

export const CitySelect = () => {
  const { control } = useFormContext()
  const selectedCountry = useWatch({ name: 'country' })
  const [cities, setCities] = useState<string[]>([])
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (!selectedCountry) {
      setCities([])
      return
    }

    getCitiesForCountry(selectedCountry).then((cities) => {
      setCities(cities)
      setFilter('')
    })
  }, [selectedCountry])

  const filteredCities = cities.filter((city) => city.toLowerCase().startsWith(filter.toLowerCase()))

  return (
    <Controller
      name="city"
      control={control}
      render={({ field }) => (
        <SelectBox
          placeholder="Select city"
          onValueChange={field.onChange}
          value={field.value}
          disabled={!selectedCountry}
        >
          <div>
            <input
              type="text"
              placeholder="Search cities..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={s.searchCityInput}
              autoFocus
            />
          </div>
          {filteredCities.map((city) => (
            <SelectItem key={city} value={city}>
              {city}
            </SelectItem>
          ))}
        </SelectBox>
      )}
    />
  )
}
