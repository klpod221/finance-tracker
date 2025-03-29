import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { MessageProvider } from "@/providers/MessageProvider";

import { App } from "antd";

import "@/styles/globals.css";

export const metadata = {
  title: "Finance Tracker by klpod221",
  description:
    "A finance tracker application to manage your personal finances.",
  keywords: "finance, tracker, personal finance, budget, expenses",
  authors: [
    {
      name: "klpod221",
      url: "klpod221.com",
    },
  ],
  creator: "klpod221",
  publisher: "klpod221",
  // openGraph: {
  //   title: "Finance Tracker by klpod221",
  //   description: "A finance tracker application to manage your personal finances.",
  //   url: "https://finance-tracker.klpod221.com",
  //   siteName: "Finance Tracker",
  //   images: [
  //     {
  //       url: "/og-image.png",
  //       width: 1200,
  //       height: 630,
  //     },
  //   ],
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Finance Tracker by klpod221",
  //   description: "A finance tracker application to manage your personal finances.",
  //   images: "/og-image.png",
  // },
  // icons: {
  //   icon: "/favicon.ico",
  //   shortcut: "/favicon.ico",
  //   apple: "/apple-touch-icon.png",
  // },
  // manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://finance.klpod221.com",
  },
  // verification: {
  //   google: "google-site-verification-code",
  //   other: [
  //     { type: "other", name: "verification", value: "verification-code" },
  //   ],
  // },
  applicationName: "Finance Tracker",
  appleMobileWebAppTitle: "Finance Tracker",
  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },
};

// TODO: Thêm loading khi chuyển trang (cho 2 layout private và public)
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="h-screen bg-white">
        <AntdRegistry>
          <App>
            <MessageProvider>{children}</MessageProvider>
          </App>
        </AntdRegistry>
      </body>
    </html>
  );
}
