"use client";

import PrivateLayout from "../../component/layout/private/Layout";

export default function Layout({ children }) {
  return <PrivateLayout>{children}</PrivateLayout>;
}
