import { Form, Row, Button, Radio, Input, Col, Flex } from "antd";
import { toast } from "react-toastify";
import customFetch from "@/utils/customFetch";

interface MembershipProps {
  onCancel: () => void;
  fetchApprovalRequests: () => void;
  clickedRequestId: any;
}

export default function Membership({
  onCancel,
  fetchApprovalRequests,
  clickedRequestId,
}: MembershipProps) {
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const handleReject = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const id = Number(clickedRequestId[0].id);
    const reason = form.getFieldValue("reason");

    try {
      const response = await customFetch.patch(
        `/api/v1/admins/blacks/reject/${id}`,
        {
          reason: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(response);

      toast.success("처리가 완료되었습니다", { autoClose: 2000 });
    } catch (error) {
      console.log(error);
    }

    form.resetFields();

    onCancel();

    fetchApprovalRequests();
  };

  return (
    <div className="modal-form form-inline">
      <p className="text-[20px] mb-4">
        거부 사유를 입력해주세요 <br />
        거부 일자와 거부사유가 같이 저장됩니다
      </p>
      <Form layout="horizontal" form={form}>
        <Row gutter={[16, 0]}>
          <Col md={24}>
            <Form.Item name="reason">
              <TextArea rows={4} className="h-[96px]" name="reason" />
            </Form.Item>
          </Col>
        </Row>
        <Flex
          gap="middle"
          align="center"
          justify="center"
          className="mt-[24px]"
        >
          <Button
            onClick={handleReject}
            style={{ padding: 0, width: 148, height: 42, fontWeight: 400 }}
            className="ant-btn ant-btn-info"
          >
            거부
          </Button>
          <Button
            onClick={onCancel}
            style={{ padding: 0, width: 148, height: 42, fontWeight: 400 }}
            className="ant-btn ant-btn-info"
          >
            취소
          </Button>
        </Flex>
      </Form>
    </div>
  );
}
