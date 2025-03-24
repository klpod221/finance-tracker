"use client";

import { Layout } from "antd";
import PublicFooter from "./Footer";

export default function PublicLayout({ children }) {
  return (
    <Layout>
      <Layout.Content>
        {children}
      </Layout.Content>

      <PublicFooter />
    </Layout>
  );
}
