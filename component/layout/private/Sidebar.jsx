"use client";

import React, { useState } from "react";

import { DashboardOutlined, MenuFoldOutlined, PhoneOutlined } from "@ant-design/icons";

import { Layout, Menu, Button } from "antd";

const menuItems = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: "Dashboard",
  },
  {
    key: "help",
    icon: <PhoneOutlined />,
    label: "Help",
  }
];

export default function PrivateSidebar({ collapsed, setCollapsed }) {
  const [isMobile, setIsMobile] = useState(false);
  const [collapsedWidth, setCollapsedWidth] = useState(80);

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
      className="!fixed lg:!relative top-0 h-screen"
      trigger={null}
      collapsible
      collapsed={collapsed}
      collapsedWidth={collapsedWidth}
    >
      <div className="h-8 m-4 bg-gray-800 rounded-lg flex items-center justify-center text-white font-bold">
        <a href="/" className="!text-white">
          {collapsed ? "Logo" : "Company Logo"}
        </a>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["dashboard"]}
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
