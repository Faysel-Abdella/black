import customFetch from "@/utils/customFetch";
import { Form, Row, Button, Radio, Input, Col, Flex } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface MembershipSanctionProps {
  onCancel: () => void;
  closeParentModal?: () => void;
  memberId: string | number;
  fetchMembersLists: () => void;
  isUnblockModalOpen?: any;
  setIsUnblockModalOpen?: any;
}

export default function MembershipSanction({
  onCancel,
  closeParentModal,
  memberId,
  fetchMembersLists,
  isUnblockModalOpen,
  setIsUnblockModalOpen,
}: MembershipSanctionProps) {
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const [isLoading, setIsLoading] = useState(false);

  const id = memberId;

  useEffect(() => {
    form.resetFields();
  }, [memberId, isUnblockModalOpen]);

  const handlePostBan = async () => {
    const reason = form.getFieldValue("reason");
    const period = form.getFieldValue("period");
    if (!reason || !period) {
      return toast.error("사유를 적어주세요", { autoClose: 2000 });
    }
    const accessToken = localStorage.getItem("accessToken");

    try {
      setIsLoading(true);
      const response = await customFetch.post(
        `/api/v1/admins/users/ban/${id}`,
        {
          reason: reason,
          status: period,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      onCancel();
      setIsLoading(false);
      closeParentModal!();
      form.resetFields();
      toast.success("처리가 완료되었습니다", { autoClose: 2000 });
      fetchMembersLists();
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.response.data.message, {
        autoClose: 2000,
      });
      onCancel();

      console.log(error);
    }
  };

  const closeModal = () => {
    onCancel();
    setIsUnblockModalOpen(false);
  };

  return (
    <div className="modal-form form-inline">
      <Form colon={false} layout="horizontal" form={form}>
        <Row gutter={[32, 0]}>
          <Col md={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              name="period"
              label="제재기간"
              className="input-group custom-label-margin"
            >
              <Radio.Group>
                <Radio value="SEVEN_DAYS">7일</Radio>
                <Radio value="THIRTY_DAYS">30일</Radio>
                <Radio value="PERMANENT">영구</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col md={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              name="reason"
              className="custom-label-margin"
              label="제재사유"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Flex gap="middle" align="center" justify="center">
          <Button
            disabled={isLoading}
            onClick={handlePostBan}
            style={{ padding: 0, width: 148, height: 42 }}
            className="ant-btn ant-btn-info"
          >
            {isLoading ? (
              <div
                className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-slate-50 rounded-full"
                role="status"
                aria-label="loading"
              ></div>
            ) : (
              "변경"
            )}
          </Button>
          <Button
            style={{ padding: 0, width: 148, height: 42 }}
            className="ant-btn ant-btn-info"
            onClick={closeModal}
          >
            취소
          </Button>
        </Flex>
      </Form>
    </div>
  );
}
