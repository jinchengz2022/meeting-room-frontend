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
  getImgUrl,
  getUserInfo,
  updateUserInfo,
  upload,
} from "../../request/interface";
import axios from "axios";

const { Item } = Form;

type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];

export const UpdateModal: FC<{
  visible: boolean;
  id?: number;
  onCancel: () => void;
  refreshList: () => void;
}> = ({ visible, id, onCancel, refreshList }) => {
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
    try {
      if (id) {
        const res = await updateUserInfo({
          ...values,
          id,
          headPic: `http://localhost:9000/bucket1/${values?.headPic?.file?.name}`,
        });
        if (res.data.code === 201) {
          message.success("更新成功！", 1, () => {
            onCancel();
            refreshList()
          });
        } else {
          message.error(res.data.data);
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
      setImageUrl(`http://localhost:9000/bucket1/${info.file.name}`);
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
            action={async (file: any) => {
              const res = await getImgUrl(file.name);
              return res.data.data;
            }}
            beforeUpload={beforeUpload}
            customRequest={async (values) => {
              const { onSuccess, file, action } = values;
              const res = await axios.put(action, file);
              onSuccess!(res.data);
            }}
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
        <Item name="nickName" label="昵称">
          <Input />
        </Item>
      </Form>
    </Modal>
  );
};
