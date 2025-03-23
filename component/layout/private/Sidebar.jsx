"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  DashboardOutlined,
  SwapOutlined,
  TagsOutlined,
  WalletOutlined,
  LineChartOutlined,
  TeamOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";

import { Layout, Menu, Button } from "antd";

const menuItems = [
  { key: "dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "transactions", icon: <SwapOutlined />, label: "Transactions" },
  { key: "categories", icon: <TagsOutlined />, label: "Categories" },
  { key: "budgets", icon: <WalletOutlined />, label: "Budgets & Limits" },
  {
    key: "savings",
    icon: <LineChartOutlined />,
    label: "Savings Goals",
  },
  { key: "groups", icon: <TeamOutlined />, label: "Financial Groups", disabled: true },
  { key: "settings", icon: <SettingOutlined />, label: "Settings" },
  { key: "help", icon: <QuestionCircleOutlined />, label: "Help & Support" },
];

export default function PrivateSidebar({ collapsed, setCollapsed }) {
  const pathname = usePathname();
  const router = useRouter();

  const [selectedKey, setSelectedKey] = useState();
  const [isMobile, setIsMobile] = useState(false);
  const [collapsedWidth, setCollapsedWidth] = useState(80);

  useEffect(() => {
    setSelectedKey(pathname.split("/")[1] || "dashboard");
  }, [pathname]);

  const onMenuClick = (e) => {
    setSelectedKey(e.key);
    router.push(`/${e.key}`);
  };

  // automatically collapse the sidebar on mobile devices
  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 1024) {
        setCollapsed(true);
        setCollapsedWidth(0);
        setIsMobile(true);
      } else {
        setCollapsed(false);
        setCollapsedWidth(80);
        setIsMobile(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call it once on mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <Layout.Sider
      className="!fixed z-50 lg:!relative top-0 h-screen"
      trigger={null}
      collapsible
      collapsed={collapsed}
      collapsedWidth={collapsedWidth}
    >
      <div className="h-8 m-4 flex items-center justify-center text-white font-bold">
        <a href="/" className="!text-white">
          <img src="/images/logo.png" alt="Logo" className="w-8 h-8" />
        </a>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
        selectedKeys={[selectedKey]}
        onClick={onMenuClick}
        items={menuItems}
      />

      {isMobile && !collapsed && (
        <Button
          type="text"
          icon={<MenuFoldOutlined />}
          className="!absolute w-16 h-16 !text-lg left-50 top-4 bg-black/80 rounded-lg"
          onClick={() => setCollapsed(!collapsed)}
        />
      )}
    </Layout.Sider>
  );
}
