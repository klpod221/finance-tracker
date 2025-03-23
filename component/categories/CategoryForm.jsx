import React from "react";

import { Form, Space, Input, Select, AutoComplete, ColorPicker } from "antd";
import * as Icons from "@ant-design/icons";

export default function CategoryForm({ form, onFinish, initialValues = {} }) {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={initialValues}
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
        <AutoComplete
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
