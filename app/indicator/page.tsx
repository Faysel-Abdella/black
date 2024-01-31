"use client";
import "dayjs/locale/ko";
import DefaultLayout from "../DefaultLayout/DefaultLayout";
import { Card, Col, Row, Table, Button, Radio, Space, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { tablesData } from "./constants";
import { useEffect, useState } from "react";
import ExcelModal from "@/components/ExcelModal";
import customFetch from "@/utils/customFetch";

import { Dayjs } from "dayjs";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import generatePicker from "antd/es/date-picker/generatePicker";
import locale from "antd/es/date-picker/locale/ko_KR";

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

export default function Indicator() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("excel");

  const [registersAllDataList, setRegistersAllDataList] = useState([]);
  const [registersList, setRegistersList] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  //
  const [blacksAllDataList, setBlacksAllDataList] = useState([]);
  const [IndicatorList, setIndicatorList] = useState([]);
  // Search functionality states
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDataFilter, setEndDateFilter] = useState("");
  const [dateFilterRegisterResults, setDateFilterRegisterResults] = useState(
    []
  );
  const [dateFilterIndicatorResults, setDateFilterIndicatorResults] = useState(
    []
  );

  const fetchRegisterLists = async () => {
    setIsFetching(true);

    const accessToken = localStorage.getItem("accessToken");
    const registersList = await customFetch.get(
      "/api/v1/admins/indicator/register",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const registersData = registersList.data;

    const transformedRegistersList = registersData.data.map(
      (register: any, index: number) => {
        return {
          key: index + 1 < 9 ? `0${index + 1}` : `${index + 1}`,
          date: register.date
            ? new Date(register.date).toISOString().split("T")[0]
            : "--",
          joinMembership: register.registerCount,
          listViews: register.blackSumViewCount,
          numOfRegistrations: register.blackSumViewCount,
        };
      }
    );
    setRegistersList(transformedRegistersList);
    setRegistersAllDataList(registersData);
    setIsFetching(false);
  };

  const fetchBlackLists = async () => {
    setIsFetching(true);

    const accessToken = localStorage.getItem("accessToken");
    const IndicatorList = await customFetch.get(
      "/api/v1/admins/indicator/blacks",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    console.log(IndicatorList);

    const blacksData = IndicatorList.data.blacks;
    const damageTypes = IndicatorList.data.damageTypes;

    const transformedBlackList = blacksData.map(
      (blacks: any, index: number) => {
        const eatAndRunType = damageTypes[index].damageTypes.find(
          (type: any) => type.damageTypeId == "1"
        );
        const eatAndRun = eatAndRunType ? eatAndRunType.damageTypeCount : "0";

        const hygieneType = damageTypes[index].damageTypes.find(
          (type: any) => type.damageTypeId == "2"
        );
        const hygiene = hygieneType ? hygieneType.damageTypeCount : "0";

        const paidAndRunType = damageTypes[index].damageTypes.find(
          (type: any) => type.damageTypeId == "3"
        );
        const paidAndRun = paidAndRunType
          ? paidAndRunType.damageTypeCount
          : "0";

        const othersType = damageTypes[index].damageTypes.find(
          (type: any) => type.damageTypeId == "-1"
        );
        const others = othersType ? othersType.damageTypeCount : "0";

        return {
          key: index + 1 < 9 ? `0${index + 1}` : `${index + 1}`,
          request: blacks.totalCount,
          approval: blacks.approvedCount,
          refuse: blacks.rejectedCount,
          eatAndRun: eatAndRun,
          hygiene: hygiene,
          paidAndRun: paidAndRun,
          etc: others,
          // not included in table fields
          date: new Date(blacks.date).toISOString().split("T")[0],
        };
      }
    );

    console.log(transformedBlackList);

    setIndicatorList(transformedBlackList);
    setBlacksAllDataList(blacksData);
    setIsFetching(false);
  };

  useEffect(() => {
    try {
      fetchRegisterLists();
      fetchBlackLists();
    } catch (error) {
      console.log(error);
    }
  }, []);

  const showModal = (type: any) => {
    setIsModalOpen(true);
    setModalType(type);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  const onChangeStartDate = (date: any, dateString: any) => {
    // console.log()
    setStartDateFilter(dateString);

    if (dateString) {
      console.log(dateString);

      const standardStartDate = new Date(dateString);
      if (!endDataFilter) {
        // If the end date is not specified filter all dates greater than or equal start date
        const filterRegisterResult = registersList.filter(
          (list: any) => new Date(list.date) >= standardStartDate
        );
        setDateFilterRegisterResults(filterRegisterResult);

        const filterIndicatorResult = IndicatorList.filter(
          (list: any) => new Date(list.date) >= standardStartDate
        );
        setDateFilterIndicatorResults(filterIndicatorResult);
      } else {
        // If the end date is  specified filter all dates greater than or equal start date and less than or equal to end date
        const filterBlackResult = registersList.filter(
          (list: any) =>
            new Date(list.date) >= standardStartDate &&
            new Date(list.date) <= new Date(endDataFilter)
        );
        setDateFilterRegisterResults(filterBlackResult);

        const filterIndicatorResult = IndicatorList.filter(
          (list: any) =>
            new Date(list.date) >= standardStartDate &&
            new Date(list.date) <= new Date(endDataFilter)
        );
        setDateFilterIndicatorResults(filterIndicatorResult);
      }
    } else {
      setDateFilterRegisterResults([]);
    }
  };

  const onChangeEndDate = (date: any, dateString: any) => {
    console.log(dateString);
    setEndDateFilter(dateString);

    if (dateString) {
      const standardEndDate = new Date(dateString);

      if (startDateFilter) {
        const standardStartDate = new Date(startDateFilter);
        const filterBlackResult = registersList.filter(
          (list: any) =>
            new Date(list.date) >= standardStartDate &&
            new Date(list.date) <= standardEndDate
        );
        setDateFilterRegisterResults(filterBlackResult);

        const filterIndicatorResult = IndicatorList.filter(
          (list: any) =>
            new Date(list.date) >= standardStartDate &&
            new Date(list.date) <= standardEndDate
        );
        setDateFilterIndicatorResults(filterIndicatorResult);
      }
    } else {
      setDateFilterRegisterResults([]);
    }
  };

  return (
    <DefaultLayout>
      <Row justify="space-between" align="middle" className="mb-[50px]">
        <Col md={10}>
          <Space
            className="filter-section rounded-full bg-white w-[541px] h-[61px] pl-[42px]"
            size="middle"
          >
            <label htmlFor="#" className="font-black">
              일자
            </label>
            <Radio.Group name="radiogroup" defaultValue={1}>
              <Radio value={1}>전체</Radio>
              <Radio value={2}>설정</Radio>
            </Radio.Group>
            <Space className="date-range" size="small">
              <DatePicker
                locale={locale}
                className="h-[41px] border-none"
                onChange={onChangeStartDate}
              />
              <p className="m-0">~</p>
              <DatePicker
                locale={locale}
                className="h-[41px] border-none"
                onChange={onChangeEndDate}
              />
            </Space>
            {/* <Button
              icon={
                <img src="/assets/images/search_icon.png" alt="search_icon" />
              }
              className="pt-5 border-0 shadow-none"
            ></Button> */}
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
      <Row gutter={[54, 24]}>
        <Col span={24}>
          <Card title="" bodyStyle={{ padding: "36px 0px 22px 84px" }}>
            <Row gutter={30}>
              <Col md={15} xs={24}>
                {isFetching ? (
                  <div className="flex justify-center items-center h-[100%]">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
                  </div>
                ) : (
                  <Table
                    bordered
                    columns={tablesData.table1Columns}
                    dataSource={
                      startDateFilter !== ""
                        ? dateFilterRegisterResults
                        : registersList
                    }
                    onChange={onChange}
                    pagination={{
                      pageSize: 15,
                    }}
                  />
                )}
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Card title="" bodyStyle={{ padding: "26px 84px 22px 84px" }}>
            {isFetching ? (
              <div className="flex justify-center items-center h-[100%]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
              </div>
            ) : (
              <Table
                bordered
                columns={tablesData.table2Columns}
                dataSource={
                  startDateFilter !== ""
                    ? dateFilterIndicatorResults
                    : IndicatorList
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
        onCancel={handleCancel}
        closable={false}
        width={740}
        centered
      >
        <div className="px-8 pt-[56px] mb-[73px]">
          <Button
            className="left-icon p-0 border-0 shadow-none text-left text-[30px] leading-none mb-[53px]"
            onClick={handleCancel}
          >
            <img src="/assets/images/backIcon.png" />
          </Button>
          <ExcelModal />
        </div>
      </Modal>
    </DefaultLayout>
  );
}
