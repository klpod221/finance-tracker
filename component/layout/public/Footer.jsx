import { Layout } from "antd";

export default function PublicFooter() {
  return (
    <Layout.Footer className="text-center text-sm !py-2">
      Finance Tracker ©{new Date().getFullYear()} Created by klpod221
    </Layout.Footer>
  );
}
