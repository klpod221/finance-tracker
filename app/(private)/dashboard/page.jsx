import { Breadcrumb } from "antd";
import { HomeFilled } from "@ant-design/icons";

export const metadata = {
  title: 'Dashboard | Financial Tracker by klpod221',
  description: 'Dashboard page of the Financial Tracker application',
};

export default function Dashboard() {
  return (
    <>
      <Breadcrumb
        items={[
          {
            href: "/dashboard",
            title: <HomeFilled />,
          },
        ]}
      />
      <p>Welcome to the dashboard page</p>
    </>
  );
}
