"use client";

import { useRouter } from "next/navigation";
import { login } from "@/actions/auth";
import { useNotify } from "@/utils/notify";
import { useUserStore } from "@/store/userStore";

import { Checkbox, Form, Input } from "antd";

export default function LoginPage() {
  const router = useRouter();
  const notify = useNotify();

  const { fetchUserInfo } = useUserStore();

  const handleSubmit = async (formData) => {
    notify.loading("Logging in...");

    try {
      await login(formData);
      const res = await login(formData);

      if (res && res.error) {
        notify.error(res.error.message);
        return;
      }

      notify.success("Login successful!");
      
      await fetchUserInfo();
      router.push("/dashboard");
    } catch (error) {
      notify.error("Login failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="grid grid-cols-1 gap-0 h-full lg:grid-cols-2 lg:gap-0">
        <div className="flex flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              alt="Your Company"
              src="/images/logo.png"
              className="mx-auto h-20 w-auto"
            />
            <h2 className="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
              Sign in to your account
            </h2>
            <p className="text-center text-sm/6 text-gray-500">
              Not a member?{" "}
              <a
                href="#"
                className="font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Register now
              </a>
            </p>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <Form
              onFinish={handleSubmit}
              className="space-y-6"
              layout="vertical"
              labelCol={{ span: 24 }}
              initialValues={{
                remember: true,
              }}
            >
              <Form.Item
                label="Email address"
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Please enter your email!",
                  },
                  {
                    type: "email",
                    message: "Please enter a valid email!",
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please enter your password!",
                  },
                ]}
              >
                <Input.Password />
              </Form.Item>

              <div className="flex items-center justify-between">
                <Form.Item
                  name="remember"
                  valuePropName="checked"
                  label={null}
                  noStyle
                >
                  <Checkbox>Remember me</Checkbox>
                </Form.Item>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer"
                >
                  Sign in
                </button>
              </div>
            </Form>
          </div>
        </div>

        <div className="h-full hidden lg:block">
          <img
            className="object-cover w-full h-full"
            src="https://images.unsplash.com/photo-1496917756835-20cb06e75b4e?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1908&amp;q=80"
          />
        </div>
      </div>
    </div>
  );
}
