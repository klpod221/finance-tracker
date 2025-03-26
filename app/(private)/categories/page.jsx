import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

import { create, search, update, remove } from "@/actions/categories";

import MyCardList from "@/components/MyCardList";
import CategoryForm from "@/components/forms/CategoryForm";

export const metadata = {
  title: "Categories | Financial Tracker by klpod221",
  description: "Specify your categories for transactions",
};

// TODO: Thêm chức năng xem mức chi tiêu trên từng danh mục dựa theo budget
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
        <MyCardList
          fetchFunction={search}
          createFunction={create}
          updateFunction={update}
          deleteFunction={remove}
          title="Categories"
          description="Manage your categories for transactions"
          dataForm={CategoryForm}
        />
      </div>
    </>
  );
}
