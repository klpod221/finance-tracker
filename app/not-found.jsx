"use client";

import { useRouter } from "next/navigation";

import { Button } from "antd";
import { DashboardOutlined } from "@ant-design/icons";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <img src="/images/logo.png" alt="Logo" className="w-32 mb-4" />
      <h1 className="text-4xl font-bold text-red-500">404 - Not Found</h1>
      <p className="text-gray-500 mt-2">
        The page you are looking for does not exist or has been moved.
      </p>

      <div className="flex items-center justify-center mt-4">
        <Button
          type="primary"
          className="mr-2"
          onClick={() => router.push("/dashboard")}
        >
          <DashboardOutlined />
          Back to Dashboard
        </Button>
      </div>
    </div>
  );
}
