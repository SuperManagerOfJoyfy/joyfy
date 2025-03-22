import { Typography } from '@/shared/ui/typography'
import Image, { StaticImageData } from 'next/image'
import React, { ComponentProps } from 'react'
import s from './InfoBlock.module.scss'
import clsx from 'clsx'

type Props = {
	title: string
	description: string
	imageSrc: StaticImageData,
	className: string
} & ComponentProps<'div'>

export const InfoBlock = ({ title, description, imageSrc, children, className }: Props) => {
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
