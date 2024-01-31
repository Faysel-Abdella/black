"use client";
import "dayjs/locale/ko";
import React, { useState } from "react";
import DefaultLayout from "../DefaultLayout/DefaultLayout";
import MembershipModal from "../../components/MembershipModal";
import AppealModal from "../../components/AppealModal";
import {
  Card,
  Col,
  Row,
  Table,
  Button,
  Radio,
  Space,
  Input,
  Flex,
  Modal,
  Tag,
  Select,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";

import { Dayjs } from "dayjs";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import generatePicker from "antd/es/date-picker/generatePicker";
import locale from "antd/es/date-picker/locale/ko_KR";

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);
const { Search } = Input;
const { Column, ColumnGroup } = Table;

type TableData = {
  key: any;
  approvalDate: string;
  appellantId: string;
  registrationId: string;
  consumerName: string;
  consumerNumber: string;
  consumerDOB: string;
  resultStatus: string;
};

export default function AppealManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("membership");

  const showModal = (type: any) => {
    setIsModalOpen(true);
    setModalType(type);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const tableColumns: ColumnsType<TableData> = [
    {
      title: "번호",
      dataIndex: "number",
      render(value, record, index) {
        return <span>{(index + 1).toString().padStart(2, "0")}</span>;
      },
    },
    {
      title: "승인요청 일시",
      dataIndex: "approvalDate",
    },
    {
      title: "등록자 ID",
      dataIndex: "appellantId",
    },
    {
      title: "등록자 ID",
      dataIndex: "registrationId",
      render(value, record, index) {
        return (
          <span
            className="cursor-pointer"
            onClick={() => showModal("membership")}
          >
            {value}
          </span>
        );
      },
    },
    {
      title: "블랙컨슈머 이름",
      dataIndex: "consumerName",
    },
    {
      title: "블랙컨슈머 번호",
      dataIndex: "consumerNumber",
    },
    {
      title: "블랙컨슈머 생년월일",
      dataIndex: "consumerDOB",
    },
    {
      title: "상세보기",
      dataIndex: "viewDetails",
      render(value, record, index) {
        return (
          <Space size="middle">
            <Tag className="cursor-pointer" onClick={() => showModal("appeal")}>
              상세보기
            </Tag>
          </Space>
        );
      },
    },
    {
      title: "처리결과 상태",
      dataIndex: "resultStatus",
      sorter: {
        multiple: 1,
      },
    },
  ];

  const data: TableData[] = [
    {
      key: 1,
      approvalDate: "2023-08-05",
      appellantId: "Fdpd100",
      registrationId: "Abc123",
      consumerName: "이중재",
      consumerNumber: "010-4012-1146",
      consumerDOB: "901024",
      resultStatus: "신청",
    },
    {
      key: 2,
      approvalDate: "2023-08-05",
      appellantId: "Fdpd100",
      registrationId: "Abc123",
      consumerName: "이중재",
      consumerNumber: "010-4012-1146",
      consumerDOB: "901024",
      resultStatus: "신청",
    },
    {
      key: 3,
      approvalDate: "2023-08-05",
      appellantId: "Fdpd100",
      registrationId: "Abc123",
      consumerName: "이중재",
      consumerNumber: "010-4012-1146",
      consumerDOB: "901024",
      resultStatus: "신청",
    },
    {
      key: 4,
      approvalDate: "2023-08-05",
      appellantId: "Fdpd100",
      registrationId: "Abc123",
      consumerName: "이중재",
      consumerNumber: "010-4012-1146",
      consumerDOB: "901024",
      resultStatus: "신청",
    },
    {
      key: 5,
      approvalDate: "2023-08-05",
      appellantId: "Fdpd100",
      registrationId: "Abc123",
      consumerName: "이중재",
      consumerNumber: "010-4012-1146",
      consumerDOB: "901024",
      resultStatus: "신청",
    },
  ];

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const onChangeDate = (date: any, dateString: any) => {
    console.log(date, dateString);
  };
  return (
    <DefaultLayout>
      <Row justify="space-between" align="middle" className="mb-[21px]">
        <Col md={10}>
          <Space
            className="filter-section rounded-full bg-white w-[563px] h-[61px] pl-[42px]"
            size="middle"
          >
            <label htmlFor="#" className="font-black">
              이의신청일
            </label>
            <Radio.Group name="radiogroup" defaultValue={1}>
              <Radio value={1}>전체</Radio>
              <Radio value={2}>설정</Radio>
            </Radio.Group>
            <Space className="date-range" size="small">
              <DatePicker
                locale={locale}
                className="h-[41px] border-none"
                onChange={onChangeDate}
              />
              <p className="m-0">~</p>
              <DatePicker
                locale={locale}
                className="h-[41px] border-none"
                onChange={onChangeDate}
              />
            </Space>
          </Space>
        </Col>
      </Row>
      <Row justify="space-between" align="middle" className="mb-[60px]">
        <Col md={16}>
          <div className="flex items-center gap-[11px]">
            <Space
              className="filter-section rounded-full bg-white pl-[42px] py-0 w-[360px] h-[61px]"
              size="middle"
            >
              <label htmlFor="#" className="font-black mr-[20px]">
                상태
              </label>
              <Radio.Group name="radiogroup" defaultValue={1}>
                <Radio value={1}>전체</Radio>
                <Radio value={2}>설정</Radio>
                <Radio value={3}>미노출</Radio>
              </Radio.Group>
            </Space>
            <button className=" rounded-full bg-[#4A4E57] text-white h-[61px] w-[61px] aspect-square flex justify-center items-center">
              <img
                src="assets/images/white_search_icon.png"
                alt="search_icon"
              />
            </button>
          </div>
        </Col>
      </Row>
      <Row gutter={[54, 40]}>
        <Col span={24}>
          <Card title="" bodyStyle={{ padding: "75px 85px 0 85px" }}>
            <div className="card-heading">
              <h2 style={{ fontWeight: 400 }}>
                전체 : <strong>NNNNN</strong>건 ㅣ 신청 : <strong>NNNN</strong>{" "}
                개 ㅣ 처리중 : <strong>NNNNN</strong>개 ㅣ 처리완료 :{" "}
                <strong>NNNNNN</strong> 개
              </h2>
            </div>
            <Table
              bordered
              dataSource={data}
              onChange={onChange}
              columns={tableColumns}
              pagination={{
                pageSize: 15,
              }}
            />
          </Card>
        </Col>
      </Row>
      <Modal
        title=""
        footer=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        className={
          modalType === "membership"
            ? "custom-modal"
            : "custom-mini-modal-appeal"
        }
        width={modalType === "membership" ? 866 : 753}
        centered
      >
        <div className="px-8">
          <Button
            className="left-icon p-0 border-0 shadow-none text-left text-[30px] leading-none mb-[33px]"
            block
            onClick={handleCancel}
          >
            <img src="/assets/images/backIcon.png" />
          </Button>
          {modalType === "membership" ? (
            <MembershipModal />
          ) : (
            <AppealModal onCancel={handleCancel} />
          )}
        </div>
      </Modal>
    </DefaultLayout>
  );
}
