import { FC, useEffect } from "react";

import { Modal, Form, Input, message, InputNumber } from "antd";

import {
  UpdateMeetingRoomInfoRequest,
  createMeetingRoomInfo,
  getMeetingRoom,
  updateMeetingRoomInfo,
} from "../../request/interface";

const { Item } = Form;

export const CreateAndUpdateModal: FC<{
  visible: boolean;
  id?: number;
  onCancel: () => void;
  refreshList: () => void;
}> = ({ visible, id, onCancel, refreshList }) => {
  const [form] = Form.useForm();

  const queryMeetingRoomInfo = async () => {
    try {
      if (id) {
        const res = await getMeetingRoom({ id });

        if (res.data.data) {
          form.setFieldsValue({ ...res.data.data });
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    queryMeetingRoomInfo();
  }, [id]);

  const onSubmit = async (values: Omit<UpdateMeetingRoomInfoRequest, "id">) => {
    try {
      if (id) {
        const res = await updateMeetingRoomInfo({
          ...values,
          id,
        });
        if (res.status === 201 || res.status === 200) {
          message.success("更新成功！", 1, () => {
            onCancel();
            refreshList();
          });
        }
      } else {
        const res = await createMeetingRoomInfo(values);
        if (res.status === 201 || res.status === 200) {
          message.success("创建成功！", 1, () => {
            onCancel();
            refreshList();
          });
        } else {
          message.error(res?.data?.data)
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      destroyOnClose
      title={id ? "更新会议室" : "创建会议室"}
      open={visible}
      onCancel={onCancel}
      onOk={form.submit}
    >
      <Form
        wrapperCol={{ span: 18 }}
        labelCol={{ span: 6 }}
        form={form}
        onFinish={onSubmit}
      >
        <Item
          name="name"
          label="会议室名称"
          rules={[
            {
              required: true,
              message: "please input meeting name",
            },
          ]}
        >
          <Input placeholder="please input meeting name" />
        </Item>
        <Item
          name="position"
          label="会议室位置"
          rules={[
            {
              required: true,
              message: "please input position",
            },
          ]}
        >
          <Input placeholder="please input position" />
        </Item>
        <Item
          name="capacity"
          label="会议室容量"
          rules={[
            {
              required: true,
              message: "please input capacity",
            },
          ]}
        >
          <InputNumber placeholder="please input capacity" />
        </Item>
        <Item name="desc" label="描述">
          <Input.TextArea />
        </Item>
      </Form>
    </Modal>
  );
};
