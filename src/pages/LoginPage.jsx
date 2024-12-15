import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import styles from "../styles/LoginPage.module.css";

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = ({ username, password }) => {
    setLoading(true);

    // Mocked authentication
    setTimeout(() => {
      setLoading(false);
      if (username === "admin" && password === "admin") {
        message.success("Авторизация успешна!");
        navigate("/contracts-kanban"); // Перенаправление на главную страницу
      } else {
        message.error("Неверные имя пользователя или пароль!");
      }
    }, 1000); // Симуляция задержки ответа сервера
  };

  return (
    <div className={styles.loginContainer}>
      <Form name="login" className={styles.loginForm} onFinish={onFinish}>
        <Title level={2} className={styles.title}>
          Вход в систему
        </Title>

        <Form.Item
          name="username"
          rules={[{ required: true, message: "Введите имя пользователя!" }]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Имя пользователя"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Введите пароль!" }]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Пароль"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className={styles.loginButton}
          >
            Войти
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
