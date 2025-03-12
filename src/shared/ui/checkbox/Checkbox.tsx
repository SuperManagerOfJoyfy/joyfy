import * as CheckboxRadix from '@radix-ui/react-checkbox'
import {IoCheckmarkSharp} from "react-icons/io5";
import styles from "./checkBox.module.scss";
import {ComponentProps} from "react";

type Props = {
    label?: string
} & ComponentProps<typeof CheckboxRadix.Root>

export const Checkbox = ({label, disabled}: Props) => (
    <form>
        <div className={styles.main} aria-disabled={disabled}>
            <CheckboxRadix.Root className={styles.Root} id="c1" disabled={disabled}>
                <CheckboxRadix.Indicator className={styles.Indicator}>
                    <IoCheckmarkSharp/>
                </CheckboxRadix.Indicator>
            </CheckboxRadix.Root>

            <label className={styles.Label} htmlFor="c1">
                {label}
            </label>
        </div>
    </form>
);
