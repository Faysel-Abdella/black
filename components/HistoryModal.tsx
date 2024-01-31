import { useEffect, useState } from "react";

import { Form, Row, Button, Radio, Input, Col, Flex, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";

type TableData = {
  key: any;
  type: string;
  selectNum: string;
  reason: string;
};

export default function HistoryModal() {
  const [damageTypes, setDamageTypes] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchAdminLists = async () => {
    setIsFetching(true);
    const accessToken = localStorage.getItem("accessToken");
    const typesList = await customFetch.get(
      "/api/v1/admins/blacks/damagetypes",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const damagesData = typesList.data.reverse();

    const transformedTypesList = damagesData.map(
      (type: any, index: number) => ({
        key: index + 1 < 9 ? `0${index + 1}` : `${index + 1}`,
        type: type.name,
        selectNum: type.selectedCount,
        reason: new Date(type.createdAt).toISOString().split("T")[0],
      })
    );

    setDamageTypes(transformedTypesList);
    setIsFetching(false);
  };

  useEffect(() => {
    try {
      fetchAdminLists();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleAddNewDamageType = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const name = form.getFieldValue("name");

    if (!name) {
      return toast.error("유형을 적어주세요", { autoClose: 2000 });
    }

    setIsLoading(true);

    try {
      const response = await customFetch.post(
        "/api/v1/admins/blacks/damagetypes",
        {
          name: name,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setIsLoading(false);
      form.resetFields();
      fetchAdminLists();
      toast.success("처리가 완료되었습니다", { autoClose: 3000 });
    } catch (error) {
      console.log(error);
    }
  };

  const [form] = Form.useForm();
  const columns: ColumnsType<TableData> = [
    {
      title: "번호",
      dataIndex: "key",
      align: "center",
      render(value, record, index) {
        return <span>{(index + 1).toString().padStart(2, "0")}</span>;
      },
    },
    {
      title: "유형명",
      dataIndex: "type",
      align: "center",
    },
    {
      title: "선택수",
      dataIndex: "selectNum",
      align: "center",
    },
    {
      title: "변경사유",
      dataIndex: "reason",
      align: "center",
    },
  ];
  const data = [
    {
      key: "1",
      type: "청소", // YES
      selectNum: "3", // YES (selectedCount)
      reason: "2023.09.01", // YES
    },
    {
      key: "2",
      type: "계약금",
      selectNum: "5",
      reason: "2023.09.02",
    },
    {
      key: "3",
      type: "납입금",
      selectNum: "2",
      reason: "2023.09.03",
    },
    {
      key: "4",
      type: "위생",
      selectNum: "1",
      reason: "2023.09.04",
    },
  ];
  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div className="modal-form form-inline h-[100%]">
      <Form colon={false} layout="horizontal" form={form}>
        <Row gutter={[16, 0]}>
          <Col md={24}>
            <Form.Item
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              name="name"
              label="유형명"
              className="m-0 custom-label-margin"
            >
              <Space style={{ display: "block" }}>
                <div style={{ display: "flex" }}>
                  <Input name="name" />
                  <Button
                    onClick={handleAddNewDamageType}
                    size="small"
                    className="ant-btn-info ml-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div
                        className="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-slate-50 rounded-full"
                        role="status"
                        aria-label="loading"
                      ></div>
                    ) : (
                      "추가"
                    )}
                  </Button>
                </div>
              </Space>
            </Form.Item>
          </Col>
          <Col md={24} className="mt-12">
            {isFetching ? (
              <div className="flex justify-center items-center h-24">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
              </div>
            ) : (
              <Table
                bordered
                columns={columns}
                dataSource={damageTypes}
                onChange={onChange}
                pagination={{
                  pageSize: 15,
                }}
              />
            )}
          </Col>
        </Row>
      </Form>
    </div>
  );
}
