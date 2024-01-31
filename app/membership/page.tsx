"use client";
import React, { useState, useEffect } from "react";

import Sidebar from "../../components/Sidebar";
import MembershipManagementModal from "../../components/MembershipManagementModal";
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
  Select,
  Modal,
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import BlockRegisterModal from "@/components/BlockRegisterModal";
import customFetch from "@/utils/customFetch";
const { Search } = Input;

type TableData = {
  key: any;
  id: string;
  name: string;
  phoneNumber: string;
  sanctionPeriod: string;
  reason: string;
  manager: string;
  clear: number;
};

export default function MembershipManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("clear");
  const [membersAllDataList, setMembersAllDataList] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  // Search functionality states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  // Updating admin data
  const [clickedMemberId, setClickedMemberId] = useState("");

  const [total, setTotal] = useState(0);

  const showModal = (type: any) => {
    setIsModalOpen(true);
    setModalType(type);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const filteredMembers = membersList.filter((admin: AdminType) =>
      admin.loginId.toString().toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(filteredMembers);
    setTotal(filteredMembers.length);
  };

  const fetchMemberLists = async () => {
    setIsFetching(true);
    const accessToken = localStorage.getItem("accessToken");
    const adminsList = await customFetch.get("/api/v1/admins/users/ban", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const membersData = adminsList.data.data;

    const transformedMembersBanList = membersData.map(
      (member: any, index: number) => ({
        key: index + 1 < 9 ? `0${index + 1}` : `${index + 1}`,
        id: member.user.id,
        loginId: member.user.loginId,
        name: member.user.name,
        phoneNumber: member.user.phone,
        sanctionPeriod: member.period,
        reason: member.reason,
        manager: member.authorName,
        clear: 32,
      })
    );

    setMembersList(transformedMembersBanList);
    setMembersAllDataList(membersData);
    setTotal(transformedMembersBanList.length);

    setIsFetching(false);
  };

  const clearMemberFromBan = (record: any) => {
    showModal("clear");
    setClickedMemberId(record.id);
  };

  useEffect(() => {
    try {
      fetchMemberLists();
    } catch (error) {
      console.log("Error when fetching admins list", error);
    }
  }, []);

  const tableColumns: ColumnsType<TableData> = [
    {
      title: "번호",
      dataIndex: "number",
      render(value, record, index) {
        return <span>{(index + 1).toString().padStart(2, "0")}</span>;
      },
    },
    {
      title: "ID",
      dataIndex: "loginId",
    },
    {
      title: "이름",
      dataIndex: "name",
    },
    {
      title: "휴대폰번호",
      dataIndex: "phoneNumber",
    },
    {
      title: "제재기간",
      dataIndex: "sanctionPeriod",
    },
    {
      title: "사유",
      dataIndex: "reason",
    },
    {
      title: "관리자",
      dataIndex: "manager",
    },
    {
      title: "해제",
      dataIndex: "clear",
      render(value, record, index) {
        return (
          <button
            onClick={() => {
              clearMemberFromBan(record);
            }}
            className="rounded-full text-sm leading-[18px] bg-[#A3A6AB] px-[14px] py-[7px] text-white"
          >
            해제하기
          </button>
        );
      },
    },
  ];

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const onChangeDate = (date: any, dateString: any) => {
    console.log(date, dateString);
  };

  return (
    <div className="main-dashboard">
      <Sidebar />
      <main>
        <div className="container flex flex-col min-h-screen pt-[138px]">
          <Row justify="space-between" align="middle" className="mb-[57px]">
            <Col md={16}>
              <Space
                className="filter-section rounded-full bg-white pl-[42px] pr-[20px] py-3.5 h-[61px]"
                size="middle"
              >
                <label htmlFor="#" className="font-black">
                  검색어
                </label>
                <Select
                  defaultValue="ID"
                  style={{ width: 110, fontSize: 14 }}
                  options={[{ value: "ID", label: "ID" }]}
                />
                <Search
                  placeholder="검색어를 입력해주세요"
                  style={{ width: 258 }}
                  className="custom-search-icon"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Space>
            </Col>
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
                onClick={() => showModal("register")}
              >
                등록
              </Button>
            </Col>
          </Row>
          <Row gutter={[54, 40]}>
            <Col span={24}>
              <Card title="" bodyStyle={{ padding: "75px 85px 40px 85px" }}>
                <div className="card-heading">
                  <h2 style={{ fontWeight: 400 }}>
                    <strong style={{ fontWeight: 600 }}>{total}건</strong>의
                    게시물이 검색되었습니다
                  </h2>
                </div>
                {isFetching ? (
                  <div className="flex justify-center items-center h-[100%]">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
                  </div>
                ) : (
                  <Table
                    bordered
                    columns={tableColumns}
                    dataSource={
                      searchQuery !== "" ? searchResults : membersList
                    }
                    onChange={onChange}
                    pagination={{
                      pageSize: 15,
                    }}
                  />
                )}
              </Card>
            </Col>
          </Row>
          <Modal
            className={
              modalType === "clear"
                ? "custom-mini-modal-clear"
                : "custom-mini-modal-searchId"
            }
            title=""
            footer=""
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            closable={false}
            width={753}
            centered
          >
            <div className="px-8">
              <Button
                className="left-icon p-0 border-0 shadow-none text-left text-[30px] leading-none mb-[40px]"
                block
                onClick={handleCancel}
              >
                <img src="/assets/images/backIcon.png" />
              </Button>
              {modalType === "clear" ? (
                <MembershipManagementModal
                  clickedMemberId={clickedMemberId}
                  fetchMemberLists={fetchMemberLists}
                  closeModal={closeModal}
                />
              ) : (
                <BlockRegisterModal
                  fetchMemberLists={fetchMemberLists}
                  closeModal={closeModal}
                />
              )}
            </div>
          </Modal>
        </div>
      </main>
    </div>
  );
}
