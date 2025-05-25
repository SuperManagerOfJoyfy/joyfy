import * as React from 'react'
import * as Select from '@radix-ui/react-select'
import s from './SelectBox.module.scss'
import { FiChevronDown } from 'react-icons/fi'
import clsx from 'clsx'
import { TextField } from '../textField'

type SelectBoxProps = React.ComponentPropsWithoutRef<typeof Select.Root> & {
  placeholder?: string
  width?: string
  className?: string
  searchable?: boolean
  maxHeight?: string
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
}

const SelectBox = ({
  placeholder,
  disabled,
  width = 'auto',
  defaultValue,
  onValueChange,
  className,
  children,
  searchable = false,
  maxHeight = '200px',
  ...props
}: SelectBoxProps) => {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [isOpen, setIsOpen] = React.useState(false)

  const filteredChildren = React.useMemo(() => {
    if (!searchable || !searchTerm) return children

    return React.Children.toArray(children).filter((child) => {
      if (React.isValidElement<SelectItemProps>(child)) {
        const childText = child.props.children
        if (typeof childText === 'string') {
          return childText.toLowerCase().includes(searchTerm.toLowerCase())
        }
        if (childText && typeof childText === 'object' && 'toString' in childText) {
          return childText.toString().toLowerCase().includes(searchTerm.toLowerCase())
        }
      }
      return true
    })
  }, [children, searchTerm, searchable])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      setSearchTerm('')
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
    }
  }

  return (
    <Select.Root defaultValue={defaultValue} onValueChange={onValueChange} onOpenChange={handleOpenChange} {...props}>
      <Select.Trigger
        style={{ width }}
        className={clsx(s.trigger, className)}
        aria-label={placeholder}
        disabled={disabled}
      >
        <Select.Value placeholder={placeholder} />
        <Select.Icon className={clsx(s.icon, s.open)}>
          <FiChevronDown />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className={s.content} position="popper" avoidCollisions style={{ maxHeight }}>
          {searchable && isOpen && (
            <div className={s.searchContainer}>
              <div className={s.searchWrapper}>
                <TextField
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className={s.searchInput}
                  autoFocus
                  onKeyDown={handleSearchKeyDown}
                />
              </div>
            </div>
          )}
          <Select.Viewport className={s.viewport}>
            {filteredChildren}
            {searchable && React.Children.count(filteredChildren) === 0 && searchTerm.length > 0 && (
              <div className={s.noResults}>No results found</div>
            )}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  )
}

const SelectItem = React.forwardRef<
  React.ComponentRef<typeof Select.Item>,
  React.ComponentPropsWithoutRef<typeof Select.Item>
>(({ children, className, ...props }, forwardedRef) => {
  return (
    <Select.Item className={clsx(s.item, className)} {...props} ref={forwardedRef}>
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  )
})
SelectItem.displayName = 'SelectItem'

export { SelectBox, SelectItem }
