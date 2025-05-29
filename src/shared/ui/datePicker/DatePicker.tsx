'use client'

import React, { ComponentProps, forwardRef, useEffect, useState } from 'react'
import { ReactDatePickerCustomHeaderProps, registerLocale } from 'react-datepicker'
import * as RDP from 'react-datepicker'
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { getYear } from 'date-fns'
import clsx from 'clsx'
import { LuCalendarDays } from 'react-icons/lu'
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from 'react-icons/md'
import { Label } from '@/shared/ui/label/Label'
import textFieldStyles from '../textField/TextField.module.scss'
import s from './DatePicker.module.scss'

type DatePickerProps = {
  placeholder?: string
  startDate: Date | null
  endDate?: Date | null
  onSetStartDate: (date: Date | null) => void
  onSetEndDate?: (date: Date | null) => void
  className?: string
  label?: string
  disabled?: boolean
  errorMessage?: string
}
registerLocale('enUs', enUS)

const RDPC = (((RDP.default as any).default as any) || (RDP.default as any) || (RDP as any)) as typeof RDP.default

export const DatePicker = ({
  startDate: propStartDate,
  endDate: propEndDate,
  onSetStartDate,
  onSetEndDate,
  placeholder = format(new Date(), 'dd.MM.yyyy', { locale: enUS }),
  className,
  errorMessage,
  label,
  disabled,
}: DatePickerProps) => {
  const [startDate, setStartDate] = useState<Date | null>(propStartDate || null)
  const [endDate, setEndDate] = useState<Date | null>(propEndDate || null)

  useEffect(() => {
    setStartDate(propStartDate || null)
    setEndDate(propEndDate || null)
  }, [propStartDate, propEndDate])

  const isRange = propEndDate !== undefined
  const showError = !!errorMessage && errorMessage.length > 0

  const handleDateChange = (dates: [Date | null, Date | null] | Date | null) => {
    if (Array.isArray(dates)) {
      const [start, end] = dates
      setStartDate(start)
      setEndDate(end)
      onSetStartDate(start)
      onSetEndDate?.(end)
    } else {
      setStartDate(dates)
      onSetStartDate(dates)
    }
  }

  const classNames = {
    root: clsx(s.root, className),
    calendar: s.calendar,
    errorText: s.errorText,
    input: clsx(textFieldStyles.input, s.input, showError && s.error, isRange && s.range),
    day: () => s.day,
    popper: s.popper,
  }

  return (
    <div className={classNames.root}>
      {isRange ? (
        <RDPC
          dateFormat={'dd.MM.yyyy'}
          calendarClassName={classNames.calendar}
          className={classNames.input}
          onChange={handleDateChange}
          customInput={<CustomInput showError={showError} disabled={disabled} label={label} />}
          renderCustomHeader={customHeader}
          startDate={startDate}
          endDate={endDate}
          selected={startDate}
          placeholderText={placeholder}
          dayClassName={classNames.day}
          showPopperArrow={false}
          calendarStartDay={1}
          disabled={disabled}
          locale={'enUs'}
          formatWeekDay={formatWeekDay}
          popperClassName={classNames.popper}
          popperPlacement="top-end"
          selectsRange
          showYearDropdown
        />
      ) : (
        <RDPC
          dateFormat={'dd.MM.yyyy'}
          calendarClassName={classNames.calendar}
          className={classNames.input}
          onChange={handleDateChange}
          customInput={<CustomInput showError={showError} disabled={disabled} label={label} />}
          renderCustomHeader={customHeader}
          startDate={startDate}
          selected={startDate}
          placeholderText={placeholder}
          dayClassName={classNames.day}
          showPopperArrow={false}
          calendarStartDay={1}
          disabled={disabled}
          locale={'enUs'}
          formatWeekDay={formatWeekDay}
          popperClassName={classNames.popper}
          popperPlacement="top-end"
          showYearDropdown
        />
      )}
      {showError && <p className={classNames.errorText}>{errorMessage}</p>}
    </div>
  )
}

type CustomInputProps = {
  label?: React.ReactNode
  disabled?: boolean
  showError: boolean
} & ComponentProps<'input'>

const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ disabled, label, required, showError, ...rest }, ref) => {
    const classNames = {
      icon: clsx(s.icon, disabled && s.disabled),
      inputContainer: clsx(s.inputContainer, showError && s.error),
    }

    return (
      <Label label={label}>
        <div className={classNames.inputContainer}>
          <input disabled={disabled} ref={ref} {...rest} />
          <div className={classNames.icon}>
            <LuCalendarDays />
          </div>
        </div>
      </Label>
    )
  }
)

const customHeader = ({ date, decreaseMonth, increaseMonth, changeYear }: ReactDatePickerCustomHeaderProps) => {
  const classNames = {
    button: s.button,
    buttonBox: s.buttonBox,
    header: s.header,
    yearSelect: s.yearSelect,
  }

  const currentYear = getYear(new Date())
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i)

  return (
    <div className={classNames.header}>
      <div className={classNames.header}>
        {format(date, 'LLLL', { locale: enUS })}{' '}
        <select className={classNames.yearSelect} value={getYear(date)} onChange={(e) => changeYear(+e.target.value)}>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className={classNames.buttonBox}>
        <button className={classNames.button} onClick={decreaseMonth} type="button" aria-label="Previous month">
          <MdOutlineKeyboardArrowLeft />
        </button>

        <button className={classNames.button} onClick={increaseMonth} type="button" aria-label="Next month">
          <MdOutlineKeyboardArrowRight />
        </button>
      </div>
    </div>
  )
}

const formatWeekDay = (day: string) => capitalizeFirstLetter(day.substring(0, 1))
const capitalizeFirstLetter = (text: string) => {
  return text[0].toUpperCase() + text.slice(1)
}
