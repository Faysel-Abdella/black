import customFetch from "@/utils/customFetch";
import { Button, Flex } from "antd";
import { toast } from "react-toastify";

interface RequestConfirmationProps {
  onCancel: () => void;
  fetchApprovalRequests: () => void;
  clickedRequestId: any;
}

export default function RequestConfirmation({
  onCancel,
  fetchApprovalRequests,
  clickedRequestId,
}: RequestConfirmationProps) {
  const handleApprove = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const id = Number(clickedRequestId[0].id);

    try {
      const response = await customFetch.patch(
        `/api/v1/admins/blacks/approval/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      toast.success("요청이 성공적으로 확인되었습니다.", { autoClose: 4000 });
    } catch (error) {
      console.log(error);
    }

    onCancel();

    fetchApprovalRequests();
  };

  return (
    <>
      <p className="text-[20px] mb-12 text-center">
        해당 요청을 승인하시겠습니까?
      </p>
      <Flex gap="middle" align="center" justify="center">
        <Button
          onClick={handleApprove}
          style={{ padding: 0, width: 148, height: 42, fontWeight: 400 }}
          className="ant-btn ant-btn-info"
        >
          승인
        </Button>
        <Button
          onClick={onCancel}
          style={{ padding: 0, width: 148, height: 42, fontWeight: 400 }}
          className="ant-btn ant-btn-info"
        >
          닫기
        </Button>
      </Flex>
    </>
  );
}
