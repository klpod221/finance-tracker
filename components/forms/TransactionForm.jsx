import { DateTime } from "luxon";
import dayjs from "dayjs";
import MoneyInput from "../MoneyInput";

import { Form, DatePicker, Input, Select } from "antd";

export default function TransactionForm({
  form,
  onFinish,
  type
}) {
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
      <Form.Item name="note" label="Note">
        <Input.TextArea rows={4} />
      </Form.Item>
    </Form>
  );
}
