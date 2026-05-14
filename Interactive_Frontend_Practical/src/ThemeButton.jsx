import { useTheme } from './GlobalTheme';

const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-button" onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'Dark' : 'Light'} Mode
    </button>
  );
};

export default ThemeButton;
