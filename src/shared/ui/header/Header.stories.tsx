import type {Meta, StoryObj} from '@storybook/react';
import {Header} from './Header';
import {SelectBox} from "@/shared/ui/selectBox/SelectBox";
import {Button} from "@/shared/ui/button";

const meta: Meta<typeof Header> = {
    title: 'Components/Header',
    component: Header,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Header>;

// Состояние без авторизации (показаны кнопки Log in и Sign up)

const options = [
    {
        value: "french",
        children: (
            <div>
                <span>🇫🇷</span> French
            </div>
        ),
    },
    {
        value: "german",
        children: (
            <div>
                <span>🇩🇪</span> German
            </div>
        ),
    },
    {
        value: "russian",
        children: (
            <div>
                <span>🇷🇺</span> Russian
            </div>
        ),
    },
    {
        value: "english",
        children: (
            <div>
                <span>🇺🇸</span> English
            </div>
        ),
    },
]

export const Unauthenticated: Story = {
    render: () => <Header
        isAuthenticated={false}
        languageSelector={<SelectBox placeholder={"Choose language"} options={options}/>}
        loginButton={<Button type={'button'} variant={"primary"} size={'small'}>Sign up</Button>}
        signupButton={<Button type={'button'} variant={"text"} size={'small'}>Log in</Button>}
        />
};

// Состояние после авторизации (показан колокольчик)
export const Authenticated: Story = {
    render: () => (
        <Header isAuthenticated={true} languageSelector={undefined}/>
    ),
};
