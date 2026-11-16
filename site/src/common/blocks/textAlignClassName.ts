import clsx from "clsx";

import styles from "./textAlignClassName.module.scss";

const classNameByTextAlign: Record<string, string> = {
    center: styles.center,
    right: styles.right,
    justify: styles.justify,
};

export function textAlignClassName(textAlign: unknown, className?: string): string {
    return clsx(typeof textAlign === "string" && classNameByTextAlign[textAlign], className);
}
