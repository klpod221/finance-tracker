import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import TransactionTable from "@/components/TransactionsTable";

export const metadata = {
  title: "Category Detail | Finance Tracker by klpod221",
  description: "This is the detail of the category.",
};

export default async function CategoryDetail({ params }) {
  const { id } = await params;

  return (
    <>
      <Breadcrumb
        items={[
          {
            href: "/dashboard",
            title: <HomeOutlined />,
          },
          {
            href: "/categories",
            title: "Categories",
          },
          {
            title: "Category Detail",
          },
        ]}
      />

      <div className="mt-4">
        {/* TODO: Thêm chức năng thống kê */}
        <TransactionTable categoryId={id} />
      </div>
    </>
  );
}
