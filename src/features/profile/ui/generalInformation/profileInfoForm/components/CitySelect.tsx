import { useEffect, useMemo, useState } from 'react'
import { Controller, useFormContext, useWatch } from 'react-hook-form'

import { getCitiesForCountry } from '@/features/profile/api/countriesApi'
import { SelectBox, SelectItem } from '@/shared/ui'
import s from '../ProfileInfoForm.module.scss'

export const CitySelect = () => {
  const { control, setValue } = useFormContext()
  const selectedCountry = useWatch({ name: 'country' })
  const [cities, setCities] = useState<string[]>([])
  const [filter, setFilter] = useState('')
  const [displayLimit, setDisplayLimit] = useState(50)

  useEffect(() => {
    if (!selectedCountry) {
      setCities([])
      setValue('city', undefined)
      return
    }

    getCitiesForCountry(selectedCountry).then((cities) => {
      setCities(cities)
      setFilter('')
      setDisplayLimit(50)
      setValue('city', undefined)
    })
  }, [selectedCountry, setValue])

  const filteredCities = useMemo(
    () => cities.filter((city) => city.toLowerCase().startsWith(filter.toLowerCase())),
    [cities, filter]
  )

  const displayedCities = filteredCities.slice(0, displayLimit)
  const hasMore = filteredCities.length > displayLimit

  return (
    <Controller
      name="city"
      control={control}
      render={({ field }) => {
        console.log('City field value:', field.value, typeof field.value)
        return (
          <SelectBox
            placeholder="Select city"
            onValueChange={field.onChange}
            value={field.value || undefined}
            disabled={!selectedCountry}
            className={s.selectBox}
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

            {displayedCities.map((city) => (
              <SelectItem key={city} value={city}>
                {city}
              </SelectItem>
            ))}
            {hasMore && (
              <button type="button" onClick={() => setDisplayLimit((prev) => prev + 50)} className={s.displayMoreBtn}>
                Load more... ({filteredCities.length - displayLimit} remaining)
              </button>
            )}
          </SelectBox>
        )
      }}
    />
  )
}
