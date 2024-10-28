import type { Theme } from "@/lib/themes";
import { atom, useAtom } from "jotai";
import { useEffect } from "react";

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem("theme") as Theme;
  return savedTheme || "default";
};

export const themeAtom = atom<Theme>(getInitialTheme());

export function useTheme() {
  const [theme, setTheme] = useAtom(themeAtom);

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return { theme, setTheme };
}
