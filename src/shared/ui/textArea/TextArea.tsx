import { ComponentProps, useId } from "react";
import clsx from "clsx";
import styles from "./textArea.module.scss";

type TextAreaProps = {
  label?: string;
  error?: string;
} & ComponentProps<"textarea">;

export const TextArea = (props: TextAreaProps) => {
  const { label, error, className, ...rest } = props;

  const id = useId();

  return (
    <div className={clsx(styles.textAreaContainer, className)}>
      <label
        className={styles.label}
        htmlFor={id}
        aria-disabled={rest.disabled}
      >
        {label}
      </label>

      <div className={clsx(styles.wrapper, error && styles.error)}>
        <textarea
          className={styles.textArea}
          data-value={rest.value && "true"}
          id={id}
          {...rest}
        />
      </div>

      <span className={styles.errorText}>{error}</span>
    </div>
  );
};

// test
