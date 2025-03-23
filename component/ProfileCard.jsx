"use client";

import { useUserStore } from "@/store/userStore";
import { DateTime } from "luxon";
import currencyCodes from "currency-codes";
import { useNotify } from "@/utils/notify";

import { update } from "@/actions/profile";

import { Card, Avatar, Button, Form, Select } from "antd";
import { UserOutlined, EditOutlined } from "@ant-design/icons";

export default function ProfileCard() {
  const notify = useNotify();
  const { user, setUser } = useUserStore();

  const timezones = Intl.supportedValuesOf("timeZone");
  const timezoneOptions = timezones.map((tz) => {
    const offset = DateTime.now().setZone(tz).offset / 60; // Chuyển phút sang giờ
    const sign = offset >= 0 ? "+" : "";
    return {
      value: tz,
      label: `${tz} (UTC${sign}${offset})`,
    };
  });

  const currencies = currencyCodes.codes();
  const currencyOptions = currencies.map((code) => {
    return {
      value: code,
      label: `${code}`,
    };
  });

  const handleSubmit = async (formData) => {
    notify.loading("Saving changes...");
    try {
      const { data, error } = await update(formData);
      if (error) throw error;
      setUser({ ...user, ...formData });
      notify.success("Profile updated successfully!");
    } catch (error) {
      notify.error("Failed to update profile. Please try again.");
    }
  };

  return (
    <Card className="w-full max-w-md h-fit">
      <Form
        labelCol={{ span: 5 }}
        onFinish={handleSubmit}
        initialValues={{
          currency: user.currency,
          timezone: user.timezone,
          name: user.name,
        }}
      >
        <div className="flex items-center gap-4">
          <Avatar size={64} src={user.avatar} icon={<UserOutlined />} />
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        <div className="mt-4">
          <Form.Item label="Currency" name="currency">
            <Select
              options={currencyOptions}
              placeholder="Select your currency"
            />
          </Form.Item>
          <Form.Item label="Timezone" name="timezone">
            <Select
              options={timezoneOptions}
              placeholder="Select your timezone"
            />
          </Form.Item>
          <Button
            type="primary"
            className="w-full"
            icon={<EditOutlined />}
            htmlType="submit"
          >
            Save Changes
          </Button>
        </div>
      </Form>
    </Card>
  );
}
