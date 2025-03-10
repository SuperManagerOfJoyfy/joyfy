import { ComponentProps } from "react";
import clsx from "clsx";
import styles from "./card.module.scss";

export const Card = (props: ComponentProps<"div">) => {
  const { children, className, ...rest } = props;

  return (
    <div className={clsx(styles.card, className)} {...rest}>
      {children}
    </div>
  );
};
