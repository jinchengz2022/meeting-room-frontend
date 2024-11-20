import * as React from "react";

import { Button, Menu, Layout } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";

import { jsonTranstion } from "../utils/jsonTranstion";

const { Header, Footer, Sider, Content } = Layout;

const headerStyle: React.CSSProperties = {
  textAlign: "center",
  height: 64,
  paddingInline: 48,
  lineHeight: "64px",
  backgroundColor: "#fff",
  display: "inline-flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const contentStyle: React.CSSProperties = {
  textAlign: "center",
  minHeight: 120,
  lineHeight: "120px",
  color: "#fff",
  backgroundColor: "#fff",
};

const siderStyle: React.CSSProperties = {
  textAlign: "center",
  lineHeight: "120px",
  backgroundColor: "#fff",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  color: "#fff",
  backgroundColor: "#fff",
};

const layoutStyle = {
  overflow: "hidden",
  width: "100%",
};

export const Home = (value: any) => {
  const { pathname } = useLocation();
  const { isAdmin, username } = jsonTranstion(localStorage.getItem("userInfo"));
  const navigate = useNavigate();
  const [selectKey, setSelectKey] = React.useState([pathname]);

  const adminMenu = [
    {
      key: "/admin/meeting-room",
      label: "会议室管理",
    },
    {
      key: "/admin/meeting-room/booking",
      label: "预定管理",
    },
    {
      key: "/admin/list",
      label: "用户管理",
    },
    {
      key: "/admin/permission",
      label: "权限管理",
    },
  ];

  const userMenu = [
    {
      key: "/user/meeting-room",
      label: "会议室列表",
    },
    {
      key: "/user/history",
      label: "预定历史",
    },
  ];

  React.useEffect(() => {
    if (!isAdmin && pathname.includes("admin")) {
      navigate(`/error`);
    }
  }, [pathname]);

  const selectMenu = (value: any) => {
    navigate(`${value.key}`);
    setSelectKey(value.key);
  };

  return (
    <Layout style={layoutStyle}>
      <Sider style={{ backgroundColor: "#fff" }}>
        <Menu
          selectedKeys={selectKey}
          style={{ height: "100vh" }}
          items={pathname.includes("admin") ? adminMenu : userMenu}
          onClick={selectMenu}
        />
      </Sider>
      <Layout>
        <Header style={headerStyle}>
          <div />
          <div
            style={{
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            <Button type="link" icon={<UserOutlined />}>
              {username}
            </Button>
            <Button type="link" onClick={() => navigate("/login")}>
              退出
            </Button>
          </div>
        </Header>
        <Content style={contentStyle}>
          <Outlet />
        </Content>
        <Footer style={footerStyle}>Footer</Footer>
      </Layout>
    </Layout>
  );
};