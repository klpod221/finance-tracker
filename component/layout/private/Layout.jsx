"use client";

import React, { useState } from "react";
import { Layout } from "antd";

import PrivateHeader from "./Header";
import PrivateSidebar from "./Sidebar";
import PrivateFooter from "./Footer";

export default function PrivateLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout>
      <PrivateSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <Layout>
        <PrivateHeader collapsed={collapsed} setCollapsed={setCollapsed} />

        <Layout.Content className="mt-4 mx-4 overflow-y-auto">
          {children}
        </Layout.Content>

        <PrivateFooter />
      </Layout>
    </Layout>
  );
}
