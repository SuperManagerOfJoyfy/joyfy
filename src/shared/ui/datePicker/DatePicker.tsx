import { ReactDatePickerCustomHeaderProps, registerLocale } from 'react-datepicker';
import * as RDP from 'react-datepicker'
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
	placeholder?: string
	startDate1: Date | null
	endDate1?: Date | null
	onSetStartDate?: (date: Date | null) => void
	onSetEndDate?: (date: Date | null) => void
}

const RDPC = (((RDP.default as any).default as any) ||
	(RDP.default as any) ||
	(RDP as any)) as typeof RDP.default

export const DatePicker1 = (
	{
	startDate1,
	endDate1,
	onSetStartDate,
	onSetEndDate,
	placeholder,
}: DatePickerProps) => {


	// const [startDate, setStartDate] = useState(startDate1);
	// const [endDate, setEndDate] = useState(endDate1);

	const isRange = endDate1 !== undefined
	// const isRange = false

	const datePickerHandler = (dates: [Date | null, Date | null] | Date) => {
		console.log(dates);

		if (Array.isArray(dates)) {
			const [start, end] = dates;
			// setStartDate(start);
			// setEndDate(end);
			onSetStartDate?.(start);
			onSetEndDate?.(end);
		} else {
			// setStartDate(dates);
			onSetStartDate?.(dates);
		}
	};

	const classNames = {
		root: s.root,
		calendar: s.calendar,
		input: clsx(s.input, textFieldStyles.input),
		day: () => s.day
	}

	return (
		<div className={classNames.root}>
			{isRange ?
			<RDPC
				dateFormat={'dd/MM/yyyy'}
				calendarClassName={classNames.calendar}
				className={classNames.input}
					onChange={datePickerHandler}
				customInput={<CustomInput />}
				renderCustomHeader={customHeader}
				startDate={startDate1}
				endDate={endDate1}
				selected={startDate1}
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
					selectsRange
			/>
		:
				<RDPC
					dateFormat={'dd/MM/yyyy'}
					calendarClassName={classNames.calendar}
					className={classNames.input}
					onChange={() => {}}
					customInput={<CustomInput />}
					renderCustomHeader={customHeader}
					startDate={startDate1}
					// endDate={endDate}
					selected={startDate1}
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
				/>}
		</div>
	)
}
type CustomInputProps = {
	label?: React.ReactNode
	disabled?: boolean
} & ComponentProps<"input">


const CustomInput = ({ label, disabled, ...rest }: CustomInputProps) => {
	const classNames = {
		icon: clsx(s.icon, disabled && s.disabled),
		inputContainer: s.inputContainer,
	}
	return (
		<Label label={label}>
			<div className={classNames.inputContainer}>
				<input disabled={disabled} {...rest} />
				<div className={classNames.icon}>
					<LuCalendarDays />
				</div>
			</div>
		</Label>
	)
}


// const CustomInput = forwardRef<HTMLInputElement, CustomInputProps>(
// 	({ disabled, label, required, ...rest }, ref) => {
// 		const classNames = {
// 			icon: clsx(s.icon, disabled && s.disabled),
// 			inputContainer: s.inputContainer,
// 		}

// 		return (
// 			<Label label={label} >
// 				<div className={classNames.inputContainer}>
// 					<input disabled={disabled} ref={ref} {...rest} />
// 					<div className={classNames.icon}>
// 					</div>
// 				</div>
// 			</Label>
// 		)
// 	}
// )

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