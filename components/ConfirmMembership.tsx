import customFetch from "@/utils/customFetch";
import { Button, Flex } from "antd";
import { useEffect } from "react";
import { toast } from "react-toastify";

interface ConfirmMembershipProps {
  onCancel?: () => void;
  executeFunction?: any;
  isLoading?: boolean;
  special?: boolean;
}

export default function ConfirmMembership({
  onCancel,
  executeFunction,
  isLoading,
  special,
}: ConfirmMembershipProps) {
  return (
    <>
      <p className="text-[20px] mb-12 text-center font-bold">
        임시 비밀번호를 발송하시겠습니까?
      </p>
      <Flex gap="middle" align="center" justify="center">
        <Button
          onClick={async () => {
            await executeFunction!();
            if (special) {
              onCancel!();
            }
          }}
          className="ant-btn ant-btn-info"
          size="small"
          disabled={isLoading}
        >
          {isLoading! ? (
            <div
              className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-slate-50 rounded-full"
              role="status"
              aria-label="loading"
            ></div>
          ) : (
            "발송"
          )}
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
