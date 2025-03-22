import type { Meta, StoryObj } from '@storybook/react'
import { Form, FormProps } from '@/shared/ui/form/Form'
import { FieldValues, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const meta = {
  component: Form,
  tags: ['autodocs'],
  title: 'Components/Form',
  argTypes: {
    onSubmit: { action: 'submitted' },
  },
} satisfies Meta<typeof Form>

export default meta
type Story = StoryObj<typeof meta>

const signUpSchema = z.object({
  username: z.string().min(2, 'Username is too short'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
const signInSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Invalid password'),
})

const addContent = (
  <div
    style={{
      display: 'flex',
      justifyContent: 'flex-end',
      width: '100%',
      fontSize: '12px',
      color: 'var(--color-light-900)',
    }}
  >
    Forgot Password
  </div>
)

const FormWrapper = <T extends FieldValues>({
  btnText,
  fields,
  schema,
  additionalContent,
}: FormProps<T>) => {
  const { handleSubmit } = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <Form
      btnText={btnText}
      fields={fields}
      schema={schema}
      onSubmit={() => handleSubmit(console.log)}
      additionalContent={additionalContent}
    />
  )
}

export const Default: Story = {
  args: {
    btnText: 'Register',
    fields: [
      { name: 'username', label: 'Username' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'password', label: 'Password', type: 'password' },
    ],
    schema: signUpSchema,
    onSubmit: async (data) => {
      console.log('Form submitted:', data)
    },
  },
  render: (args) => <FormWrapper {...args} />,
}

export const WithAdditionalContent: Story = {
  args: {
    btnText: 'Sign In',
    fields: [
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'password', label: 'Password', type: 'password' },
    ],
    schema: signInSchema,
    onSubmit: async (data) => {
      console.log('Form submitted:', data)
    },

    additionalContent: addContent,
  },
  render: (args) => <FormWrapper {...args} />,
}
