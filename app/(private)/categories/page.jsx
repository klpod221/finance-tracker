import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";

import CategoryTable from "@/component/categories/CategoryTable";

export const metadata = {
  title: "Categories | Financial Tracker by klpod221",
  description: "Specify your categories for transactions",
};

export default function Categories() {
  return (
    <>
      <Breadcrumb
        items={[
          {
            href: "/dashboard",
            title: <HomeOutlined />,
          },
          {
            title: "Categories",
          },
        ]}
      />
      <div className="mt-4">
        <CategoryTable />
      </div>
    </>
  );
}
