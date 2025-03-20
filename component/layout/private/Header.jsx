"use client";

import { useEffect, useState } from "react";
import { logout, getUser } from "@/actions/auth";

import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DownOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Layout, Button, Dropdown } from "antd";
const { Header } = Layout;

const items = [
  {
    key: "profile",
    icon: <UserOutlined />,
    label: "Profile",
  },
  {
    key: "settings",
    icon: <SettingOutlined />,
    label: "Settings",
  },
  {
    type: "divider",
  },
  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: <span onClick={logout}>Logout</span>,
  },
];

export default function PrivateHeader({ collapsed, setCollapsed }) {
  const [user, setUser] = useState({});

  useEffect(() => {
    async function fetchUser() {
      const user = await getUser();
      setUser(user);
    }
    fetchUser();
  }, []);

  return (
    <Header className={`!p-0 !bg-white flex justify-between items-center`}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        className="w-16 h-16 !text-lg"
        onClick={() => setCollapsed(!collapsed)}
      />

      <Dropdown
        menu={{
          items,
        }}
        arrow
      >
        <Button type="text" icon={<UserOutlined />}>
          <span className="hidden lg:block">{user.email?.split("@")[0]}</span>
          <DownOutlined />
        </Button>
      </Dropdown>
    </Header>
  );
}
