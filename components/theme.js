// theme.js
"use client";

import { setCookie } from "cookies-next";
import { ThemeProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";

function AppThemeProvider({ children, ...props }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <ThemeProvider {...props}>
      {mounted ? (
        <>
          <AppThemeProviderHelper />
          {children}
        </>
      ) : null}
    </ThemeProvider>
  );
}

function AppThemeProviderHelper() {
  const { theme } = useTheme();

  useEffect(() => {
    setCookie("__theme__", theme, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      path: "/",
    });
  }, [theme]);

  return null;
}

export default AppThemeProvider;