import { Layout, Button } from "antd";

export default function PrivateFooter() {
  return (
    <Layout.Footer className="text-center text-sm !py-2">
      Finance Tracker ©{new Date().getFullYear()} Created by
      <Button
        type="link"
        href="https://klpod221.com"
        target="_blank"
        rel="noopener noreferrer"
        className="!px-1"
      >
        klpod221
      </Button>
    </Layout.Footer>
  );
}
