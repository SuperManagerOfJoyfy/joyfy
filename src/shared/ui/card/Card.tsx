import { ComponentProps } from "react";
import clsx from "clsx";
import styles from "./card.module.scss";

export const Card = ({
  children,
  className,
  ...props
}: ComponentProps<"div">) => {
  return (
    <div className={clsx(styles.card, className)} {...props}>
      {children}
    </div>
  );
};
