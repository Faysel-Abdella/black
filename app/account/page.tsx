"use client";
import React, { useState, useEffect } from "react";
import { ColumnsType } from "antd/es/table";
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

import Sidebar from "../../components/Sidebar";
import AccountModal from "../../components/AccountModal";
import DefaultLayout from "../DefaultLayout/DefaultLayout";
import customFetch from "@/utils/customFetch";

const { Search } = Input;

type TableData = {
  key: any;
  id: string;
  name: string;
  department: string;
  allowIP: string;
  consumerNumber: string;
  lastAccessDate: string;
  registrationManager: string;
};

export default function Account() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [buttonType, setButtonType] = useState("register");
  const [adminsAllDataList, setAdminsAllDataList] = useState([]);
  const [adminsList, setAdminsList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  // Search functionality states

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  // Updating admin data
  const [clickedAdminData, setClickedAdminData] = useState([]);

  const [total, setTotal] = useState(0);

  const fetchAdminLists = async () => {
    setIsFetching(true);
    const accessToken = localStorage.getItem("accessToken");
    try {
      const adminsList = await customFetch.get("/api/v1/admins", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const adminsData = adminsList.data.data;

      console.log(adminsData, "?!@#?");

      const transformedAdminsList = adminsData.map((admin: any, index: any) => {
        // 날짜 유효성 검사
        let lastAccessDateFormatted = "--"; // 기본값 설정
        if (
          admin.lastLoginDate &&
          !isNaN(new Date(admin.lastLoginDate).valueOf())
        ) {
          lastAccessDateFormatted = new Date(admin.lastLoginDate)
            .toISOString()
            .split("T")[0];
        }

        return {
          key: index + 1 < 9 ? `0${index + 1}` : `${index + 1}`,
          name: admin.name,
          id: admin.id,
          loginId: admin.loginId,
          department: admin.department,
          allowIP: admin.allowedIp ? admin.allowedIp : "--",
          consumerNumber: admin.phone,
          lastAccessDate: lastAccessDateFormatted,
          registrationManager: admin.author.name,
          permissions: admin.permissions,
        };
      });

      setAdminsList(transformedAdminsList);
      setAdminsAllDataList(adminsData);
      setTotal(transformedAdminsList.length);
      setIsFetching(false);
    } catch (error) {
      console.log("Error when fetching admins list", error);
    }
  };

  useEffect(() => {
    fetchAdminLists();
  }, []);

  const showModal = () => {
    setButtonType("register");
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleClickAdmin = (data: any) => {
    setSelectedAdmin(data);
    const thisAdminData: any = adminsAllDataList.filter(
      (admin: AdminType) => admin.id.toString() == data.id.toString()
    );

    setClickedAdminData(thisAdminData);

    setButtonType("changeInfo");
    setIsModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const filteredAdmins = adminsList.filter((admin: AdminType) =>
      admin.name.toLowerCase().includes(value.toLowerCase())
    );
    setSearchResults(filteredAdmins);
    setTotal(filteredAdmins.length);
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
      title: "ID",
      dataIndex: "loginId",
      render(value, record, index) {
        return (
          <span
            className="text-[#28A7E1] underline-offset-2 underline cursor-pointer"
            onClick={() => handleClickAdmin(record)}
          >
            {value}
          </span>
        );
      },
    },
    {
      title: "이름",
      dataIndex: "name",
    },
    {
      title: "부서",
      dataIndex: "department",
    },
    {
      title: "허용 IP",
      dataIndex: "allowIP",
    },
    {
      title: "블랙컨슈머 번호",
      dataIndex: "consumerNumber",
    },
    {
      title: "마지막 접속일",
      dataIndex: "lastAccessDate",
    },
    {
      title: "등록 관리자",
      dataIndex: "registrationManager",
    },
  ];

  const tableData: TableData[] = [
    {
      key: 1,
      id: "1",
      name: "이중재",
      consumerNumber: "010-0416-3114",
      lastAccessDate: "2023-01-08",
      allowIP: "192. 168. 10. 1",
      department: "기획팀",
      registrationManager: "이중재",
    },
    {
      key: 2,
      id: "2",
      name: "이중재",
      consumerNumber: "010-0416-3114",
      lastAccessDate: "2023-01-08",
      allowIP: "192. 168. 10. 1",
      department: "기획팀",
      registrationManager: "이중재",
    },
    {
      key: 3,
      id: "3",
      name: "이중재",
      consumerNumber: "010-0416-3114",
      lastAccessDate: "2023-01-08",
      allowIP: "192. 168. 10. 1",
      department: "기획팀",
      registrationManager: "이중재",
    },
    {
      key: 4,
      id: "4",
      name: "이중재",
      consumerNumber: "010-0416-3114",
      lastAccessDate: "2023-01-08",
      allowIP: "192. 168. 10. 1",
      department: "기획팀",
      registrationManager: "이중재",
    },
    {
      key: 5,
      id: "5",
      name: "이중재",
      consumerNumber: "010-0416-3114",
      lastAccessDate: "2023-01-08",
      allowIP: "192. 168. 10. 1",
      department: "기획팀",
      registrationManager: "이중재",
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
      <div
        style={{
          paddingTop: 82,
        }}
      >
        <Row justify="space-between" align="middle" className="mb-[60px]">
          <Col md={16}>
            <Space
              className="filter-section rounded-full bg-white pl-[42px] pr-[20px] py-3.5 h-[61px] "
              size="middle"
            >
              <label htmlFor="#" className="font-black">
                이름
              </label>
              <Search
                placeholder="이름을 입력해주세요"
                style={{ width: 311 }}
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
              onClick={showModal}
              shape="round"
              className="min-w-[120px]"
            >
              등록
            </Button>
          </Col>
        </Row>
        <Row gutter={[54, 40]}>
          <Col span={24}>
            <Card title="" bodyStyle={{ padding: "75px 84px 0 84px" }}>
              <div className="card-heading">
                <h2 style={{ fontWeight: 400 }}>
                  <strong>{total}건</strong>의 게시물이 검색되었습니다
                </h2>
              </div>
              {isFetching ? (
                <div className="flex justify-center items-center h-[100%] py-3">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
                </div>
              ) : (
                <Table
                  bordered
                  columns={tableColumns}
                  dataSource={searchQuery !== "" ? searchResults : adminsList}
                  onChange={onChange}
                  pagination={{
                    pageSize: 15,
                  }}
                />
              )}
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
        width={753}
        className="custom-mini-modal-register"
        centered
      >
        <div className="px-8">
          <Button
            className="left-icon p-0 border-0 shadow-none text-left text-[30px] leading-none mt-[40px] mb-[33px]"
            block
            onClick={handleCancel}
          >
            <img src="/assets/images/backIcon.png" />
          </Button>
          <AccountModal
            buttonType={buttonType}
            onCancel={handleCancel}
            clickedAdminData={clickedAdminData}
            fetchAdminLists={fetchAdminLists}
          />
        </div>
      </Modal>
    </DefaultLayout>
  );
}
