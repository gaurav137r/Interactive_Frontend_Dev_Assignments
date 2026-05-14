import { createContext, useContext, useState } from "react";

const GlobalThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((currentTheme) => (currentTheme === "light" ? "dark" : "light"));
  };

  return (
    <GlobalThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </GlobalThemeContext.Provider>
  );
};

export const useTheme = () => useContext(GlobalThemeContext);
