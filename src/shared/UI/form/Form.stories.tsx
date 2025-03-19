import type { Meta, StoryObj } from '@storybook/react'
import { Form, FormProps } from '@/shared/ui/form/Form'
import { FieldValues, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

const meta = {
  component: Form,
  tags: ['autodocs'],
  title: 'Components/Form',
  argTypes: {
    title: { control: 'text' },
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

const socialButtons = (
  <div style={{ display: 'flex', gap: '60px', justifyContent: 'center' }}>
    <FcGoogle style={{ height: '36px', width: '36px' }} />
    <FaGithub style={{ height: '36px', width: '36px' }} />
  </div>
)

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
  title,
  btnText,
  fields,
  schema,
  socialAuthButtons,
  additionalContent,
}: FormProps<T>) => {
  const { handleSubmit } = useForm({
    resolver: zodResolver(schema),
  })

  return (
    <Form
      title={title}
      btnText={btnText}
      fields={fields}
      schema={schema}
      onSubmit={() => handleSubmit(console.log)}
      socialAuthButtons={socialAuthButtons}
      additionalContent={additionalContent}
    />
  )
}

export const Default: Story = {
  args: {
    title: 'Sign Up',
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

export const WithAuthIconsAndAdditionalContent: Story = {
  args: {
    title: 'Sign In',
    btnText: 'Sign In',
    fields: [
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'password', label: 'Password', type: 'password' },
    ],
    schema: signInSchema,
    onSubmit: async (data) => {
      console.log('Form submitted:', data)
    },
    socialAuthButtons: socialButtons,
    additionalContent: addContent,
  },
  render: (args) => <FormWrapper {...args} />,
}
