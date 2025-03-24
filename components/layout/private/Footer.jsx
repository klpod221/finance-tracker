import { Layout } from "antd";

export default function PrivateFooter() {
  return (
    <Layout.Footer className="text-center text-sm !py-2">
      Finance Tracker ©{new Date().getFullYear()} Created by{" "}
      <a href="https://klpod221.com" target="_blank" rel="noopener noreferrer">
        klpod221
      </a>
    </Layout.Footer>
  );
}
