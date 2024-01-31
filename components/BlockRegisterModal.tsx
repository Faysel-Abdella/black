import customFetch from "@/utils/customFetch";
import {
  Form,
  Row,
  Button,
  Radio,
  Input,
  Col,
  Flex,
  Space,
  AutoComplete,
} from "antd";
import { useState } from "react";
import { toast } from "react-toastify";

type MembershipManagementModalProps = {
  fetchMemberLists?: () => void;
  closeModal?: () => void;
};

export default function BlockRegisterModal({
  fetchMemberLists,
  closeModal,
}: MembershipManagementModalProps) {
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const [userID, setUserId] = useState(0);

  const [isLoading, setIsLoading] = useState(false);

  const findThisUser = async (state: string) => {
    const loginID = form.getFieldValue("loginID");

    if (!loginID) {
      return toast.error("아이디를 정확하게 입력해주세요.", {
        autoClose: 2000,
      });
    }

    const accessToken = localStorage.getItem("accessToken");

    setIsLoading(true);

    try {
      const response = await customFetch.get(
        `/api/v1/admins/users/loginid?loginId=${loginID}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (state === "yes") {
        toast.success("사용자를 찾았습니다", { autoClose: 2000 });
      }
      setUserId(response.data.userId);
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      toast.error("일치하는 회원이 없습니다.", { autoClose: 2000 });
      console.log(error);
    }
  };

  const handleDeleteByEmail = async () => {
    const accessToken = localStorage.getItem("accessToken");

    findThisUser("no");
    const status = form.getFieldValue("status");
    const reason = form.getFieldValue("reason");

    if (!status) {
      return toast.error("상태를 확인해주세요");
    }

    if (!reason) {
      return toast.error("사유를 적어주세요");
    }

    setIsLoading(true);

    try {
      const response = await customFetch.post(
        `/api/v1/admins/users/ban/${userID}`,
        {
          status: status,
          reason: reason,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      closeModal!();
      form.resetFields();
      toast.success("처리가 완료되었습니다", { autoClose: 2000 });
      fetchMemberLists!();
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.response.message, { autoClose: 2000 });
    }
  };

  return (
    <div className="modal-form form-inline">
      <Form colon={false} layout="horizontal" form={form}>
        <Row gutter={[16, 0]}>
          <Col md={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              className="custom-label-margin"
              name="user"
              label={
                <span style={{ textAlign: "left" }}>
                  대상설정
                  <span className="required-asterisk ml-1 text-red-500">*</span>
                </span>
              }
            >
              <Space style={{ display: "block", height: 42 }}>
                <div className="flex">
                  <Form.Item name="loginID">
                    <Input placeholder="login ID" />
                  </Form.Item>
                  <Button
                    size="small"
                    style={{ fontWeight: 400, height: 42 }}
                    className="ant-btn-info ml-2"
                    disabled={isLoading}
                    onClick={() => findThisUser("yes")}
                  >
                    아이디 조회
                  </Button>
                </div>
              </Space>
            </Form.Item>
          </Col>
          <Col md={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              name="status"
              label={
                <span style={{ textAlign: "left" }}>
                  상태
                  <span className="required-asterisk ml-1 text-red-500">*</span>
                </span>
              }
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
              label="제재사유"
              className="custom-label-margin"
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Flex gap="middle" align="center" justify="center">
          <Button
            style={{ padding: 0, width: 148, height: 42 }}
            className="ant-btn ant-btn-info"
            onClick={handleDeleteByEmail}
            disabled={isLoading}
          >
            {isLoading ? (
              <div
                className="animate-spin inline-block w-4 h-4 border-[3px] border-current border-t-transparent text-slate-50 rounded-full"
                role="status"
                aria-label="loading"
              ></div>
            ) : (
              "변경"
            )}
          </Button>
          <Button
            onClick={closeModal}
            style={{ padding: 0, width: 148, height: 42 }}
            className="ant-btn ant-btn-info"
          >
            취소
          </Button>
        </Flex>
      </Form>
    </div>
  );
}
