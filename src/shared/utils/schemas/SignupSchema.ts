import {z} from 'zod'

const passwordError = 'Password must contain a-z, A-Z, ! " # $ % & \' ( ) * + , - . / : ; < = > ? @ [ \ ] ^ _` { | } ~'

export const SignupSchema = z.object({
	username: z
	.string()
	.min(6, 'Minimum number of characters 6')
	.max(30, 'Maximum number of characters 30')
	.regex(/^[0-9A-Za-z_-]+$/, {message: 'Invalid characters entered'}),

	email: z
	.string()
	.email('The email must match the format example@example.com'),

	password: z
	.string()
	.min(6, 'Minimum number of characters 6')
	.max(20, 'Maximum number of characters 20')
	.regex(/^[0-9A-Za-z!\"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+$/, {message: passwordError}),
	
	confirmPassword: z.string(),
	
	agreeToTerms: z
	.literal(true, {errorMap: () => ({message: 'You must agree the Terms & Conditions'})} )
	
}).refine( (arg) => arg.password ===arg.confirmPassword, {
	message: 'The passwords must match',
	path: ['confirmPassword']
})

type SignupSchema = z.infer<typeof SignupSchema>