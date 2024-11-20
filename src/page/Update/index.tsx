import { FC, useState, useEffect } from "react";

import {
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Upload,
  UploadProps,
  GetProp,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";

import {
  UpdateUserInfoRequest,
  getUserInfo,
  updateUserInfo,
  upload,
} from "../request/interface";

const { Item } = Form;

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export const UpdateModal: FC<{
  visible: boolean;
  id?: number;
  onCancel: () => void;
}> = ({ visible, id, onCancel }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const queryUserInfo = async () => {
    try {
      if (id) {
        const res = await getUserInfo({ id });

        if (res.data.data) {
          form.setFieldsValue({ ...res.data.data });
          setImageUrl(res.data.data.headPic);
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    queryUserInfo();
  }, [id]);

  const onSubmit = async (values: Omit<UpdateUserInfoRequest, "id">) => {
    console.log({ values });

    try {
      if (id) {
        const res = await updateUserInfo({
          ...values,
          id,
          headPic: `http://localhost:3100/${values?.headPic?.file?.response?.data}`,
        });
        if (res.data.code === 201) {
          message.success("更新成功！", 1, () => {
            onCancel();
            navigate("/list");
          });
        }
      }
    } catch (error) {}
  };

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Image must smaller than 10MB!");
    }
    return isJpgOrPng && isLt10M;
  };

  const handleChange: UploadProps["onChange"] = async (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      setLoading(false);
      setImageUrl(`http://localhost:3100/${info.file.response.data}`);
    }
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      {loading ? <Spin /> : <Button>+</Button>}
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  return (
    <Modal
      destroyOnClose
      title="更新信息"
      open={visible}
      onCancel={onCancel}
      onOk={form.submit}
    >
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
        <Item name="headPic" label="头像">
          <Upload
            name="file"
            listType="picture-card"
            showUploadList={false}
            action="http://localhost:3100/user/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
            ) : (
              uploadButton
            )}
          </Upload>
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
            <Button style={{ marginBottom: 24 }} onClick={() => {}}>
              获取验证码
            </Button>
          </Space>
        </Item>
        <Item name="nickName" label="昵称">
          <Input />
        </Item>
      </Form>
    </Modal>
  );
};
