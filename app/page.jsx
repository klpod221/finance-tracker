"use client";

import React from "react";

import PublicLayout from "@/component/layout/public/Layout";
import { Button } from "antd";

import { LoginOutlined, GithubOutlined } from "@ant-design/icons";

export default function Home() {

  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-4xl font-bold">Welcome to Finance Tracker</h1>
        <p className="text-lg mt-2">
          A simple and easy to use finance tracking application.
        </p>
        <div className="flex flex-row mt-4">
          <Button
            type="primary"
            className="mr-2"
            onClick={() => window.open("/auth/login", "_self")}
          >
            <LoginOutlined />
            Login
          </Button>
          <Button
            type="default"
            onClick={() =>
              window.open(
                "https://github.com/klpod221/finance-tracker",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <GithubOutlined />
            Github
          </Button>
        </div>
      </div>
    </PublicLayout>
  );
}
