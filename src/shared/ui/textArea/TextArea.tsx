import { ComponentProps, useId } from "react";
import clsx from "clsx";
import styles from "./textArea.module.scss";

type TextAreaProps = {
  label?: string;
  error?: string;
} & ComponentProps<"textarea">;

export const TextArea = ({
  label,
  error,
  className,
  ...props
}: TextAreaProps) => {
  const id = useId();

  return (
    <div className={clsx(styles.textAreaContainer, className)}>
      <label
        className={styles.label}
        htmlFor={id}
        aria-disabled={props.disabled}
      >
        {label}
      </label>

      <div className={clsx(styles.wrapper, error && styles.error)}>
        <textarea
          className={styles.textArea}
          data-value={props.value && "true"}
          id={id}
          {...props}
        />
      </div>

      <span className={styles.errorText}>{error}</span>
    </div>
  );
};
