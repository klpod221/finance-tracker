"use client";

import { create, search, update, remove } from "@/actions/categories";

import MyTable from "@/components/common/MyTable";
import CategoryForm from "@/components/forms/CategoryForm";
import TagType from "@/components/common/TagType";
import TagColor from "@/components/common/TagColor";
import IconByName from "@/components/common/IconByName";

import { formatDate, formatMoney } from "@/utils/helpers";

export default function CategoryTable() {
  const columns = [
    {
      title: "Icon",
      dataIndex: "icon",
      render: (icon) => <IconByName name={icon} className="text-xl" />,
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: true,
      render: (name) => <span>{name}</span>,
    },
    {
      title: "Budget",
      render: (_, record) => {
        const budget = record.budget;
        const period = record.period === "daily" ? "day" : record.period.replace("ly", "s");

        return (
          <span>
            {budget ? (
              <>
                {formatMoney(budget)} / {period}
              </>
            ) : (
              <span className="text-gray-400">No budget</span>
            )}
          </span>
        );
      }
    },
    {
      title: "Color",
      dataIndex: "color",
      render: (color) => <TagColor color={color} />,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      sorter: true,
      render: (createdAt) => <span>{formatDate(createdAt)}</span>,
    },
  ];

  return (
    <MyTable
      columns={columns}
      fetchFunction={search}
      createFunction={create}
      updateFunction={update}
      deleteFunction={remove}
      title="Categories"
      description="Manage your categories for transactions"
      dataForm={CategoryForm}
    />
  );
}
