import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import ApiManagerTable from "@/components/ApiManagerTable";

export const metadata = {
  title: "API Manager | Finance Tracker by klpod221",
  description: "Manage your API keys here",
};

export default function ApiManager() {

  return (
    <>
      <Breadcrumb
        items={[
          {
            href: "/dashboard",
            title: <HomeOutlined />,
          },
          {
            title: "API Manager",
          },
        ]}
      />
      <div className="mt-4">
        <ApiManagerTable />
      </div>
    </>
  );
}
