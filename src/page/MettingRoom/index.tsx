import { useEffect, useState } from "react";

import { Form, Input, Button, Table, message, Popconfirm } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { useLocation } from "react-router-dom";

import {
  ListResponse,
  deleteMeetingRoom,
  meetingRoomList,
} from "../request/interface";
import { CreateAndUpdateModal } from "./CreateAndUpdate";
import { CreateModal } from "../Reserve/CreateModal";
import { jsonTranstion } from "../../utils/jsonTranstion";

export const MettingRoom = () => {
  const [form] = Form.useForm();
  const { pathname } = useLocation();
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: 3,
    current: 1,
    total: 0,
  });
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [createReserveVisible, setCreateReserveVisible] = useState(false);
  const [updateRoomId, setUpdateRoomId] = useState<number | undefined>();

  const getList = async (params?: { page: number; pageSize: number }) => {
    try {
      const { data } = await meetingRoomList({
        ...params,
        pageNumber: params?.page ?? 1,
        pageSize: params?.pageSize ?? 3,
      });
      if (data.data.data) {
        setDataSource(data.data.data);
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

  const deleteRoom = async (id: number) => {
    try {
      const res = await deleteMeetingRoom({ id });
      if (res.status === 201 || res.status === 200) {
        message.success("操作成功", 1, () =>
          getList({
            page: pagination.current,
            pageSize: pagination.pageSize,
          })
        );
      }
    } catch (error) {}
  };

  const columns: ColumnsType<ListResponse> = [
    // {
    //   dataIndex: "id",
    //   title: "ID",
    // },
    {
      dataIndex: "name",
      title: "会议室名称",
    },
    {
      dataIndex: "capacity",
      title: "容量",
    },
    {
      dataIndex: "position",
      title: "位置",
    },
    {
      dataIndex: "desc",
      title: "描述",
      render: (_) => (_ ? _ : "-"),
    },
    {
      dataIndex: "isBooked",
      title: "是否被预定",
      render: (_) => (_ ? "是" : "否"),
    },
    {
      title: "操作",
      render: (_, col) => {
        return pathname.includes("user") ? (
          <Button
            type="link"
            onClick={() => {
              setUpdateRoomId(col.id);
              setCreateReserveVisible(true);
            }}
          >
            预定
          </Button>
        ) : (
          <div>
            <Button
              style={{ paddingLeft: 0 }}
              type="link"
              onClick={() => {
                setUpdateRoomId(col.id);
                setUpdateModalVisible(true);
              }}
            >
              更新
            </Button>
            <Popconfirm
              title="确定删除该会议室吗？"
              onConfirm={() => deleteRoom(col.id)}
            >
              <Button type="link">删除</Button>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  const onFinish = (values: any) => {
    getList(values);
  };

  return (
    <div>
      <Form layout="inline" form={form} onFinish={onFinish}>
        <Form.Item label="名称" name="name">
          <Input />
        </Form.Item>
        <Form.Item label="位置" name="position">
          <Input />
        </Form.Item>
        <Form.Item label="容纳人数" name="capacity">
          <Input />
        </Form.Item>
        <Form.Item label=" " colon={false}>
          <div>
            <Button type="primary" onClick={form.submit}>
              查询
            </Button>
            <Button
              style={{ marginLeft: 12 }}
              onClick={() => {
                setUpdateModalVisible(true);
              }}
            >
              创建会议室
            </Button>
          </div>
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
      {updateModalVisible ? (
        <CreateAndUpdateModal
          visible={updateModalVisible}
          id={updateRoomId}
          onCancel={() => {
            setUpdateModalVisible(false);
            setUpdateRoomId(undefined);
          }}
          refreshList={() =>
            getList({
              page: pagination.current,
              pageSize: pagination.pageSize,
            })
          }
        />
      ) : null}
      {createReserveVisible ? (
        <CreateModal
          roomId={updateRoomId!}
          visible={createReserveVisible}
          onCancel={() => setCreateReserveVisible(false)}
          refreshList={() =>
            getList({
              page: pagination.current,
              pageSize: pagination.pageSize,
            })
          }
        />
      ) : null}
    </div>
  );
};
