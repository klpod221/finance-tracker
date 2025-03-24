"use client";

import { create, search, update, remove } from "@/actions/categories";

import MyTable from "@/components/common/MyTable";
import CategoryForm from "@/components/forms/CategoryForm";
import TagType from "@/components/common/TagType";
import TagColor from "@/components/common/TagColor";
import IconByName from "@/components/common/IconByName";

import { formatDate } from "@/utils/helpers";

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
      title: "Type",
      dataIndex: "type",
      sorter: true,
      filters: [
        { text: "Income", value: "income" },
        { text: "Expense", value: "expense" },
      ],
      filterMode: "tree",
      render: (type) => <TagType type={type} />,
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
