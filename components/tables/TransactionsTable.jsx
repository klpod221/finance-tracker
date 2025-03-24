"use client";

import React, { useEffect, useState } from "react";
import { formatDate, formatMoney } from "@/utils/helpers";

import { create, search, update, remove } from "@/actions/transactions";
import { getAll } from "@/actions/categories";

import { Space } from "antd";

import MyTable from "@/components/common/MyTable";
import TagType from "@/components/common/TagType";
import TransactionForm from "@/components/forms/TransactionForm";

export default function TransactionTable() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAll();
        if (res.error) {
          throw new Error(res.error.message);
        }
        setCategories(res.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: true,
      render: (text) => formatDate(text),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      sorter: true,
      render: (text) => formatMoney(text),
    },
    {
      title: "Category",
      dataIndex: "category_id",
      key: "category",
      sorter: true,
      render: (text) => {
        const category = categories.find((cat) => cat.id === text);
        return (
          category && (
            <Space>
              {category.name}
              <TagType type={category.type} />
            </Space>
          )
        );
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      ellipsis: true,
    },
  ];

  return (
    <MyTable
      columns={columns}
      fetchFunction={search}
      createFunction={create}
      updateFunction={update}
      deleteFunction={remove}
      title="Transactions"
      description="Track your transactions with the Financial Tracker application"
      dataForm={TransactionForm}
      formProps={{
        categories,
      }}
    />
  );
}
