import customFetch from "@/utils/customFetch";
import { Form, Row, Button, Input, Col, Flex } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ContactModalProps {
  onCancel: () => void;
  clickedQueryData: any;
  fetchQueryLists: () => void;
}

export default function ContactModal({
  onCancel,
  clickedQueryData,
  fetchQueryLists,
}: ContactModalProps) {
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const [queryId, setQueryId] = useState(0);

  useEffect(() => {
    const statusText =
      clickedQueryData[0].status === "WAITING"
        ? "대기"
        : clickedQueryData[0].status === "COMPLETED"
        ? "답변완료"
        : clickedQueryData[0].status; // 다른 상태값은 그대로 표시

    form.setFieldsValue({
      status: statusText,
      id: clickedQueryData[0].id,
      loginId: clickedQueryData[0].author.loginId,
      name: clickedQueryData[0].author.name,
      phone: clickedQueryData[0].phone,
      createdAt: new Date(clickedQueryData[0].createdAt)
        .toISOString()
        .split("T")[0],
      email: clickedQueryData[0].email,
      title: clickedQueryData[0].title,
      contact: clickedQueryData[0].author.email,
      answer: clickedQueryData[0].answerContent
        ? clickedQueryData[0].answerContent
        : "--",
    });
    setQueryId(clickedQueryData[0].id);
  }, [clickedQueryData]);

  const handleGiveAnswer = async () => {
    const answerContent = form.getFieldValue("answer");

    const accessToken = localStorage.getItem("accessToken");

    console.log(answerContent);

    try {
      const response = await customFetch.patch(
        `/api/v1/admins/post/inquiries/${queryId}`,
        {
          answerContent: answerContent,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      onCancel();
      toast.success("처리가 완료되었습니다", { autoClose: 2000 });
      fetchQueryLists();
    } catch (error) {
      console.log(error);
      toast.error("잠시 후 다시 시도해주세요", { autoClose: 2000 });
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
              style={{ marginBottom: 13, paddingRight: 9 }}
              name="status"
              label={<span style={{ lineHeight: "32px" }}>상태</span>}
            >
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ marginBottom: 13 }}
              name="loginId"
              label={<span style={{ lineHeight: "32px" }}>ID</span>}
            >
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ marginBottom: 13, paddingRight: 10 }}
              name="name"
              label={
                <span style={{ lineHeight: "32px", marginLeft: "40px" }}>
                  이름
                </span>
              }
            >
              <Input readOnly />
            </Form.Item>
          </Col>

          <Col md={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ marginBottom: 13 }}
              name="phone"
              label={<span style={{ lineHeight: "32px" }}>휴대폰번호</span>}
            >
              <Input readOnly />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ marginBottom: 13, paddingRight: 10 }}
              name="createdAt"
              label={
                <span style={{ lineHeight: "32px", marginLeft: "30px" }}>
                  작성일
                </span>
              }
            >
              <Input readOnly />
            </Form.Item>
          </Col>

          <Col md={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              style={{ marginBottom: 13 }}
              name="email"
              label={<span style={{ lineHeight: "32px" }}>이메일</span>}
            >
              <Input readOnly />
            </Form.Item>
          </Col>

          <Col md={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              style={{ marginBottom: 13, paddingRight: 9 }}
              name="title"
              label={<span style={{ lineHeight: "32px" }}>제목</span>}
            >
              <Input readOnly />
            </Form.Item>
          </Col>

          <Col md={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              style={{ marginBottom: 13, paddingRight: 9 }}
              name="contact"
              label={<span>문의내용</span>}
            >
              <TextArea readOnly rows={4} style={{ resize: "none" }} />
            </Form.Item>
          </Col>

          <Col md={24}>
            <Form.Item
              style={{ paddingRight: 9 }}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              name="answer"
              label="답변내용"
            >
              <TextArea rows={4} style={{ resize: "none" }} />
            </Form.Item>
          </Col>
        </Row>
        <Flex
          gap="middle"
          align="center"
          justify="center"
          className="mt-[20px] mb-[35px]"
        >
          <Button
            onClick={handleGiveAnswer}
            style={{ padding: 0, width: 148, height: 42, fontWeight: 400 }}
            className="ant-btn ant-btn-info"
          >
            답변
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
