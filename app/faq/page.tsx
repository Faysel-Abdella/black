"use client";
import "dayjs/locale/ko";
import React, { useEffect, useState } from "react";
import DefaultLayout from "../DefaultLayout/DefaultLayout";
import AddFaqModal from "../../components/AddFaqModal";
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
} from "antd";
import { LeftOutlined } from "@ant-design/icons";
import customFetch from "@/utils/customFetch";

import { Dayjs } from "dayjs";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import generatePicker from "antd/es/date-picker/generatePicker";
import locale from "antd/es/date-picker/locale/ko_KR";

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

const { Search } = Input;

export default function Faq() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [buttonType, setButtonType] = useState("");

  const [faqsAllDataList, setFaqsAllDataList] = useState([]);
  const [faqsList, setFaqsList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  // Search functionality states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  // Updating faq data
  const [clickedFaqData, setClickedFaqData] = useState([]);

  const [total, setTotal] = useState(0);

  // Filtering states

  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDataFilter, setEndDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [latestFiltersResult, setLatestFiltersResult] = useState([]);

  const [showNotFound, setShowNotFound] = useState(false);

  const [isDateFilteringAllowed, setIsDateFilteringAllowed] = useState(false);

  const fetchFaqLists = async () => {
    setIsFetching(true);
    const accessToken = localStorage.getItem("accessToken");
    const faqsList = await customFetch.get("/api/v1/admins/post/faqs", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const faqsData = faqsList.data.data;

    const transformedFaqsList = faqsData.map((faq: any, index: number) => ({
      key: index + 1 < 9 ? `0${index + 1}` : `${index + 1}`,
      faqTitle: faq.title,
      title: faq.content,
      clickNum: faq.clickCount,
      registerDate: new Date(faq.createdAt).toISOString().split("T")[0],
      admin: faq.authorName,
      // Non-included in tha table fields

      id: faq.id,
      status: faq.status,
    }));

    setFaqsList(transformedFaqsList);
    setTotal(transformedFaqsList.length);
    setFaqsAllDataList(faqsData);
    setIsFetching(false);
  };

  useEffect(() => {
    try {
      fetchFaqLists();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleClickFaq = (data: any) => {
    const thisFaqData: any = faqsAllDataList.filter(
      (faq: any) => faq.id.toString() == data.id.toString()
    );

    setClickedFaqData(thisFaqData);
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

        filterResult = faqsList.filter(
          (list: any) => new Date(list.registerDate) >= standardStartDate
        );

        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }

        if (statusFilter != "" && statusFilter != "all") {
          filterResult = filterResult.filter(
            (list: any) => list.status == statusFilter
          );
        }

        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }

        if (searchQuery) {
          filterResult = filterResult.filter((member: any) =>
            member.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }

        setLatestFiltersResult(filterResult);
      } else {
        // If the end date is  specified filter all dates greater than or equal start date and less than or equal to end date

        filterResult = faqsList.filter(
          (list: any) =>
            new Date(list.registerDate) >= standardStartDate &&
            new Date(list.registerDate) <= new Date(endDataFilter)
        );

        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }

        if (statusFilter != "" && statusFilter != "all") {
          filterResult = filterResult.filter(
            (list: any) => list.status == statusFilter
          );
        }

        if (searchQuery) {
          filterResult = filterResult.filter((member: any) =>
            member.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        filterResult = faqsList.filter(
          (list: any) => list.status == statusFilter
        );
        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }
        if (searchQuery) {
          filterResult = filterResult.filter((member: any) =>
            member.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (filterResult.length == 0) {
            return setShowNotFound(true);
          }
        }
      } else {
        if (searchQuery) {
          filterResult = faqsList.filter((member: any) =>
            member.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        filterResult = faqsList.filter(
          (list: any) =>
            new Date(list.registerDate) >= standardStartDate &&
            new Date(list.registerDate) <= standardEndDate
        );

        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }

        if (statusFilter != "" && statusFilter != "all") {
          filterResult = filterResult.filter(
            (list: any) => list.status == statusFilter
          );
        }

        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }

        if (searchQuery) {
          filterResult = filterResult.filter((member: any) =>
            member.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        filterResult = faqsList.filter(
          (list: any) =>
            new Date(list.registerDate) >= new Date(startDateFilter)
        );

        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }
        if (statusFilter != "" && statusFilter != "all") {
          filterResult = filterResult.filter(
            (list: any) => list.status == statusFilter
          );
        }

        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }
        if (searchQuery) {
          filterResult = filterResult.filter((member: any) =>
            member.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }
      }
      if (statusFilter != "" && statusFilter != "all") {
        filterResult = faqsList.filter(
          (list: any) => list.status == statusFilter
        );
        if (filterResult.length == 0) {
          return setShowNotFound(true);
        }
        if (searchQuery) {
          filterResult = filterResult.filter((member: any) =>
            member.title.toLowerCase().includes(searchQuery.toLowerCase())
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

    const filterFrom = faqsList;

    // let filterResult: any = [];
    let filterResult: any = [];

    if (selectedValue !== "all") {
      console.log(selectedValue);

      filterResult = filterFrom.filter(
        (list: any) => list.status == selectedValue
      );
      console.log(filterResult);
      if (startDateFilter && endDataFilter) {
        filterResult = filterResult.filter(
          (list: any) =>
            new Date(list.registerDate) >= new Date(startDateFilter) &&
            new Date(list.registerDate) <= new Date(endDataFilter)
        );
      } else if (startDateFilter) {
        filterResult = filterResult.filter(
          (list: any) =>
            new Date(list.registerDate) >= new Date(startDateFilter)
        );
      }
      if (searchQuery) {
        filterResult = filterResult.filter((member: any) =>
          member.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      if (filterResult.length == 0) {
        return setShowNotFound(true);
      }
      setLatestFiltersResult(filterResult);
    } else {
      if (startDateFilter && endDataFilter) {
        filterResult = faqsList.filter(
          (list: any) =>
            new Date(list.registerDate) >= new Date(startDateFilter) &&
            new Date(list.registerDate) <= new Date(endDataFilter)
        );
        if (filterResult.length == 0 && !searchQuery) {
          return setShowNotFound(true);
        }
        if (searchQuery) {
          filterResult = filterResult.filter((member: any) =>
            member.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (filterResult.length == 0 && searchQuery) {
          return setShowNotFound(true);
        }
      } else if (startDateFilter) {
        console.log(startDateFilter);
        console.log(searchQuery);
        filterResult = faqsList.filter(
          (list: any) =>
            new Date(list.registerDate) >= new Date(startDateFilter)
        );
        if (filterResult.length == 0 && searchQuery) {
          return setShowNotFound(true);
        }
        if (searchQuery) {
          filterResult = filterResult.filter((member: any) =>
            member.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }
        if (filterResult.length == 0 && searchQuery) {
          return setShowNotFound(true);
        }
        console.log(filterResult);
      } else {
        if (searchQuery) {
          filterResult = faqsList.filter((member: any) =>
            member.title.toLowerCase().includes(searchQuery.toLowerCase())
          );
          if (filterResult.length == 0 && searchQuery) {
            return setShowNotFound(true);
          }
        }
      }

      setLatestFiltersResult(filterResult);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setShowNotFound(false);

    let filterResult: any = [];

    filterResult = faqsList.filter((member: any) =>
      member.title.toLowerCase().includes(value.toLowerCase())
    );

    if (filterResult.length == 0) {
      return setShowNotFound(true);
    }

    if (statusFilter != "" && statusFilter != "all") {
      filterResult = filterResult.filter(
        (list: any) => list.status == statusFilter
      );
    }

    if (filterResult.length == 0) {
      return setShowNotFound(true);
    }

    if (startDateFilter && endDataFilter) {
      filterResult = filterResult.filter(
        (list: any) =>
          new Date(list.registerDate) >= new Date(startDateFilter) &&
          new Date(list.registerDate) <= new Date(endDataFilter)
      );
    } else if (startDateFilter) {
      filterResult = filterResult.filter(
        (list: any) => new Date(list.registerDate) >= new Date(startDateFilter)
      );
    }

    if (filterResult.length == 0) {
      return setShowNotFound(true);
    }

    setLatestFiltersResult(filterResult);
  };

  const columns = [
    {
      title: "번호",
      dataIndex: "key",
    },
    {
      title: "FAQ 타이틀",
      dataIndex: "faqTitle",
      render: (value: any, record: any, index: number) => (
        <a onClick={() => handleClickFaq(record)}>{value}</a>
      ),
    },
    {
      title: "제목",
      dataIndex: "title",
    },
    {
      title: "클릭수",
      dataIndex: "clickNum",
    },
    {
      title: "등록일",
      dataIndex: "registerDate",
    },
    {
      title: "관리자",
      dataIndex: "admin",
    },
  ];
  const data = [
    {
      key: "1", // YES
      faqTitle: "조회 문의", // YES
      title: "사용", //content
      clickNum: 5, // YES (clickCount)
      registerDate: "2023.08.23", // YES (createdAt)
      admin: "이중재", // YES (authorName)
    },
    {
      key: "2",
      faqTitle: "옵션 문의",
      title: "미사용",
      clickNum: 2,
      registerDate: "2023.08.25",
      admin: "이중재",
    },
    {
      key: "3",
      faqTitle: "내용 문의",
      title: "?!",
      clickNum: 3,
      registerDate: "2023.08.27",
      admin: "이중재",
    },
    {
      key: "4",
      faqTitle: "시간 문의",
      title: "?!",
      clickNum: 5,
      registerDate: "2023.09.01",
      admin: "이중재",
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
            className="filter-section rounded-full bg-white pl-[42px] w-[541px] h-[61px]"
            size="middle"
          >
            <label htmlFor="#" className="font-black mr-[19px]">
              등록일
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
      </Row>
      <Row justify="space-between" align="middle" className="mb-[60px]">
        <Col md={16}>
          <Space size="middle">
            <Space
              className="filter-section rounded-full bg-white pl-[42px] py-0 w-[360px] h-[61px]"
              size="middle"
            >
              <label htmlFor="#" className="font-black mr-[30px]">
                상태
              </label>

              <Radio.Group
                name="radiogroup"
                defaultValue="all"
                onChange={handleStatusFiltering}
              >
                <Radio value="all">전체</Radio>
                {/* <Radio value={2}>설정</Radio> */}
                <Radio value="USED">사용</Radio>
                <Radio value="UNUSED">미사용</Radio>
              </Radio.Group>
            </Space>
            <Space
              className="filter-section rounded-full bg-white pl-[42px] pr-[20px] py-3.5"
              size="middle"
            >
              <label htmlFor="#" className="font-black">
                검색어
              </label>
              <Search
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="검색어를 입력해주세요"
                style={{ width: 398 }}
                className="custom-search-icon"
              />
            </Space>
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
          <Card title="" bodyStyle={{ padding: "75px 84px 40px" }}>
            <div className="card-heading">
              <h2 style={{ fontWeight: 400 }} className="font-normal">
                <strong className="font-semibold">{total}건</strong>의 게시물이
                검색되었습니다
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
                columns={columns}
                dataSource={
                  latestFiltersResult.length > 0
                    ? latestFiltersResult
                    : faqsList
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
        title=""
        footer=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        width={753}
        centered
      >
        <div className="px-[52px] pt-[37px]">
          <Button
            className="left-icon p-0 border-0 shadow-none text-left text-[30px] leading-none mb-[43px]"
            onClick={handleCancel}
          >
            <img src="/assets/images/backIcon.png" />
          </Button>
          <AddFaqModal
            onCancel={handleCancel}
            buttonType={buttonType}
            clickedFaqData={clickedFaqData}
            fetchFaqLists={fetchFaqLists}
          />
        </div>
      </Modal>
    </DefaultLayout>
  );
}
