// import * as React from "react"
// import * as SelectPrimitive from "@radix-ui/react-select"
// import { FiChevronUp, FiChevronDown } from "react-icons/fi";
// import s from './Select.module.scss'

// const Select = SelectPrimitive.Root

// const SelectGroup = SelectPrimitive.Group

// const SelectValue = SelectPrimitive.Value

// const SelectTrigger = React.forwardRef<
// 	React.ElementRef<typeof SelectPrimitive.Trigger>,
// 	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
// >(({ className, children, ...props }, ref) => {
// 	return (
// 		<SelectPrimitive.Trigger
// 			ref={ref}
// 			className={s.selectTrigger}
// 			{...props}
// 		>
// 			{children}
// 			<SelectPrimitive.Icon asChild>
// 				<FiChevronDown />
// 			</SelectPrimitive.Icon>
// 		</SelectPrimitive.Trigger>
// 	)
// })
// SelectTrigger.displayName = SelectPrimitive.Trigger.displayName


// const SelectContent = React.forwardRef<
// 	React.ElementRef<typeof SelectPrimitive.Content>,
// 	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
// >(({ className, children, position = "popper", ...props }, ref) => {
// 	return (
// 		<SelectPrimitive.Portal>
// 			<SelectPrimitive.Content
// 				ref={ref}
// 				className={s.selectContent}
// 				position={position}
// 				{...props}
// 			>
// 				<SelectPrimitive.Viewport
// 					className={''}
// 				>
// 					{children}
// 				</SelectPrimitive.Viewport>
// 			</SelectPrimitive.Content>
// 		</SelectPrimitive.Portal>
// 	)
// })
// SelectContent.displayName = SelectPrimitive.Content.displayName

// const SelectLabel = React.forwardRef<
// 	React.ElementRef<typeof SelectPrimitive.Label>,
// 	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
// >(({ className, ...props }, ref) => (
// 	<SelectPrimitive.Label
// 		ref={ref}
// 		className={''}
// 		{...props}
// 	/>
// ))
// SelectLabel.displayName = SelectPrimitive.Label.displayName

// const SelectItem = React.forwardRef<
// 	React.ElementRef<typeof SelectPrimitive.Item>,
// 	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
// >(({ className, children, ...props }, ref) => (
// 	<SelectPrimitive.Item
// 		ref={ref}
// 		className={''}
// 		{...props}
// 	>
// 		<span className="">
// 			<SelectPrimitive.ItemIndicator>
// 				{/* <Check className="h-4 w-4" /> */}
// 			</SelectPrimitive.ItemIndicator>
// 		</span>
// 		<SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
// 	</SelectPrimitive.Item>
// ))
// SelectItem.displayName = SelectPrimitive.Item.displayName

// const SelectSeparator = React.forwardRef<
// 	React.ElementRef<typeof SelectPrimitive.Separator>,
// 	React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
// >(({ className, ...props }, ref) => (
// 	<SelectPrimitive.Separator
// 		ref={ref}
// 		className={''}
// 		{...props}
// 	/>
// ))
// SelectSeparator.displayName = SelectPrimitive.Separator.displayName

// export {
// 	Select,
// 	SelectGroup,
// 	SelectValue,
// 	SelectTrigger,
// 	SelectContent,
// 	SelectLabel,
// 	SelectItem,
// 	SelectSeparator
// }
