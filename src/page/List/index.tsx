import React, { useEffect, useState } from "react";

import { Button, Table, Image, message } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";

import {
  freezeUser,
  list,
  ListResponse,
  unFreezeUser,
} from "../request/interface";
import { UpdateModal } from "../Update";

export const List = () => {
  const [dataSource, setDataSource] = useState([]);
  const [pagination, setPagination] = useState({
    pageSize: 3,
    current: 1,
    total: 0,
  });
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [updateUserId, setUpdateUserId] = useState<number>();
  const [listLoading, setListLoading] = useState(false);

  const getList = async (page = 1, pageSize = 3) => {
    setListLoading(true);
    try {
      const { data } = await list({ pageNumber: page, pageSize });
      if (data.data.data) {
        setDataSource(data.data.data);
        setPagination({ current: page, pageSize, total: data.data.totalCount });
        setListLoading(false);
      }
    } catch (error) {
      setListLoading(false);
    }
  };

  const columns: ColumnsType<ListResponse> = [
    {
      dataIndex: "id",
      title: "ID",
    },
    {
      dataIndex: "username",
      title: "用户名",
    },
    {
      dataIndex: "headPic",
      title: "头像",
      render: (_) =>
        _ ? <Image src={_} alt="" style={{ width: 30, height: 30 }} /> : "-",
    },
    {
      dataIndex: "email",
      title: "邮箱",
    },
    {
      dataIndex: "createTime",
      title: "创建时间",
    },
    {
      dataIndex: "updateTime",
      title: "更新时间",
    },
    {
      dataIndex: "isFrozen",
      title: "是否冻结",
      render: (_) => (_ ? "是" : "否"),
    },
    {
      dataIndex: "nickName",
      title: "昵称",
    },
    {
      dataIndex: "phoneNumber",
      title: "电话号码",
    },
    {
      title: "操作",
      render: (_, col) => {
        return (
          <div>
            <Button
              style={{ paddingLeft: 0 }}
              type="link"
              onClick={() => {
                setUpdateUserId(col.id);
                setUpdateModalVisible(true);
              }}
            >
              更新
            </Button>
            <Button
              type="link"
              onClick={async () => {
                const res = col.isFrozen
                  ? await unFreezeUser({ id: col.id })
                  : await freezeUser({ id: col.id });
                console.log({ res });

                if (res.status === 200) {
                  message.success("操作成功", 1, () =>
                    getList(pagination.current, pagination.pageSize)
                  );
                } else {
                  message.error("操作失败");
                }
              }}
            >
              {col.isFrozen ? "解冻" : "冻结"}
            </Button>
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      <Table
        loading={listLoading}
        title={() => <div>用户信息列表</div>}
        rowKey={(row) => row.id}
        columns={columns}
        dataSource={dataSource}
        pagination={{
          ...pagination,
          onChange: (page: number, pageSize: number) => {
            getList(page, pageSize);
          },
        }}
      />
      <UpdateModal
        visible={updateModalVisible}
        id={updateUserId}
        onCancel={() => setUpdateModalVisible(false)}
      />
    </div>
  );
};
