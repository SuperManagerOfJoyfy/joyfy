import DatePicker, { ReactDatePickerCustomHeaderProps, registerLocale } from 'react-datepicker';
import React, { ComponentProps, forwardRef, useState } from 'react'
import s from './DatePicker.module.scss'
import { Label } from '@/shared/ui/label/Label';
import { LuCalendarDays } from "react-icons/lu";
import { MdOutlineKeyboardArrowLeft, MdOutlineKeyboardArrowRight } from "react-icons/md";
import clsx from 'clsx'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import textFieldStyles from '../textField/TextField.module.scss'

type DatePickerProps = {
	// startDate: Date | null
	// endDate?: Date | null
	placeholder?: string
	// setStartDate: (date: Date | null) => void
	// setEndDate: (date: Date | null) => void
}

export const DatePicker1 = (
	{
	// startDate,
	// endDate,
	placeholder,
	// setStartDate,
	// setEndDate
}: DatePickerProps) => {

	// const isRange = endDate !== undefined

	const [startDate, setStartDate] = useState(new Date());
	const [endDate, setEndDate] = useState(null as Date | null);



	const handleChange = ([newStartDate, newEndDate]: [Date, Date | null]) => {
		setStartDate(newStartDate);
		setEndDate(newEndDate);
	}

	const DatePickerHandler = (dates: [Date | null, Date | null] | Date) => {
		// console.log(dates);

		// if (Array.isArray(dates)) {
		// 	const [start, end] = dates

		// 	setStartDate(start)
		// 	setEndDate?.(end)
		// }
		// else {
		// 	setStartDate(dates)
		// }
	}

	const classNames = {
		root: s.root,
		calendar: s.calendar,
		input: clsx(s.input, textFieldStyles.input),
		day: () => s.day
	}

	return (
		<div className={classNames.root}>
			<DatePicker
				dateFormat={'dd/MM/yyyy'}
				calendarClassName={classNames.calendar}
				className={classNames.input}
				onChange={handleChange}
				customInput={<CustomInput />}
				renderCustomHeader={customHeader}
				startDate={startDate}
				endDate={endDate}
				selected={startDate}
				placeholderText={placeholder}
				// dayClassName={classNames.day}
				showPopperArrow={false}
				popperModifiers={[
					{
						name: 'offset',
						options: {
							offset: [0, -11],
						},
						fn: (state) => state
					},
				]}
				// {...(isRange ? { selectsRange: true} : {})}
				// selectsMultiple={true}
				selectsRange
			/>
		</div>
	)
}
type CustomInputProps = {
	label?: React.ReactNode
	disabled?: boolean
} & ComponentProps<"input">


// const CustomInput = ({ label, disabled, ...rest }: CustomInputProps) => {
// 	const classNames = {
// 		icon: clsx(s.icon, disabled && s.disabled),
// 		inputContainer: s.inputContainer,
// 	}
// 	return (
// 		<Label label={label}>
// 			<div className={classNames.inputContainer}>
// 				<input disabled={disabled} {...rest} />
// 				<div className={classNames.icon}>
// 					<LuCalendarDays />
// 				</div>
// 			</div>
// 		</Label>
// 	)
// }


const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
	({ disabled, label, required, ...rest }, ref) => {
		const classNames = {
			icon: clsx(s.icon, disabled && s.disabled),
			inputContainer: s.inputContainer,
		}

		return (
			<Label label={label} >
				<div className={classNames.inputContainer}>
					<input disabled={disabled} ref={ref} {...rest} />
					<div className={classNames.icon}>
					</div>
				</div>
			</Label>
		)
	}
)

const customHeader = ({ date, decreaseMonth, increaseMonth }: ReactDatePickerCustomHeaderProps) => {

	const classNames = {
		button: s.button,
		buttonBox: s.buttonBox,
		header: s.header,
	}
	
	const headerText = capitalizeFirstLetter(format(date, 'LLLL y'))

	return (
		<div className={classNames.header}>
				<div>{headerText}</div>
				<div className={classNames.buttonBox}>
					<button className={classNames.button} onClick={decreaseMonth} type={'button'}>
					<MdOutlineKeyboardArrowLeft />
					</button>
	
					<button className={classNames.button} onClick={increaseMonth} type={'button'}>
					<MdOutlineKeyboardArrowRight />
					</button>
				</div>
			</div>
	)
}

const capitalizeFirstLetter = (text: string) => {
	return text[0].toUpperCase() + text.slice(1)
}