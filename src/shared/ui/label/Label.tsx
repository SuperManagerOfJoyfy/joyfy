import * as LabelRadixUI from '@radix-ui/react-label'
import clsx from 'clsx';
import { ComponentPropsWithoutRef, ReactNode } from 'react';
import s from './Label.module.scss'

type Props = {
	label: ReactNode
	disabled?: boolean
	htmlFor?: string
} & ComponentPropsWithoutRef<'label'>

export const Label = ({ children, label, className, disabled, htmlFor, ...rest}: Props) => {

	const classNames = {
		label: clsx(s.label, disabled && s.disabled)
	}

	return (
		<LabelRadixUI.Root htmlFor={htmlFor}>
			{
			label && 
			<div className={classNames.label}>
				{label}
			</div>
			}
			{children}
		</LabelRadixUI.Root>
	)
};

