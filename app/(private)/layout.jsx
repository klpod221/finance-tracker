"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "next/navigation";
import PrivateLayout from "../../component/layout/private/Layout";

import { Button } from "antd";
import { LoginOutlined } from "@ant-design/icons";

export default function Layout({ children }) {
  const router = useRouter();
  const { fetchUserInfo, loading, user } = useUserStore();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  } else if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl lg:text-4xl font-bold">Unauthorized</h1>

        <div className="flex items-center justify-center mt-4">
          <Button
            type="primary"
            className="mr-2"
            onClick={() => router.push("/auth/login")}
          >
            <LoginOutlined />
            Login
          </Button>
        </div>
      </div>
    );
  }

  return <PrivateLayout>{children}</PrivateLayout>;
}
