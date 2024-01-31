import { ColumnsType } from "antd/es/table";

type Table1Data = {
  key: any;
  date: string;
  joinMembership: number;
  listViews: number;
  numOfRegistrations: number;
};

const table1Columns: ColumnsType<Table1Data> = [
  {
    title: "번호",
    dataIndex: "number",
    render(value, record, index) {
      let colSpan = 1;
      if (record.date === "TOTAL") {
        colSpan = 0;
      }
      return {
        children: <span>{index.toString().padStart(2, "0")}</span>,
        props: {
          colSpan,
        },
      };
    },
  },
  {
    title: "일자",
    dataIndex: "date",
    render(value, record, index) {
      if (index === 1) return <span className="text-red-500">{value}</span>;
      if (index === 2) return <span className="text-blue-500">{value}</span>;
      let colSpan = 1;
      if (record.date === "TOTAL") {
        colSpan = 2; // 이 값은 병합하고자 하는 열의 수에 따라 달라질 수 있습니다.
      }
      return {
        children: (
          <span
            className={
              index === 1 ? "text-red-500" : index === 2 ? "text-blue-500" : ""
            }
          >
            {value}
          </span>
        ),
        props: {
          colSpan,
        },
      };
    },
  },
  {
    title: "회원가입",
    dataIndex: "joinMembership",
    render(value, record, index) {
      return <span>{record.joinMembership.toString().padStart(2, "0")}</span>;
    },
  },
  {
    title: "리스트 조회 수",
    dataIndex: "listViews",
    render(value, record, index) {
      return <span>{record.listViews.toString().padStart(2, "0")}</span>;
    },
  },
  {
    title: "리스트 등록 수",
    dataIndex: "numOfRegistrations",
    render(value, record, index) {
      return (
        <span className="text-center w-full">
          {record.numOfRegistrations.toString().padStart(2, "0")}
        </span>
      );
    },
  },
];

const table1Data: Table1Data[] = [
  {
    key: 1,
    date: "TOTAL",
    joinMembership: 4,
    listViews: 36,
    numOfRegistrations: 32,
  },
  {
    key: 2,
    date: "2022-10-25  (일) ㅣ 16:00",
    joinMembership: 1,
    listViews: 20,
    numOfRegistrations: 20,
  },
  {
    key: 3,
    date: "2022-10-25  (일) ㅣ 16:00",
    joinMembership: 1,
    listViews: 20,
    numOfRegistrations: 20,
  },
  {
    key: 4,
    date: "2022-10-25  (일) ㅣ 16:00",
    joinMembership: 1,
    listViews: 20,
    numOfRegistrations: 20,
  },
  {
    key: 5,
    date: "2022-10-25  (일) ㅣ 16:00",
    joinMembership: 1,
    listViews: 20,
    numOfRegistrations: 20,
  },
];

type Table2Data = {
  key: any;
  request: number;
  approval: number;
  refuse: number;
  eatAndRun: number;
  hygiene: number;
  paidAndRun: number;
  etc: number;
};

const table2Columns: ColumnsType<Table2Data> = [
  {
    title: "블랙리스트 현황 수",
    children: [
      {
        title: "요청", // blacks[0,1].totalCount
        dataIndex: "request",
        render(value, record, index) {
          return <span>{record.request.toString().padStart(2, "0")}</span>;
        },
      },
      {
        title: "승인 ", // blacks[0,1].approvedCount
        dataIndex: "approval",
        render(value, record, index) {
          return <span>{record.approval.toString().padStart(2, "0")}</span>;
        },
      },
      {
        title: "거절",
        dataIndex: "refuse", // blacks[0,1].rejectedCount
        render(value, record, index) {
          return <span>{record.refuse.toString().padStart(2, "0")}</span>;
        },
      },
    ],
  },
  {
    title: "유형 별 등록 수",
    children: [
      {
        title: "먹튀",
        dataIndex: "eatAndRun",
        render(value, record, index) {
          return <span>{record.eatAndRun.toString().padStart(2, "0")}</span>;
        },
      },
      {
        title: "위생",
        dataIndex: "hygiene",
        render(value, record, index) {
          return <span>{record.hygiene.toString().padStart(2, "0")}</span>;
        },
      },
      {
        title: "돈안내고 튐",
        dataIndex: "paidAndRun",
        render(value, record, index) {
          return <span>{record.paidAndRun.toString().padStart(2, "0")}</span>;
        },
      },
      {
        title: "기타",
        dataIndex: "etc",
        render(value, record, index) {
          return <span>{record.etc.toString().padStart(2, "0")}</span>;
        },
      },
    ],
  },
];

const table2Data: Table2Data[] = [
  {
    key: 1, // YES
    request: 180, // YES (totalCount)
    approval: 32, // YES (approvedCount)
    refuse: 18, // YES (rejectedCount)
    eatAndRun: 10, // ???????
    hygiene: 4, // ?????????
    paidAndRun: 4, // ?????????
    etc: 36,
  },
  {
    key: 2,
    request: 180,
    approval: 32,
    refuse: 18,
    eatAndRun: 10,
    hygiene: 4,
    paidAndRun: 4,
    etc: 36,
  },
  {
    key: 3,
    request: 180,
    approval: 32,
    refuse: 18,
    eatAndRun: 10,
    hygiene: 4,
    paidAndRun: 4,
    etc: 36,
  },
  {
    key: 4,
    request: 180,
    approval: 32,
    refuse: 18,
    eatAndRun: 10,
    hygiene: 4,
    paidAndRun: 4,
    etc: 36,
  },
  {
    key: 4,
    request: 180,
    approval: 32,
    refuse: 18,
    eatAndRun: 10,
    hygiene: 4,
    paidAndRun: 4,
    etc: 36,
  },
  {
    key: 4,
    request: 180,
    approval: 32,
    refuse: 18,
    eatAndRun: 10,
    hygiene: 4,
    paidAndRun: 4,
    etc: 36,
  },
];

export const tablesData = {
  table1Columns,
  table1Data,
  table2Columns,
  table2Data,
};
