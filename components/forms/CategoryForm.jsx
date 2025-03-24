"use client";

import React from "react";

import { Form, Space, Input, Select, ColorPicker } from "antd";
import * as Icons from "@ant-design/icons";

export default function CategoryForm({ form, onFinish }) {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        type: "income",
        icon: "DollarCircleOutlined",
        color: "#a0dc50",
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
          placeholder="Select a type"
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
