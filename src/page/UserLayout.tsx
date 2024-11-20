import * as React from "react";

import { Button, Menu, Layout } from "antd";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

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

export const UserLayout = (value: any) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [selectKey, setSelectKey] = React.useState(["meeting-room"])

  const menu = [
    {
      key: "meeting-room",
      label: "会议室列表",
    },
    {
      key: "history",
      label: "预定历史",
    },
  ];

  const selectMenu = (value: any) => {
    navigate(`/${value.key}`);
    setSelectKey(value.key)
  };

  return (
    <Layout style={layoutStyle}>
      <Sider style={{ backgroundColor: "#fff" }}>
        <Menu selectedKeys={selectKey} style={{ height: "100vh" }} items={menu} onClick={selectMenu} />
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
            <div>用户名称：aaa</div>
            <Button type="link">退出</Button>
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
