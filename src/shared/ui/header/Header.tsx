import React from "react";
import s from "./Header.module.scss";

type Props = {
    isAuthenticated: boolean
    loginButton?: React.ReactNode
    signupButton?: React.ReactNode
    notification?: React.ReactNode
    languageSelector: React.ReactNode
}

export const Header = ({
                           isAuthenticated,
                           languageSelector,
                           loginButton,
                           notification,
                           signupButton
                       }: Props) => {

    return (
        <header className={s.header}>
            <div className={s.container}>
                <div className={s.logo}>Inctagram</div>
                <div className={s.actions}>
                    {isAuthenticated ? (
                        <>
                            {notification}
                        </>
                    ) : (
                        <div>
                            {loginButton}
                            {signupButton}
                        </div>
                    )}
                    <div>
                        {languageSelector}
                    </div>
                </div>
            </div>
        </header>
    );
};
