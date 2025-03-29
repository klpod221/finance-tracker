import { Form, Input } from "antd";

export default function ApiForm({ form, onFinish }) {
  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: "Please enter a name" }]}
      >
        <Input />
      </Form.Item>
    </Form>
  );
}
