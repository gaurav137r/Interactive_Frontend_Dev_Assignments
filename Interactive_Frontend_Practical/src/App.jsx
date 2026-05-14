import React from 'react';
import { ThemeProvider, useTheme } from './GlobalTheme';
import ThemeButton from './ThemeButton';
import './App.css';

function AppContent() {
  const { theme } = useTheme();

  return (
    <div className={`container ${theme}`}>
      <h1>React Theme Switcher</h1>
      <ThemeButton />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
