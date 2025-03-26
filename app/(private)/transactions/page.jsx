import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

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
        <h1 className="text-2xl font-bold">Transactions</h1>
        <p className="mt-2 text-gray-500">
          View and manage your transactions here.
        </p>
        {/* TODO: Thêm chức năng xem danh sách giao dịch */}
      </div>
    </>
  );
}
