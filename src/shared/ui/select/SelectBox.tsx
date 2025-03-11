import * as React from "react";
// import * as SelectPrimitive from "@radix-ui/react-select"
import * as Select from "@radix-ui/react-select"
import styles from './Select.module.scss'
import { FiChevronDown } from "react-icons/fi";
type Props = {
	options: Option[]
	placeholder: string
	children: React.ReactNode
}

// const Select = SelectPrimitive.Root

// const SelectGroup = SelectPrimitive.Group

// const SelectValue = SelectPrimitive.Value

// const SelectBox = ({ options, placeholder, children }: Props) => {
// 	return (
// 		<SelectPrimitive.Root>
// 			<SelectTrigger>
// 				<SelectValue placeholder={placeholder}/>
// 			</SelectTrigger>
// 			<SelectContent>
// 				<SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
// 				{/* {options.map(o => <SelectItem value={o.value}/>)} */}
// 			</SelectContent>
// 		</SelectPrimitive.Root>
// 	);
// }
// const SelectTrigger = React.forwardRef<
// 	React.ComponentRef<typeof SelectPrimitive.Trigger>,
// 	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
// >(({ className, children, ...props }, ref) => (
// 	<SelectPrimitive.Trigger
// 		ref={ref}
// 		className={styles.trigger}
// 		{...props}
// 	>
// 		{children}
// 		<SelectPrimitive.Icon asChild className={styles.icon}>
// 			<FiChevronDown />
// 		</SelectPrimitive.Icon>
// 	</SelectPrimitive.Trigger>
// ))
// SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

// const SelectContent = React.forwardRef<
// 	React.ComponentRef<typeof SelectPrimitive.Content>,
// 	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
// >(({ className, children, position = "popper", ...props }, ref) => (
// 	<SelectPrimitive.Portal>
// 		<SelectPrimitive.Content
// 			ref={ref}
// 			className={styles.content}
// 			position={position}
// 			{...props}
// 		>
// 			<SelectPrimitive.Viewport
// 				className={''}
// 			>
// 				{children}
// 			</SelectPrimitive.Viewport>
// 		</SelectPrimitive.Content>
// 	</SelectPrimitive.Portal>
// ))
// SelectContent.displayName = SelectPrimitive.Content.displayName

// // const SelectLabel = React.forwardRef<
// // 	React.ComponentRef<typeof SelectPrimitive.Label>,
// // 	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
// // >(({ className, ...props }, ref) => (
// // 	<SelectPrimitive.Label
// // 		ref={ref}
// // 		className={cn("px-2 py-1.5 text-sm font-semibold", className)}
// // 		{...props}
// // 	/>
// // ))
// // SelectLabel.displayName = SelectPrimitive.Label.displayName


// const SelectItem = React.forwardRef<
// 	React.ComponentRef<typeof SelectPrimitive.Item>,
// 	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
// >(({ className, children, ...props }, ref) => (
// 	<SelectPrimitive.Item
// 		ref={ref}
// 		className={styles.item}
// 		{...props}
// 	>
// 		<span>
// 			<SelectPrimitive.ItemIndicator>
// 				{/* <Check className="h-4 w-4" /> */}
// 			</SelectPrimitive.ItemIndicator>
// 		</span>
// 		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
// 	</SelectPrimitive.Item>
// ))
// SelectItem.displayName = SelectPrimitive.Item.displayName

// export {
// 	// Select,
// 	// SelectGroup,
// 	SelectValue,
// 	SelectTrigger,
// 	SelectContent,
// 	// SelectLabel,
// 	SelectItem,
// 	SelectBox
// }

type SelectBoxProps = {
	placeholder: string,
	// disabled: 
	options: Option[]
}

type Option = {
	value: string
	children: React.ReactNode
}

//! cnfhsq rjl
const SelectItem = React.forwardRef<React.ComponentRef<typeof Select.Item>,
	React.ComponentPropsWithoutRef<typeof Select.Item>>(
		({ children, className, ...props }, forwardedRef) => {
			return (
				<Select.Item
					className={styles.item}
					{...props}
					ref={forwardedRef}
				>
					<Select.ItemText>{children}</Select.ItemText>
				</Select.Item>
			);
		},
	);

export const SelectBox = React.forwardRef<React.ComponentRef<typeof Select.Root>,SelectBoxProps
>(({placeholder, options}, ref) => {
	return (
		<Select.Root >
			<Select.Trigger className={styles.trigger} aria-label={placeholder}>
				<Select.Value placeholder={placeholder} />
				<Select.Icon className={styles.icon}>
					<FiChevronDown />
				</Select.Icon>
			</Select.Trigger>

			<Select.Portal>

				<Select.Content className={styles.content} position="popper" avoidCollisions >
					<Select.Viewport>
						{/* <Select.Group> */}
						{/* <Select.Label className={styles.Label}>Fruits</Select.Label> */}
						{options.map(o => <SelectItem value={o.value} children={o.children} />)}

						{/* </Select.Group> */}
					</Select.Viewport>
				</Select.Content>

			</Select.Portal>

		</Select.Root>
	)
} );



