import customFetch from "@/utils/customFetch";
import { Button, Flex } from "antd";
import { useEffect } from "react";
import { toast } from "react-toastify";

interface ChangePhoneProps {
  onCancel?: () => void;
  executeFunction?: any;
}

export default function ChangePhone({
  onCancel,
  executeFunction,
}: ChangePhoneProps) {
  return (
    <>
      <p className="text-[20px] mb-12 text-center font-bold">
        정보를 변경하시겠습니까?
      </p>
      <Flex gap="middle" align="center" justify="center">
        <Button
          onClick={() => executeFunction!()}
          className="ant-btn ant-btn-info"
          size="small"
        >
          발송
        </Button>
        <Button
          className="ant-btn ant-btn-info"
          size="small"
          onClick={onCancel}
        >
          취소
        </Button>
      </Flex>
    </>
  );
}
