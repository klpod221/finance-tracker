import PasswordChange from "@/components/PasswordChange";
import ProfileCard from "@/components/ProfileCard";
import { HomeOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";

export const metadata = {
  title: "Settings | Financial Tracker by klpod221",
  description: "Change your profile, password and other settings",
};

export default function Settings() {
  return (
    <>
      <Breadcrumb
        items={[
          {
            href: "/dashboard",
            title: <HomeOutlined />,
          },
          {
            title: "Settings",
          },
        ]}
      />
      <div className="flex flex-col lg:flex-row mt-4 gap-4">
        {/* TODO: Thêm upload avatar cho user */}
        <ProfileCard />

        {/* TODO: Chuyển phần đổi mật khẩu thành modal */}
        <PasswordChange />
      </div>
    </>
  );
}
