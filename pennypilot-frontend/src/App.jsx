import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { AppRouter } from './router/AppRouter';

export function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Header />
          <AppRouter />
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
