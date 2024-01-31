"use client";
import { Card, Col, Row, Table, Space } from "antd";

import { useState, useEffect } from "react";

import Sidebar from "../components/Sidebar";
import LineChart from "../components/LineChart";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [isFetchingGeneralData, setIsFetchingGeneralDate] = useState(false);
  const [isFetchingThisWeekData, setIsFetchingThisWeekData] = useState(false);
  const [isFetchingThisWeekDataTable, setIsFetchingThisWeekDataTable] =
    useState(false);

  const [thisWeekData, setThisWeekData] = useState<any>({});
  const [weekTableData, setWeekTableData] = useState([]);
  const [generalData, setGeneralData] = useState([]);

  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(today.getDate() - 7);

  const formatDate = (date: any) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const startDate = formatDate(sevenDaysAgo);
  const endDate = formatDate(today);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      // 로그인이 필요하다는 메시지를 보여주고, 로그인 페이지로 리디렉션합니다.
      toast.error("로그인이 필요합니다.");
      router.push("/login"); // 로그인 페이지 경로를 설정하세요.
    }
  }, [router]);

  const fetchThisWeekData = async () => {
    const accessToken = localStorage.getItem("accessToken");

    setIsFetchingThisWeekData(true);
    try {
      const weekData = await customFetch.get(
        `/api/v1/admins/dashboard/register?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const days = weekData.data.map((oneDay: any) => oneDay.day);

      const numbersData = weekData.data.map(
        (oneDay: any) => oneDay.registerCount
      );

      const transformedWeekData = {
        labels: days,
        datasets: [
          {
            label: "Line 1",
            data: numbersData,
            borderColor: "rgba(255, 99, 132, 1)",
            borderWidth: 2,
            fill: false,
          },
        ],
      };

      setThisWeekData(transformedWeekData);

      setIsFetchingThisWeekData(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchThisWeekDataTable = async () => {
    const accessToken = localStorage.getItem("accessToken");

    setIsFetchingThisWeekDataTable(true);
    try {
      const weekData = await customFetch.get(
        `/api/v1/admins/dashboard/register?start_date=${startDate}&end_date=${endDate}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const transformedWeekDataTable = weekData.data.map(
        (data: any, index: number) => ({
          key: index + 1 < 9 ? `0${index + 1}` : `${index + 1}`,
          date: new Date(data.date).toISOString().split("T")[0],
          signUp: data.registerCount,
          total: data.registerCount,
        })
      );

      setWeekTableData(transformedWeekDataTable);

      setIsFetchingThisWeekDataTable(false);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchGeneralData = async () => {
    const accessToken = localStorage.getItem("accessToken");

    setIsFetchingGeneralDate(true);
    try {
      const generalData = await customFetch.get(
        "/api/v1/admins/dashboard/blacks/approval-request",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const transformedGeneralData = generalData.data.map(
        (data: any, index: number) => ({
          name: new Date(data.createdAt).toISOString().split("T")[0],
          chinese: data.authorLoginId,
          math: data.name,
          english: "자세히보기",
        })
      );

      setGeneralData(transformedGeneralData);

      setIsFetchingGeneralDate(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchThisWeekData();
    fetchThisWeekDataTable();
    fetchGeneralData();
  }, []);

  const columnsThree = [
    {
      title: "Week",
      dataIndex: "date",
      sorter: {
        compare: (a: any, b: any) => a.name - b.name,
        multiple: 3,
      },
    },
    {
      title: "가입",
      dataIndex: "signUp",
      sorter: {
        compare: (a: any, b: any) => a.chinese - b.chinese,
        multiple: 3,
      },
    },
    {
      title: "합계",
      dataIndex: "total",
      sorter: {
        compare: (a: any, b: any) => a.math - b.math,
        multiple: 2,
      },
    },
  ];

  const columns = [
    {
      title: "승인요청 일시",
      dataIndex: "name",
      sorter: {
        compare: (a: any, b: any) => a.name - b.name,
        multiple: 3,
      },
    },
    {
      title: "등록자 ID",
      dataIndex: "chinese",
      sorter: {
        compare: (a: any, b: any) => a.chinese - b.chinese,
        multiple: 3,
      },
    },
    {
      title: "블랙컨슈머 이름",
      dataIndex: "math",
      sorter: {
        compare: (a: any, b: any) => a.math - b.math,
        multiple: 2,
      },
    },
    {
      title: "상세보기",
      dataIndex: "english",
      sorter: {
        compare: (a: any, b: any) => a.english - b.english,
        multiple: 1,
      },
      render: () => <Link href={`/approval-request`}>자세히보기</Link>,
    },
  ];

  const onChange = (pagination: any, filters: any, sorter: any, extra: any) => {
    console.log("params", pagination, filters, sorter, extra);
  };

  return (
    <div className="main-dashboard">
      <Sidebar />
      <main>
        <div className="container flex flex-col min-h-screen justify-center">
          <Row gutter={[54, 40]}>
            <Col span={12}>
              <Card title="이번주 가입 현황">
                <div className="h-[310px]">
                  {isFetchingThisWeekData ? (
                    <div className="flex justify-center items-center h-[100%]  py-3">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
                    </div>
                  ) : thisWeekData && Object.keys(thisWeekData).length > 0 ? (
                    <LineChart data={thisWeekData} />
                  ) : (
                    <div className="flex justify-center items-center h-[100%]  py-3">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
                    </div>
                  )}
                </div>

                <div className="mt-3 table-dark">
                  {isFetchingThisWeekData ? (
                    <div className="flex justify-center items-center h-[100%]  py-3">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
                    </div>
                  ) : weekTableData && weekTableData.length > 0 ? (
                    <Table
                      // pagination={false}
                      columns={columnsThree}
                      dataSource={weekTableData}
                      onChange={onChange}
                      pagination={{
                        pageSize: 15,
                      }}
                    />
                  ) : (
                    <div className="flex justify-center items-center h-[100%]  py-3">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
                    </div>
                  )}
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Space direction="vertical" size="large" className="w-full">
                <Card title="블랙리스트 승인 요청 리스트">
                  <div className="table-dark">
                    {isFetchingGeneralData ? (
                      <div className="flex justify-center items-center h-[100%]  py-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
                      </div>
                    ) : weekTableData && weekTableData.length > 0 ? (
                      <Table
                        // pagination={false}
                        columns={columns}
                        dataSource={generalData}
                        onChange={onChange}
                        pagination={{
                          pageSize: 15,
                        }}
                      />
                    ) : (
                      <div className="flex justify-center items-center h-[100%]  py-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
                      </div>
                    )}
                  </div>
                </Card>
                {/* <Card title="이의신청 리스트">
                  <div className="table-dark">
                    {isFetchingGeneralData ? (
                      <div className="flex justify-center items-center h-[100%]  py-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
                      </div>
                    ) : weekTableData && weekTableData.length > 0 ? (
                      <Table
                        pagination={false}
                        columns={columnsTwo}
                        dataSource={generalData}
                        onChange={onChange}
                          pagination={{
                  pageSize: 15,
                }}
                      />
                    ) : (
                      <div className="flex justify-center items-center h-[100%]  py-3">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-500"></div>
                      </div>
                    )}
                  </div>
                </Card> */}
              </Space>
            </Col>
          </Row>
        </div>
      </main>
    </div>
  );
}
