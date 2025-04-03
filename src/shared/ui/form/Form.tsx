'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ReactNode } from 'react'
import { FieldValues, Path, SubmitHandler, useForm, UseFormReset } from 'react-hook-form'
import { ZodType, z } from 'zod'
import s from './form.module.scss'

import { ControlledCheckbox, ControlledTextField } from '@/shared/ui'
import { Button } from '../button'

export type FormProps<T extends FieldValues> = {
  btnText: string
  fields: { name: Path<T>; label?: ReactNode; type?: string }[]
  schema: ZodType<T>
	// onSubmit: (data: T) => Promise<any>
	onSubmit: SubmitHandler<T>
  type?: string
  additionalContent?: ReactNode
  disabled?: boolean
}

export const Form = <T extends FieldValues>({
  btnText,
  fields,
  schema,
  onSubmit,
  additionalContent,
  disabled = false,
}: FormProps<T>) => {
  const { control, handleSubmit, formState, reset } = useForm<T>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  })

	// const handleFormSubmit: SubmitHandler<T> = (data) => {
	// 	onSubmit(data)
	// }

	const handleFormSubmit: SubmitHandler<T> = async (data) => {
		try {
		await onSubmit(data);
		reset();
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<div className={s.formContainer}>
			<form onSubmit={handleSubmit(handleFormSubmit)} className={s.form}>
				{fields.map(({ name, label, type }) =>
					type === 'checkbox' ? (
						<ControlledCheckbox
							key={name}
							control={control}
							name={name}
							label={label}
							disabled={disabled}
						/>
					) : (
						<ControlledTextField
							key={name}
							control={control}
							name={name}
							label={label}
							type={type || 'text'}
							disabled={disabled}
						/>
					)
				)}

				{additionalContent && (
					<div className={s.additionalContent}>{additionalContent}</div>
				)}

				<Button type="submit" fullWidth disabled={disabled}>
					{btnText}
				</Button>
			</form>
		</div>
	)
}
