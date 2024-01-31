"use client";
import "dayjs/locale/ko";
import React, { useState, useEffect } from "react";
import { LeftOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

import {
  Card,
  Col,
  Row,
  Table,
  Button,
  Radio,
  Space,
  Input,
  Select,
  Modal,
  Tooltip,
} from "antd";

import ExcelModal from "@/components/ExcelModal";
import DefaultLayout from "../DefaultLayout/DefaultLayout";
import MembershipModal from "../../components/MembershipModal";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";

import { Dayjs } from "dayjs";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import generatePicker from "antd/es/date-picker/generatePicker";
import locale from "antd/es/date-picker/locale/ko_KR";
import { constrainedMemory } from "process";

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

const { Search } = Input;

type TableData = {
  key: any;
  id: string;
  name: string;
  phoneNumber: string;
  joinDate: string;
  accountStatus: string;
  subscriptionType: string;
  views: number;
  numOfRegistrations: number;
};

export default function Membership() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("user");
  const [membersAllDataList, setMembersAllDataList] = useState([]);
  const [membersList, setMembersList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  // Search functionality states
  const [searchFrom, setSearchFrom] = useState("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDataFilter, setEndDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [latestFiltersResult, setLatestFiltersResult] = useState([]);

  const [showNotFound, setShowNotFound] = useState(false);

  const [isDateFilteringAllowed, setIsDateFilteringAllowed] = useState(false);

  // Updating admin data
  const [clickedMemberData, setClickedMemberData] = useState([]);

  const [total, setTotal] = useState(0);

  const fetchMembersLists = async () => {
    setIsFetching(true);
    const accessToken = localStorage.getItem("accessToken");
    const membersList = await customFetch.get("/api/v1/admins/users", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const membersData = membersList.data.data;

    const transformedMembersList = membersData.map(
      (member: any, index: number) => ({
        key: index + 1 < 9 ? `0${index + 1}` : `${index + 1}`,
        id: member.loginId,
        name: member.name,
        banReason: member.banReason,
        phoneNumber: member.phone,
        joinDate: new Date(member.createdAt).toISOString().split("T")[0],
        accountStatus: member.isActive.toString(),
        subscriptionType: "아이디",
        views: member.blacksViewCount,
        numOfRegistrations: membersData.length,
        // non-include in table fields
        email: member.email,
        loginId: member.loginId,
        gosiwonName: member.gosiwonName,
        gosiwonAddress: member.gosiwonAddress,
        releaseReason: member.releaseReason ? member.releaseReason : "---",
        lastLoginDate: member.lastLoginDate
          ? new Date(member.lastLoginDate).toISOString().split("T")[0]
          : "---",
        blacks: member.blacks ? member.blacks : "---",
      })
    );

    console.log(transformedMembersList);

    setMembersList(transformedMembersList);
    setTotal(transformedMembersList.length);
    setMembersAllDataList(membersData);
    setIsFetching(false);
  };

  useEffect(() => {
    try {
      fetchMembersLists();
    } catch (error) {
      console.log("Error when fetching admins list", error);
    }
  }, []);

  const handleClickMember = (data: any) => {
    const thisMemberData: any = membersList.filter(
      (member: any) => member.id.toString() == data.id.toString()
    );

    setClickedMemberData(thisMemberData);
    showModal("user");
  };

  const onChangeDateSearch = (date: any) => {
    console.log(date);
  };

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

  const closeParentModal = () => {
    setIsModalOpen(false);
  };

  // ############ Filtering operations ###########

  const onChangeStartDate = (date: any, dateString: any) => {
    setStartDateFilter(dateString);
    setShowNotFound(false);

    let filterResult: any = [];
    if (dateString) {
      const standardStartDate = new Date(dateString);
      if (!endDataFilter) {
        console.log(statusFilter);
        // If the end date is not specified filter all dates greater than or equal start date

        filterResult = membersList.filter(
          (list: any) => new Date(list.joinDate) >= standardStartDate
        );

        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }

        if (statusFilter != "" && statusFilter != "all") {
          filterResult = filterResult.filter(
            (list: any) => list.accountStatus == statusFilter
          );
        }

        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }

        if (searchQuery) {
          filterResult = filterResult.filter((member: any) =>
            member[searchFrom]
              .toString()
              .toLowerCase()
              .includes(searchQuery.toString().toLowerCase())
          );
        }

        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }

        setLatestFiltersResult(filterResult);
      } else {
        // If the end date is  specified filter all dates greater than or equal start date and less than or equal to end date

        filterResult = membersList.filter(
          (list: any) =>
            new Date(list.joinDate) >= standardStartDate &&
            new Date(list.joinDate) <= new Date(endDataFilter)
        );

        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }

        if (statusFilter != "" && statusFilter != "all") {
          filterResult = filterResult.filter(
            (list: any) => list.accountStatus == statusFilter
          );
        }

        if (searchQuery) {
          filterResult = filterResult.filter((member: any) =>
            member[searchFrom]
              .toString()
              .toLowerCase()
              .includes(searchQuery.toString().toLowerCase())
          );
        }

        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }

        setLatestFiltersResult(filterResult);
      }
    } else {
      let filterResult: any = [];
      if (statusFilter != "" && statusFilter != "all") {
        filterResult = membersList.filter(
          (list: any) => list.accountStatus == statusFilter
        );
        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }
        if (searchQuery) {
          filterResult = filterResult.filter((member: any) =>
            member[searchFrom]
              .toString()
              .toLowerCase()
              .includes(searchQuery.toString().toLowerCase())
          );
          if (filterResult.length == 0) {
            return setShowNotFound(true);
          }
        }
      } else {
        if (searchQuery) {
          filterResult = filterResult.filter((member: any) =>
            member[searchFrom]
              .toString()
              .toLowerCase()
              .includes(searchQuery.toString().toLowerCase())
          );
          if (filterResult.length == 0) {
            return setShowNotFound(true);
          }
        }
      }

      setLatestFiltersResult(filterResult);
    }
  };

  const onChangeEndDate = (date: any, dateString: any) => {
    setEndDateFilter(dateString);
    setShowNotFound(false);

    if (dateString) {
      const standardEndDate = new Date(dateString);
      let filterResult: any = [];

      if (startDateFilter) {
        const standardStartDate = new Date(startDateFilter);
        filterResult = membersList.filter(
          (list: any) =>
            new Date(list.joinDate) >= standardStartDate &&
            new Date(list.joinDate) <= standardEndDate
        );

        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }

        if (statusFilter != "" && statusFilter != "all") {
          filterResult = filterResult.filter(
            (list: any) => list.accountStatus == statusFilter
          );
        }

        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }

        if (searchQuery) {
          filterResult = filterResult.filter((member: any) =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }

        setLatestFiltersResult(filterResult);
      }
    } else {
      let filterResult: any = [];
      if (startDateFilter) {
        filterResult = membersList.filter(
          (list: any) => new Date(list.joinDate) >= new Date(startDateFilter)
        );

        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }
        if (statusFilter != "" && statusFilter != "all") {
          filterResult = filterResult.filter(
            (list: any) => list.accountStatus == statusFilter
          );
        }

        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }
        if (searchQuery) {
          filterResult = filterResult.filter((member: any) =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }
      }
      if (statusFilter != "" && statusFilter != "all") {
        filterResult = membersList.filter(
          (list: any) => list.accountStatus == statusFilter
        );
        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }
        if (searchQuery) {
          filterResult = filterResult.filter((member: any) =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }
      }
      setLatestFiltersResult(filterResult);
    }
  };

  const handleAllowDateFiltering = (event: any) => {
    const selectedValue = event.target.value;
    if (selectedValue === "all") {
      setIsDateFilteringAllowed(false);
    } else {
      setIsDateFilteringAllowed(true);
    }
  };

  const handleStatusFiltering = (event: any) => {
    const selectedValue = event.target.value;
    setStatusFilter(selectedValue);
    setShowNotFound(false);

    console.log(searchQuery);

    const filterFrom = membersList;

    // let filterResult: any = [];
    let filterResult: any = [];

    if (selectedValue !== "all") {
      filterResult = filterFrom.filter(
        (list: any) => list.accountStatus == selectedValue
      );
      if (startDateFilter && endDataFilter) {
        filterResult = filterResult.filter(
          (list: any) =>
            new Date(list.joinDate) >= new Date(startDateFilter) &&
            new Date(list.joinDate) <= new Date(endDataFilter)
        );
      } else if (startDateFilter) {
        filterResult = filterResult.filter(
          (list: any) => new Date(list.joinDate) >= new Date(startDateFilter)
        );
      }
      if (searchQuery) {
        filterResult = filterResult.filter((member: any) =>
          member.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (filterResult.length == 0) {
        return setShowNotFound(true);
      }
      setLatestFiltersResult(filterResult);
    } else {
      if (startDateFilter && endDataFilter) {
        filterResult = membersList.filter(
          (list: any) =>
            new Date(list.joinDate) >= new Date(startDateFilter) &&
            new Date(list.joinDate) <= new Date(endDataFilter)
        );
        if (filterResult.length == 0 && !searchQuery) {
          return setShowNotFound(true);
        }
        if (searchQuery) {
          filterResult = filterResult.filter((member: any) =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (filterResult.length == 0 && searchQuery) {
          return setShowNotFound(true);
        }
      } else if (startDateFilter) {
        filterResult = membersList.filter(
          (list: any) => new Date(list.joinDate) >= new Date(startDateFilter)
        );
        if (filterResult.length == 0 && searchQuery) {
          return setShowNotFound(true);
        }
        if (searchQuery) {
          filterResult = filterResult.filter((member: any) =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (filterResult.length == 0 && searchQuery) {
          return setShowNotFound(true);
        }
        console.log(filterResult);
      } else {
        if (searchQuery) {
          filterResult = membersList.filter((member: any) =>
            member.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (filterResult.length == 0 && searchQuery) {
            return setShowNotFound(true);
          }
        }
      }

      setLatestFiltersResult(filterResult);
    }
  };

  const changeSearchFrom = (value: any) => {
    setSearchFrom(value);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setShowNotFound(false);

    let filterResult: any = [];

    filterResult = membersList.filter((member: any) =>
      member[searchFrom]
        .toString()
        .toLowerCase()
        .includes(value.toString().toLowerCase())
    );

    console.log(filterResult);

    if (filterResult.length == 0) {
      return setShowNotFound(true);
    }

    if (statusFilter != "" && statusFilter != "all") {
      filterResult = filterResult.filter(
        (list: any) => list.accountStatus == statusFilter
      );
    }

    if (filterResult.length == 0) {
      return setShowNotFound(true);
    }

    if (startDateFilter && endDataFilter) {
      filterResult = filterResult.filter(
        (list: any) =>
          new Date(list.joinDate) >= new Date(startDateFilter) &&
          new Date(list.joinDate) <= new Date(endDataFilter)
      );
    } else if (startDateFilter) {
      filterResult = filterResult.filter(
        (list: any) => new Date(list.joinDate) >= new Date(startDateFilter)
      );
    }

    if (filterResult.length == 0) {
      return setShowNotFound(true);
    }

    setLatestFiltersResult(filterResult);
  };

  const handleApproval = async (memberId: any, isApproved: any) => {
    try {
      let response;
      const accessToken = localStorage.getItem("accessToken");
      // 승인 또는 반려 처리를 위한 API 요청을 여기에 작성합니다.
      // 예: isApproved가 true이면 승인, false이면 반려를 처리합니다.
      // 승인 처리
      if (isApproved) {
        response = await customFetch.patch(
          `/api/v1/admins/users/approve/${memberId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      } else {
        // 반려 처리
        response = await customFetch.delete(
          `/api/v1/admins/users/reject/${memberId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
      }

      // 요청 성공 후의 로직. 예를 들어, 상태 업데이트 또는 사용자에게 알림 표시 등
      if (response.status === 200) {
        toast.success("처리가 완료되었습니다", { autoClose: 2000 });
        fetchMembersLists(); // 상태 업데이트 및 UI 새로 고침
      }
    } catch (error) {
      toast.error("잠시 후 다시 시도해주세요", { autoClose: 2000 });
      // 오류 처리 로직. 예를 들어, 사용자에게 오류 메시지를 표시합니다.
    }
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
            onClick={() => handleClickMember(record)}
            className="text-[#28A7E1] underline-offset-2 underline cursor-pointer"
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
      title: "휴대폰번호",
      dataIndex: "phoneNumber",
    },
    {
      title: "가입일",
      dataIndex: "joinDate",
    },
    {
      title: "계정상태",
      dataIndex: "accountStatus",
      render(value, record, index) {
        return value === "true" ? "정상" : "정지";
      },
    },
    {
      title: "가입유형",
      dataIndex: "subscriptionType",
    },
    {
      title: "조회수",
      dataIndex: "views",
      render(value, record, index) {
        return <span>{record.views.toString().padStart(2, "0")}</span>;
      },
    },
    {
      title: "등록수",
      dataIndex: "numOfRegistrations",
      render(value, record, index) {
        return (
          <span>{record.numOfRegistrations.toString().padStart(2, "0")}</span>
        );
      },
    },
    {
      title: "고시원명",
      dataIndex: "gosiwonName",
      key: "gosiwonName",
      ellipsis: {
        showTitle: false,
      },
      render: (name) => (
        <Tooltip placement="topLeft" title={name}>
          {name}
        </Tooltip>
      ),
    },
    {
      title: "고시원주소",
      dataIndex: "gosiwonAddress",
      key: "gosiwonAddress",
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: "승인",
      dataIndex: "approval",
      render: (text, record) => (
        <Space>
          <Button
            // icon={<CheckCircleOutlined />}
            style={{
              backgroundColor: "green",
              borderColor: "green",
              color: "white",
              padding: 0,
              width: 30,
              height: 30,
            }}
            onClick={() => handleApproval(record.id, true)}
          >
            O
          </Button>
          <Button
            // icon={<CloseCircleOutlined />}
            style={{
              backgroundColor: "red",
              borderColor: "red",
              color: "white",
              padding: 0,
              width: 30,
              height: 30,
            }}
            onClick={() => handleApproval(record.id, false)}
          >
            X
          </Button>
        </Space>
      ),
    },
  ];

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const search = (date: any, dateString: any) => {
    console.log(date, dateString);
  };

  return (
    <DefaultLayout>
      <Row justify="space-between" align="middle" className="mb-[21px]">
        <Col md={10}>
          <Space
            className="filter-section rounded-full bg-white  w-[541px] h-[61px] pl-[42px]"
            size="middle"
          >
            <label htmlFor="#" className="font-black">
              가입일자
            </label>
            <Radio.Group
              name="radiogroup"
              onChange={handleAllowDateFiltering}
              defaultValue="all"
            >
              <Radio value="all">전체</Radio>
              <Radio value="custom">설정</Radio>
            </Radio.Group>
            <Space className="date-range" size="small">
              <DatePicker
                locale={locale}
                className="h-[41px] border-none"
                onChange={onChangeStartDate}
                disabled={!isDateFilteringAllowed}
              />
              <p className="m-0">~</p>
              <DatePicker
                locale={locale}
                className="h-[41px] border-none"
                onChange={onChangeEndDate}
                disabled={!isDateFilteringAllowed}
              />
            </Space>
          </Space>
        </Col>
        <Col>
          <Button
            type="primary"
            shape="round"
            className="text-[14px] w-[144px] h-[61px] font-bold"
            onClick={() => showModal("excel")}
          >
            Excel 다운로드
          </Button>
        </Col>
      </Row>
      <Row justify="space-between" align="middle" className="mb-[57px]">
        <Col md={16}>
          <Space size="middle">
            <Space
              className="filter-section rounded-full bg-white pl-[42px] py-0 w-[354px] h-[61px]"
              size="middle"
            >
              <label htmlFor="#" className="font-black">
                계정 상태
              </label>
              <Radio.Group
                name="radiogroup"
                defaultValue="all"
                onChange={handleStatusFiltering}
              >
                <Radio value="all">전체</Radio>
                {/* <Radio value={2}>설정</Radio> */}
                <Radio value="true">정상</Radio>
                <Radio value="false">정지</Radio>
              </Radio.Group>
            </Space>
            <Space
              className="filter-section rounded-full bg-white pl-[42px] pr-[20px] py-3.5 h-[61px]"
              size="middle"
            >
              <label htmlFor="#" className="font-black whitespace-nowrap">
                검색어
              </label>
              <Select
                defaultValue="loginId"
                style={{ width: 110, fontSize: 14 }}
                options={[
                  // { value: "name", label: "ALL" },
                  { value: "loginId", label: "ID" },
                  { value: "name", label: "Name" }, // 추가된 항목
                  { value: "phoneNumber", label: "Phone" }, // 추가된 항목
                ]}
                onChange={changeSearchFrom}
              />
              <Search
                placeholder="검색어를 입력해주세요"
                style={{ width: 258 }}
                className="custom-search-icon"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </Space>
          </Space>
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
            ) : showNotFound ? (
              <div className="flex justify-center items-center">
                <h2 className="text-center font-semibold text-[26px] ">
                  Not Found
                </h2>
              </div>
            ) : (
              <Table
                bordered
                columns={tableColumns}
                dataSource={
                  latestFiltersResult.length > 0
                    ? latestFiltersResult
                    : membersList
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
        className={modalType === "user" ? "custom-modals" : ""}
        title=""
        footer=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        width={modalType === "user" ? 865 : 740}
        centered
      >
        <div className={modalType === "user" ? "" : "px-8 pt-[56px] mb-[73px]"}>
          <Button
            className="left-icon p-0 border-0 shadow-none text-left text-[30px] leading-none mb-[53px]"
            onClick={handleCancel}
          >
            <img src="/assets/images/backIcon.png" />
          </Button>
          {modalType === "user" ? (
            <MembershipModal
              clickedMemberData={clickedMemberData}
              fetchMembersLists={fetchMembersLists}
              closeParentModal={closeParentModal}
            />
          ) : (
            <ExcelModal />
          )}
        </div>
      </Modal>
    </DefaultLayout>
  );
}
