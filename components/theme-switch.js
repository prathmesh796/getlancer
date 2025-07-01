"use client";

import AppThemeProvider from "@/components/theme";
import { useTheme } from "next-themes";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { IoSunny } from "react-icons/io5";

function Tab() {
  const { setTheme, theme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? (
          <BsFillMoonStarsFill />
        ) : (
          <IoSunny />
        )}
    </button>
  );
}

function ThemeTabs() {
  return (
    <AppThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Tab />
    </AppThemeProvider>
  );
}

export default ThemeTabs;