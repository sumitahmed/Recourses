"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  // Pass non-standard nonce if needed, but really the script is injected by next-themes.
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
