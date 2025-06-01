'use client'

import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { SelectBox, SelectItem } from '@/shared/ui'
import { getCountries } from '@/features/profile/api/countriesApi'

export const CountrySelect = () => {
  const { control } = useFormContext()
  const [countries, setCountries] = useState<string[]>([])

  useEffect(() => {
    getCountries().then((countries) => {
      setCountries(countries)
    })
  }, [])

  return (
    <Controller
      name="country"
      control={control}
      render={({ field }) => (
        <SelectBox placeholder="Select country" onValueChange={field.onChange} value={field.value} disabled={false}>
          {countries.map((country) => (
            <SelectItem key={country} value={country}>
              {country}
            </SelectItem>
          ))}
        </SelectBox>
      )}
    />
  )
}
