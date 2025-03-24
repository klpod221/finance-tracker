"use client";

import React from "react";
import { redirect } from "next/navigation";
import PublicLayout from "@/components/layout/public/Layout";
import { Button } from "antd";
import { LoginOutlined, GithubOutlined } from "@ant-design/icons";

export default function Home() {
  return (
    <PublicLayout>
      <div className="flex flex-col items-center justify-center h-screen">
        <img 
          src="/images/logo.png"
          alt="Logo"
          className="w-32 h-32 lg:w-42 lg:h-42 mb-4"
        />
        <h1 className="text-2xl lg:text-4xl font-bold">
          Welcome to Finance Tracker
        </h1>
        <p className="text-sm lg:text-lg mt-2">
          A simple and easy to use finance tracking application.
        </p>
        <div className="flex flex-row mt-4">
          <Button
            type="primary"
            className="mr-2"
            onClick={() => redirect("/auth/login")}
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
            Source
          </Button>
        </div>
      </div>
    </PublicLayout>
  );
}
