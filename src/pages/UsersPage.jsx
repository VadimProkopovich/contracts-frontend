import React from "react";
import UsersTable from "../components/UsersTable";

const UsersPage = () => {
  return (
    <div>
      <h1>Users</h1>
      <UsersTable /> {/* Таблица для пользователей */}
    </div>
  );
};

export default UsersPage;
