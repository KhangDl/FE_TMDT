import React from "react";
import { Layout, Menu, Input, Avatar, Switch } from "antd";
import { Link, useLocation } from "react-router-dom";
import { ShoppingOutlined, UserOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Search } = Input;

export default function HeaderBar({ extra }) {
  const location = useLocation();
  const current = (() => {
    if (location.pathname.startsWith("/login")) return ["login"];
    if (location.pathname.startsWith("/register")) return ["register"];
    if (location.pathname.startsWith("/dashboard")) return ["dashboard"];
    return ["home"];
  })();

  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        background: "linear-gradient(90deg, #ff7b00, #ff9a3c)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          color: "#00FF7F",
          fontSize: 22,
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <ShoppingOutlined style={{ fontSize: 24 }} />
        An Khang Bình Vượng
      </div>

      {/* Menu */}
      <Menu
        mode="horizontal"
        theme="dark"
        selectedKeys={current}
        style={{
          background: "transparent",
          border: "none",
          flex: 1,
          marginLeft: 50,
        }}
        items={[
          { key: "home", label: <Link to="/">Home</Link> },
          { key: "login", label: <Link to="/login">Login</Link> },
          { key: "register", label: <Link to="/register">Register</Link> },
          { key: "dashboard", label: <Link to="/dashboard">Dashboard</Link> },
        ]}
      />

      {/* Search box + theme toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Search placeholder="Search products..." style={{ width: 200 }} />
        {extra}
        <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#fff1" }} />
      </div>
    </Header>
  );
}
