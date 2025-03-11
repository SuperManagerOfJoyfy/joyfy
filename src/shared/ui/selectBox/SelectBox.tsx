import React from 'react'
import * as Select from "@radix-ui/react-select"
import s from './SelectBox.module.scss'

import { FiChevronDown, FiChevronUp } from "react-icons/fi";
// import * as React from "react";
// import { Select } from "radix-ui";
// import classnames from "classnames";
// import {
// 	CheckIcon,
// 	ChevronDownIcon,
// 	ChevronUpIcon,
// } from "@radix-ui/react-icons";
// import "./styles.css";

export const SelectBox = () => {
	return ((
		<Select.Root>
			<Select.Trigger className={s.selectTrigger} aria-label="Food">
				<Select.Value placeholder="Select a fruit…" />
				<Select.Icon className="SelectIcon">
					<FiChevronDown />
				</Select.Icon>
			</Select.Trigger>
			<Select.Portal>
				<Select.Content className="SelectContent">
					<Select.ScrollUpButton className="SelectScrollButton">
						<FiChevronUp />
					</Select.ScrollUpButton>
					<Select.Viewport className="SelectViewport">
						<Select.Group>
							<Select.Label className="SelectLabel">Fruits</Select.Label>
							<SelectItem value="apple">Apple</SelectItem>
							<SelectItem value="banana">Banana</SelectItem>
							<SelectItem value="blueberry">Blueberry</SelectItem>
							<SelectItem value="grapes">Grapes</SelectItem>
							<SelectItem value="pineapple">Pineapple</SelectItem>
						</Select.Group>

						<Select.Separator className="SelectSeparator" />

						<Select.Group>
							<Select.Label className="SelectLabel">Vegetables</Select.Label>
							<SelectItem value="aubergine">Aubergine</SelectItem>
							<SelectItem value="broccoli">Broccoli</SelectItem>
							<SelectItem value="carrot" disabled>
								Carrot
							</SelectItem>
							<SelectItem value="courgette">Courgette</SelectItem>
							<SelectItem value="leek">Leek</SelectItem>
						</Select.Group>

						<Select.Separator className="SelectSeparator" />

						<Select.Group>
							<Select.Label className="SelectLabel">Meat</Select.Label>
							<SelectItem value="beef">Beef</SelectItem>
							<SelectItem value="chicken">Chicken</SelectItem>
							<SelectItem value="lamb">Lamb</SelectItem>
							<SelectItem value="pork">Pork</SelectItem>
						</Select.Group>
					</Select.Viewport>
					<Select.ScrollDownButton className="SelectScrollButton">
						<FiChevronDown />
					</Select.ScrollDownButton>
				</Select.Content>
			</Select.Portal>
		</Select.Root>
	))
};



const SelectItem = React.forwardRef<
	React.ElementRef<typeof Select.Item>,
	React.ComponentPropsWithoutRef<typeof Select.Item>
>(({ className, children, ...props }, ref) => (
	<Select.Item
		ref={ref}
		className={''}
		{...props}
	>
		<span className="">
			<Select.ItemIndicator>
				{/* <Check className="h-4 w-4" /> */}
			</Select.ItemIndicator>
		</span>
		<Select.ItemText>{children}</Select.ItemText>
	</Select.Item>
))
SelectItem.displayName = Select.Item.displayName



