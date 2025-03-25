import { DateTime } from "luxon";
import dayjs from "dayjs";
import MoneyInput from "../MoneyInput";

import { Form, DatePicker, Input, Select } from "antd";

export default function TransactionForm({
  form,
  onFinish,
  categories,
}) {
  const categoriesOptions = categories.map((category) => ({
    label: `${category.name}`,
    value: category.id,
  }));

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        onFinish({
          ...values,
          date: DateTime.fromJSDate(values.date.toDate()).toISODate(),
        });
      }}
      initialValues={{
        type: "expense",
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
        />
      </Form.Item>
      <Form.Item
        name="category_id"
        label="Category"
        rules={[{ required: true }]}
      >
        <Select
          showSearch
          options={categoriesOptions}
          filterOption={(input, option) =>
            option.label.toLowerCase().includes(input.toLowerCase())
          }
          placeholder="Select a category"
        />
      </Form.Item>
      <Form.Item name="note" label="Note">
        <Input.TextArea />
      </Form.Item>
    </Form>
  );
}
