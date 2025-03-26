import Image, { StaticImageData } from 'next/image'
import React, { ComponentProps } from 'react'
import s from './EmailVerification.module.scss'
import clsx from 'clsx'
import { Typography } from '@/shared/ui'

type Props = {
	title: string
	description: string
	imageSrc: StaticImageData,
	className: string
} & ComponentProps<'div'>

export const EmailVerification = ({ title, description, imageSrc, children, className }: Props) => {
	return (
		<div className={clsx(s.container, className)}>
			<Typography variant='h2' as='h2'>{title}</Typography>
			<Typography variant='body1' className={s.description}>{description}</Typography>
			{children}
			<div className={s.imageContainer}>
				<Image src={imageSrc} alt="" />
			</div>
		</div>
	)
}
