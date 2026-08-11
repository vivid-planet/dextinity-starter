import "@dextinity/site-nextjs/css";
import "@fontsource/roboto";
import "@fontsource/roboto/700.css";
import "@src/styles/global.scss";

import { ErrorHandler } from "@src/util/ErrorHandler";
import type { ReactNode } from "react";

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
    return <ErrorHandler>{children}</ErrorHandler>;
}
