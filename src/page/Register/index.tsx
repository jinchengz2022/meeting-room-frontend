import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, message, Button, Input, Space } from "antd";

import {
  RegisterUser,
  getCaptchaCode,
  register,
} from "../../request/interface";

const { Item } = Form;

export const Register = () => {
  const [form] = Form.useForm();
  const navigation = useNavigate();

  const onSubmit = async (values: RegisterUser) => {
    try {
      const res = await register(values);
      if (res.status === 201) {
        message.success("注册成功！", 1, () => navigation("/login"));
      } else {
        message.error(res.data.data);
      }
    } catch (error) {
      message.error(String(error));
    }
  };

  const sendMail = async () => {
    const email = form.getFieldValue("email");
    try {
      if (email) {
        const res = await getCaptchaCode(email);
        if (res.status !== 201 && res.status !== 200) {
          message.error(res.data.data);
        } else {
          message.success('发送成功')
        }
      } else {
        message.info('请填写您的邮箱')
      }
    } catch (error) {
      console.error(String(error));
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 200,
      }}
    >
      <div style={{ width: 400 }}>
        <Form
          wrapperCol={{ span: 20 }}
          labelCol={{ span: 4 }}
          form={form}
          onFinish={onSubmit}
        >
          <Item
            name="username"
            label="用户名"
            rules={[
              {
                required: true,
                message: "please input name",
              },
            ]}
          >
            <Input />
          </Item>
          <Item
            name="password"
            label="密码"
            required
            rules={[
              {
                required: true,
                message: "please input password",
              },
            ]}
          >
            <Input.Password />
          </Item>
          <Item
            name="email"
            label="邮箱"
            rules={[
              {
                required: true,
                message: "please input email",
              },
            ]}
          >
            <Input />
          </Item>
          <Item label="验证码" required style={{ marginBottom: 0 }}>
            <Space align="center">
              <Item
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: "please input captcha",
                  },
                ]}
              >
                <Input style={{ width: "100%" }} />
              </Item>
              <Button style={{ marginBottom: 24 }} onClick={sendMail}>
                获取验证码
              </Button>
            </Space>
          </Item>
          <Item name="nickName" label="昵称">
            <Input />
          </Item>
          <Item label=" " colon={false}>
            <Button
              onClick={form.submit}
              type="primary"
              style={{ width: "100%" }}
            >
              注册
            </Button>
          </Item>
        </Form>
      </div>
    </div>
  );
};
