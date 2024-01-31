"use client";
import React, { useEffect, useState } from "react";
import DefaultLayout from "../DefaultLayout/DefaultLayout";
import PrivacyEditor from "../../components/PrivacyEditor";
import { Card, Col, Row, Table, Button, Modal } from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import Sidebar from "../../components/Sidebar";
import customFetch from "@/utils/customFetch";

type TableData = {
  key: any;
  title: string;
  admin: string;
  date: string;
};

export default function PrivacyPolicy() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buttonType, setButtonType] = useState("");

  const [privaciesList, setPrivaciesList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  // Updating privacy data
  const [clickedPrivacyData, setClickedPrivacyData] = useState([]);

  const fetchPrivacyLists = async () => {
    setIsFetching(true);
    const accessToken = localStorage.getItem("accessToken");
    const privaciesList = await customFetch.get(
      "/api/v1/admins/post/privacy-policies",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const privaciesData = privaciesList.data.data;

    const transformedPrivaciesList = privaciesData.map(
      (privacy: any, index: number) => ({
        key: index + 1 < 9 ? `0${index + 1}` : `${index + 1}`,
        title: privacy.title,
        admin: privacy.authorName,
        date: new Date(privacy.createdAt).toISOString().split("T")[0],
        // Non-included in tha table fields

        id: privacy.id,
        content: privacy.content,
      })
    );

    setPrivaciesList(transformedPrivaciesList);
    setIsFetching(false);
  };

  useEffect(() => {
    fetchPrivacyLists();
  }, []);

  const handleClickPrivacy = (data: any) => {
    const thisPrivacyData: any = privaciesList.filter(
      (privacy: any) => privacy.id.toString() == data.id.toString()
    );

    setClickedPrivacyData(thisPrivacyData);
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
      render(value, record, index) {
        return <span>{(index + 1).toString().padStart(2, "0")}</span>;
      },
    },
    {
      title: "제목",
      dataIndex: "title",
      render: (value, record, index) => (
        <a onClick={() => handleClickPrivacy(record)}>{value}</a>
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
                    dataSource={privaciesList}
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
        centered
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
            usedOnPage="privacyPolicy"
            buttonType={buttonType}
            clickedData={clickedPrivacyData}
            handleCancel={handleCancel}
            fetchDataLists={fetchPrivacyLists}
            isFetching={isFetching}
          />
        </div>
      </Modal>
    </DefaultLayout>
  );
}
