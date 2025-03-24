import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import TransactionsTable from "@/components/tables/TransactionsTable";

export const metadata = {
  title: "Transactions | Financial Tracker by klpod221",
  description: "Track your transactions with the Financial Tracker application",
};

export default function Transactions() {
  return (
    <>
      <Breadcrumb
        items={[
          {
            href: "/dashboard",
            title: <HomeOutlined />,
          },
          {
            title: "Transactions",
          },
        ]}
      />
      <div className="mt-4">
        <TransactionsTable />
      </div>
    </>
  );
}
