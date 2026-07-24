import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeState {
  isDark: boolean;
  toggleTheme: () => void;
  setDark: (dark: boolean) => void;
}

const applyThemeToDOM = (isDark: boolean) => {
  if (typeof document !== "undefined") {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDark: false,

      toggleTheme: () =>
        set((state) => {
          const newDark = !state.isDark;
          applyThemeToDOM(newDark);
          return { isDark: newDark };
        }),

      setDark: (dark: boolean) => {
        applyThemeToDOM(dark);
        set({ isDark: dark });
      },
    }),
    {
      name: "tutorlink-theme",
      onRehydrateStorage: () => (state) => {
        if (state) applyThemeToDOM(state.isDark);
      },
    }
  )
);
