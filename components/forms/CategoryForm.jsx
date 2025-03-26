"use client";

import React from "react";

import MoneyInput from "@/components/MoneyInput";

import { Form, Space, Input, Select, ColorPicker } from "antd";
import * as Icons from "@ant-design/icons";

export default function CategoryForm({ form, onFinish }) {
  const [period, setPeriod] = React.useState(
    form.getFieldValue("period") || "monthly"
  );

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={(values) => {
        values.period = period;
        onFinish(values);
      }}
      initialValues={{
        icon: "DollarCircleOutlined",
        color: "#a0dc50",
        budget: 0,
        type: "income",
      }}
    >
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please enter a name" }]}
      >
        <Input />
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
          defaultValue="expense"
        />
      </Form.Item>
      {/* TODO: Nếu type = income thì sẽ disable phần budget */}
      <Form.Item name="budget" label="Budget">
        <MoneyInput
          addonBefore="VND"
          addonAfter={
            <Select
              defaultValue={period}
              onChange={(value) => {
                setPeriod(value);
              }}
              options={[
                { label: "/day", value: "daily" },
                { label: "/weeks", value: "weekly" },
                { label: "/months", value: "monthly" },
              ]}
              className="w-24"
            />
          }
        />
      </Form.Item>
      <Form.Item name="icon" label="Icon">
        <Select
          showSearch
          options={Object.keys(Icons).map((icon) => ({
            value: icon,
            label: (
              <Space>
                {React.createElement(Icons[icon])}
                <span>{icon}</span>
              </Space>
            ),
          }))}
          placeholder="Select an icon"
          filterOption={(inputValue, option) =>
            option.value.toLowerCase().includes(inputValue.toLowerCase())
          }
        />
      </Form.Item>
      <Form.Item name="description" label="Description">
        <Input.TextArea rows={3} />
      </Form.Item>
      <Form.Item
        name="color"
        label="Color"
        rules={[{ required: true, message: "Please select a color" }]}
      >
        <ColorPicker
          showText={true}
          onChange={(color) =>
            form.setFieldsValue({ color: color.toHexString() })
          }
        />
      </Form.Item>
    </Form>
  );
}
