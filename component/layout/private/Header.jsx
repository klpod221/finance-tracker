"use client";

import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";

import { logout } from "@/actions/auth";

import { useNotify } from "@/utils/notify";
import { formatDate } from "@/utils/helpers";

import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Layout, Button, Dropdown, Badge, Popover, List, Avatar } from "antd";
const { Header } = Layout;

import { getAll } from "@/actions/notification";

export default function PrivateHeader({ collapsed, setCollapsed }) {
  const router = useRouter();
  const notify = useNotify();

  const { user, deleteUser } = useUserStore();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = async () => {
    notify.loading("Logging out...");
    try {
      await logout();
      deleteUser();
      notify.success("Logout successful!");
      router.push("/auth/login");
    } catch (error) {
      notify.error("Logout failed. Please try again.");
    }
  };

  const notificationContent = (
    <List
      dataSource={notifications}
      className="!max-h-[400px] w-70 overflow-auto"
      renderItem={(item) => (
        <List.Item
          key={item.id}
          className={`!border-b !border-b-gray-200 !py-2 cursor-pointer ${
            item.read ? "opacity-50" : ""
          }`}
          onClick={() => {
            console.log(`Clicked notification ${item.id}`);
          }}
        >
          <div className="flex items-center gap-2">
            <Avatar
              icon={<BellOutlined />}
              className={`!bg-gray-200 !text-gray-500`}
            />
            <div>
              <div className="font-semibold">{item.title}</div>
              <div className="text-gray-500 -mt-1 text-sm">
                {item.description}
              </div>
              <div className="text-gray-400 text-xs">
                {formatDate(item.created_at)}
              </div>
            </div>
          </div>
        </List.Item>
      )}
    />
  );

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
      label: <span onClick={handleLogout}>Logout</span>,
    },
  ];

  // get all notifications from the server
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data, error } = await getAll();
        if (!error) {
          setNotifications(data);
          const unread = data.filter((item) => !item.read).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        notify.error("An error occurred while fetching notifications");
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Header className={`!p-0 !bg-white flex justify-between items-center`}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        className="w-16 h-16 !text-lg"
        onClick={() => setCollapsed(!collapsed)}
      />

      <div className="flex items-center gap-5">
        <Popover
          content={notificationContent}
          title={
            <div className="flex items-center gap-2 justify-between">
              <span>Notifications</span>

              <a className="text-xs text-blue-500" href="#">
                Mark all as read
              </a>
            </div>
          }
          trigger="click"
        >
          <Badge count={unreadCount}>
            <BellOutlined className="text-xl cursor-pointer" />
          </Badge>
        </Popover>

        <Dropdown
          menu={{
            items,
          }}
          arrow
        >
          <div className="flex items-center cursor-pointer pr-4 group">
            <Avatar
              size="small"
              icon={<UserOutlined />}
              className="mr-2 group-hover:scale-120 transition-all duration-200"
              src={user.avatar}
            />
            <span className="hidden ml-1 lg:block">{user.name}</span>
          </div>
        </Dropdown>
      </div>
    </Header>
  );
}
