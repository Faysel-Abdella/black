"use client";
import React, { useState, useEffect } from "react";
import DefaultLayout from "../DefaultLayout/DefaultLayout";
import PrivacyEditor from "../../components/PrivacyEditor";
import {
  Card,
  Col,
  Row,
  Table,
  Button,
  Radio,
  Space,
  DatePicker,
  Input,
  Flex,
  Modal,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import customFetch from "@/utils/customFetch";

type TableData = {
  key: any;
  title: string;
  admin: string;
  date: string;
};

export default function TermOfUse() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [buttonType, setButtonType] = useState("");

  const [termsList, setTermsList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  // Updating privacy data
  const [clickedTermData, setClickedTermData] = useState([]);

  const fetchTermLists = async () => {
    setIsFetching(true);
    const accessToken = localStorage.getItem("accessToken");
    const termsList = await customFetch.get("/api/v1/admins/post/terms", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const termsData = termsList.data.data;

    const transformedTermsList = termsData.map((term: any, index: number) => ({
      key: index + 1 < 9 ? `0${index + 1}` : `${index + 1}`,
      title: term.title,
      admin: term.authorName,
      date: new Date(term.createdAt).toISOString().split("T")[0],
      // Non-included in tha table fields

      id: term.id,
      content: term.content,
    }));

    setTermsList(transformedTermsList);
    setIsFetching(false);
  };

  useEffect(() => {
    fetchTermLists();
  }, []);

  const handleClickTerm = (data: any) => {
    const thisTermData: any = termsList.filter(
      (privacy: any) => privacy.id.toString() == data.id.toString()
    );

    setClickedTermData(thisTermData);
    setButtonType("modification");
    showModal();
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const columns: ColumnsType<TableData> = [
    {
      title: "번호",
      dataIndex: "key",
    },
    {
      title: "제목",
      dataIndex: "title",
      render: (value, record, index) => (
        <a onClick={() => handleClickTerm(record)}>{value}</a>
      ),
    },
    {
      title: "관리자",
      dataIndex: "admin",
    },
    {
      title: "처리일자",
      dataIndex: "date",
    },
  ];
  const data = [
    {
      key: "1", // YES
      title: "이용약관 (23.08.30)", // YES
      admin: "이중재", // YES
      date: "2023.08.23 14:11:21", // YES
    },
    {
      key: "2",
      title: "이용약관 (23.08.29)",
      admin: "이중재",
      date: "2023.07.23 14:11:21",
    },
    {
      key: "3",
      title: "이용약관 (23.08.27)",
      admin: "이중재",
      date: "2023.06.23 14:11:21",
    },
  ];
  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <DefaultLayout>
      <div style={{ paddingTop: 82 }}>
        <Row justify="end" align="middle" className="mb-[50px]">
          <Col>
            <Button
              style={{
                padding: 0,
                width: 144,
                height: 61,
                fontWeight: 700,
              }}
              type="primary"
              shape="round"
              className="min-w-[120px]"
              onClick={() => {
                setButtonType("register");
                showModal();
              }}
            >
              등록
            </Button>
          </Col>
        </Row>
        <Row gutter={[54, 40]}>
          <Col span={24}>
            <Card title="" className="pt-[53px] pl-[33px]">
              <Col md={18}>
                {isFetching ? (
                  <div className="flex justify-center items-center h-[100%]">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
                  </div>
                ) : (
                  <Table
                    bordered
                    columns={columns}
                    dataSource={termsList}
                    onChange={onChange}
                    pagination={{
                      pageSize: 15,
                    }}
                  />
                )}
              </Col>
            </Card>
          </Col>
        </Row>
      </div>
      <Modal
        title=""
        footer=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        width={860}
      >
        <div className="px-8">
          <Button
            className="left-icon p-0 border-0 shadow-none text-left text-[30px] leading-none mb-[43px]"
            block
            onClick={handleCancel}
          >
            <img src="/assets/images/backIcon.png" />
          </Button>
          <PrivacyEditor
            usedOnPage="term"
            buttonType={buttonType}
            clickedData={clickedTermData}
            handleCancel={handleCancel}
            fetchDataLists={fetchTermLists}
            isFetching={isFetching}
          />
        </div>
      </Modal>
    </DefaultLayout>
  );
}
