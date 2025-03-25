"use client";

import { useNotify } from "@/utils/notify";
import { changePassword } from "@/actions/auth";

import { Card, Form, Input, Button } from "antd";
import { LockOutlined } from "@ant-design/icons";

export default function PasswordChange() {
  const notify = useNotify();
  
  const handleSubmit = async (formData) => {
    notify.loading("Changing password...");

    try {
      await changePassword(formData);
      notify.success("Password changed successfully!");
    } catch (error) {
      notify.error(error.message || "Failed to change password. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md" title="Change Password">
      <Form
        onFinish={handleSubmit}
        autoComplete="off"
        initialValues={{
          currentPassword: "",
          password: "",
          confirmPassword: "",
        }}
        layout="vertical"
      >
        <Form.Item
          label="New Password"
          name="password"
          rules={[
            { required: true, message: "Please input your new password!" },
          ]}
        >
          <Input.Password placeholder="New Password" autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          label="Confirm New Password"
          name="confirmPassword"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your new password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match!"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm New Password" autoComplete="new-password" />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          className="w-full"
        >
          <LockOutlined />
          Change Password
        </Button>
      </Form>
    </Card>
  );
}
