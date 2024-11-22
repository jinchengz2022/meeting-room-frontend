import { useEffect, useState } from "react";

import { Form, Input, Button, Table, message, Popconfirm } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";

import {
  BookingListResponse,
  bookingList,
  list,
  reserveApply,
  reserveReject,
  reserveUnbind,
} from "../../request/interface";
import { useLocation } from "react-router-dom";
import dayjs from "dayjs";
import { jsonTranstion } from "../../utils/jsonTranstion";
import { reserveStatusFunction } from "../../utils/status";

export const getUserList = async () => {
  try {
    const res = await list({ all: true });
    if (res.status === 201 || res.status === 200) {
      return res.data.data.data;
    }
  } catch (error) {
    return [];
  }
};

export const BookingList = () => {
  const [form] = Form.useForm();
  const { pathname } = useLocation();
  const isAdmin = pathname.includes("admin");
  const { username } = jsonTranstion(localStorage.getItem("userInfo"));
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: 3,
    current: 1,
    total: 0,
  });

  const getList = async (params?: any) => {
    try {
      const userList = await getUserList();
      const { data } = await bookingList({
        ...params,
        userName: isAdmin ? params?.userName : username,
        pageNumber: params?.page ?? 1,
        pageSize: params?.pageSize ?? 3,
      });
      if (data.data.data) {
        setDataSource(
          data.data.data.map((i: any) => ({
            ...i,
            people: i.people.map((userId: number) => {
              const user = userList.find?.((i: any) => i.id === Number(userId));
              if (user) {
                return user;
              }
              return {};
            }),
          }))
        );
        setPagination({
          current: params?.page ?? 1,
          pageSize: params?.pageSize ?? 3,
          total: data.data.totalCount,
        });
      }
    } catch (error) {}
  };

  useEffect(() => {
    getList();
  }, []);

  const successMessage = (res: any) => {
    if (res.status === 201 || res.status === 200) {
      message.success("操作成功");
      getList();
    } else {
      message.error("操作失败");
    }
  };

  const updateRoomInfo = async (id: number, action: string) => {
    if (action === "apply") {
      const res = await reserveApply(id);
      successMessage(res);
    } else if (action === "reject") {
      const res = await reserveReject(id);
      successMessage(res);
    } else if (action === "unbind") {
      const res = await reserveUnbind(id);
      successMessage(res);
    }
  };

  const columns: ColumnsType<BookingListResponse> = [
    // {
    //   dataIndex: "id",
    //   title: "ID",
    // },
    {
      dataIndex: "roomName",
      title: "会议室名称",
    },
    {
      dataIndex: "userName",
      title: "预定人",
    },
    {
      dataIndex: "people",
      title: "参会人",
      render: (_) => (
        <div>
          {_.map((i: any, idx: number) => (
            <span>
              {i?.username}
              {idx === _.length - 1 ? "" : "、"}
            </span>
          ))}
        </div>
      ),
    },
    {
      dataIndex: "startTime",
      title: "开始时间",
      render: (_) => dayjs(_).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      dataIndex: "endTime",
      title: "结束时间",
      render: (_) => dayjs(_).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      dataIndex: "position",
      title: "位置",
    },
    {
      dataIndex: "status",
      title: "预定状态",
      render: (_) => reserveStatusFunction(_),
    },
    {
      title: "操作",
      render: (_, col) => {
        return isAdmin && col.status === 'applying' ? (
          <div>
            <Popconfirm
              title="确定通过预定吗？"
              onConfirm={() => updateRoomInfo(col.id, "apply")}
            >
              <Button type="link">通过</Button>
            </Popconfirm>
            <Popconfirm
              title="确定驳回预定吗？"
              onConfirm={() => updateRoomInfo(col.id, "reject")}
            >
              <Button type="link">驳回</Button>
            </Popconfirm>
          </div>
        ) : ["done", 'reject'].includes(col.status) ? (
          <Popconfirm
            title="确定解除预定吗？"
            onConfirm={() => updateRoomInfo(col.id, "unbind")}
          >
            <Button type="link">解除</Button>
          </Popconfirm>
        ) : null;
      },
    },
  ];

  const onFinish = (values: any) => {
    getList(values);
  };

  return (
    <div>
      <Form layout="inline" form={form} onFinish={onFinish}>
        {isAdmin ? (
          <Form.Item label="预定人" name="userName">
            <Input />
          </Form.Item>
        ) : null}
        <Form.Item label="位置" name="position">
          <Input />
        </Form.Item>
        <Form.Item label="会议室名称" name="roomName">
          <Input />
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <Button type="primary" onClick={form.submit}>
            查询
          </Button>
        </Form.Item>
      </Form>
      <Table
        style={{ marginTop: 24 }}
        rowKey={(row) => row.id}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          ...pagination,
          onChange: (page: number, pageSize: number) => {
            getList({ page, pageSize });
          },
        }}
      />
    </div>
  );
};
