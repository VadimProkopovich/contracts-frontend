import React from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import LeadsPage from "./pages/LeadsPage";
import ContractsPage from "./pages/ContractsPage";
import ContractsKanbanPage from "./pages/ContractsKanbanPage";
import UsersPage from "./pages/UsersPage";
import LoginPage from "./pages/LoginPage"; // Новый импорт
import styles from "./styles/App.module.css";

const App = () => {
  const location = useLocation(); // Получаем текущий маршрут
  const isLoginPage = location.pathname === "/login"; // Проверяем, является ли это страница логина

  return (
    <div className={styles.container}>
      {!isLoginPage && ( // Условный рендеринг меню
        <nav className={styles.navbar}>
          <NavLink
            to="/leads"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Leads
          </NavLink>
          <NavLink
            to="/contracts"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Contracts Table
          </NavLink>
          <NavLink
            to="/contracts-kanban"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Contracts Kanban
          </NavLink>
          <NavLink
            to="/users"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            Users
          </NavLink>
        </nav>
      )}
      <Routes>
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/contracts" element={<ContractsPage />} />
        <Route path="/contracts-kanban" element={<ContractsKanbanPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/login" element={<LoginPage />} /> {/* Новый маршрут */}
        <Route path="/" element={<h1>Welcome to the React App!</h1>} />
      </Routes>
    </div>
  );
};

export default App;
