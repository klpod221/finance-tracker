"use client";

import { useEffect, useState } from "react";

import { DateTime } from "luxon";
import dayjs from "dayjs";
import MoneyInput from "../MoneyInput";

import { getAll } from "@/actions/categories";

import { Form, DatePicker, Input, Select, AutoComplete } from "antd";

export default function TransactionForm({
  form,
  onFinish,
  type,
  categories = false,
}) {
  const [categoryOptions, setCategoryOptions] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data: categories } = await getAll();
      console.log(categories);
      setCategoryOptions(
        categories.map((category) => ({
          label: category.name,
          value: category.id,
          type: category.type,
        }))
      );
    };

    if (categories) {
      fetchCategories();
    }
  }, []);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        if (categories) {
          const category = categoryOptions.find(
            (option) => option.value === values.category_id
          );
          console.log(category);
          onFinish({
            ...values,
            type: category && category.type,
            date: DateTime.fromJSDate(values.date.toDate()).toISODate(),
          });
        } else {
          onFinish({
            ...values,
            date: DateTime.fromJSDate(values.date.toDate()).toISODate(),
          });
        }
      }}
      initialValues={{
        type: type || "income",
        date: dayjs(),
        amount: 0,
      }}
    >
      <Form.Item name="date" label="Date" rules={[{ required: true }]}>
        <DatePicker className="w-full" />
      </Form.Item>
      <Form.Item name="amount" label="Amount" rules={[{ required: true }]}>
        <MoneyInput className="w-full" />
      </Form.Item>
      {categories ? (
        <Form.Item
          name="category_id"
          label="Category"
          rules={[{ required: true, message: "Please select a category" }]}
        >
          <Select
            options={categoryOptions}
            placeholder="Select a category"
            filterOption={(inputValue, option) =>
              option.label.toLowerCase().includes(inputValue.toLowerCase())
            }
            showSearch
          />
        </Form.Item>
      ) : (
        <Form.Item
          name="type"
          label="Type"
          rules={[{ required: true, message: "Please select a type" }]}
        >
          <Select
            options={[
              { label: "Income", value: "income" },
              { label: "Expense", value: "expense" },
            ]}
            placeholder="Select a type"
            disabled={!!type}
          />
        </Form.Item>
      )}
      <Form.Item name="note" label="Note">
        <Input.TextArea rows={4} />
      </Form.Item>
    </Form>
  );
}
