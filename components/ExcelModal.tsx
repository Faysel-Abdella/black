import { Form, Row, Button, Radio, Input, Col, Space, Table } from "antd";
import { ColumnsType } from "antd/es/table";

type TableData = {
  key: any;
  status: string;
  date: string;
  reason: string;
  file: string;
  admin: string;
};

export default function ExcelModal() {
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const tableColumns: ColumnsType<TableData> = [
    {
      title: "번호",
      dataIndex: "key",
      align: "center",
      render(value, record, index) {
        return <span>{(index + 1).toString().padStart(2, "0")}</span>;
      },
    },
    {
      title: "변경상태",
      dataIndex: "status",
      align: "center",
    },
    {
      title: "변경일시",
      dataIndex: "date",
      align: "center",
    },
    {
      title: "변경사유",
      dataIndex: "reason",
      align: "center",
    },
    {
      title: "파일",
      dataIndex: "file",
      align: "center",
      render(value, recode, index) {
        return value === "다운로드" ? (
          <Button
            className="ant-btn-info !p-0 !w-[75px] !h-[32px] rounded-full"
            onClick={() => console.log("클릭")}
          >
            다운로드
          </Button>
        ) : (
          "-"
        );
      },
    },
    {
      title: "관리자",
      dataIndex: "admin",
      align: "center",
    },
  ];

  const tableData: TableData[] = [
    {
      key: 1,
      status: "동의",
      date: "2023.09.02",
      reason: "실수",
      file: "다운로드",
      admin: "이중재",
    },
    {
      key: 2,
      status: "비동의",
      date: "2023.09.03",
      reason: "요청",
      file: "다운로드",
      admin: "이중재",
    },
    {
      key: 3,
      status: "동의",
      date: "2023.09.03",
      reason: "실수",
      file: "",
      admin: "이중재",
    },
    {
      key: 4,
      status: "비동의",
      date: "2023.09.04",
      reason: "요청",
      file: "다운로드",
      admin: "이중재",
    },
  ];

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div className="modal-form form-inline">
      <Form colon={false} layout="horizontal" form={form}>
        <Row gutter={[16, 0]}>
          <Col md={24}>
            <Form.Item
              style={{ marginBottom: 11 }}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              name="note"
              label={<span style={{ textAlign: "left" }}>상태</span>}
              className="input-group custom-label-margincustom-label-margin"
            >
              <Radio.Group>
                <Radio value="전체" defaultChecked>
                  전체
                </Radio>
                <Radio value="설정">설정</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>

          <Col md={24}>
            <Form.Item
              style={{ marginBottom: 11 }}
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              name="note"
              label={<span style={{ textAlign: "left" }}>변경사유</span>}
              className="custom-label-margin"
            >
              <Input />
            </Form.Item>
          </Col>

          <Col md={24}>
            <Form.Item
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              name="note"
              label={<span style={{ textAlign: "left" }}>파일선택</span>}
              className="custom-label-margin"
            >
              <Space style={{ display: "block" }}>
                <div className="flex">
                  <Input placeholder="fdpd100@naver.com" disabled />
                  <Button
                    size="small"
                    className="ant-btn-info ml-2"
                    onClick={() => console.log("클릭")}
                  >
                    변경
                  </Button>
                </div>
              </Space>
            </Form.Item>
          </Col>
        </Row>

        <Col md={24}>
          <h2 className="text-[20px] font-bold mb-4 pt-4">변경 히스토리</h2>
        </Col>

        <Row>
          <Col md={24}>
            <Table
              bordered
              pagination={false}
              columns={tableColumns}
              dataSource={tableData}
              onChange={onChange}
              pagination={{
                pageSize: 15,
              }}
            />
          </Col>
        </Row>
      </Form>
    </div>
  );
}
