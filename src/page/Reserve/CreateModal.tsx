import { FC, useEffect, useState } from "react";

import { Modal, Form, Input, message, Select, DatePicker } from "antd";
import dayjs from "dayjs";

import {
  ReserveRoomRequest,
  getMeetingRoom,
  reserveRoom,
} from "../../request/interface";
import { jsonTranstion } from "../../utils/jsonTranstion";
import { getUserList } from "../List/BookingList";

const { Item } = Form;

export const CreateModal: FC<{
  visible: boolean;
  roomId: number;
  onCancel: () => void;
  refreshList: () => void;
}> = ({ visible, roomId, onCancel, refreshList }) => {
  const { id } = jsonTranstion(localStorage.getItem("userInfo"));
  const [form] = Form.useForm();
  const [userList, setUserList] = useState([]);

  const queryUserList = async () => {
      const res = await getUserList();
      setUserList(
        res.map((i: any) => ({
          label: i.username || i.nickName,
          value: i.id,
        }))
      );
  };

  const queryMeetingRoomInfo = async () => {
    try {
      if (roomId) {
        const res = await getMeetingRoom({ id: roomId });

        if (res.data.data) {
          form.setFieldsValue({ ...res.data.data, roomName: res.data.data.name });
        }
      }
    } catch (error) {}
  };

  useEffect(() => {
    queryMeetingRoomInfo();
    queryUserList()
  }, [id]);

  const onSubmit = async (values: Omit<ReserveRoomRequest, "id">) => {
    try {
      if (id) {
        const res = await reserveRoom({
          ...values,
          id,
        });
        if (res.status === 201 || res.status === 200) {
          message.success("预定成功！", 1, () => {
            onCancel();
            refreshList();
          });
        } else {
          message.error(res.data.data)
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      destroyOnClose
      title="预定会议室"
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
          name="roomName"
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
          name="people"
          label="参会人员"
          rules={[
            {
              required: true,
              message: "please select users",
            },
          ]}
        >
          <Select mode='multiple' placeholder="please select users" options={userList} />
        </Item>
        <Item
          name="startTime"
          label="开始时间"
          rules={[
            {
              required: true,
              message: "please select time",
            },
          ]}
        >
          <DatePicker showTime placeholder="please select time" />
        </Item>
        <Item
          name="endTime"
          label="结束时间"
          rules={[
            {
              required: true,
              message: "please select time",
            },
          ]}
        >
          <DatePicker showTime placeholder="please select time" />
        </Item>
      </Form>
    </Modal>
  );
};
