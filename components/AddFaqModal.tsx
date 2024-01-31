import { useEffect, useState } from "react";

import { Form, Row, Button, Radio, Input, Col, Flex } from "antd";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";

interface AccountModalProps {
  onCancel: () => void;
  buttonType: string;
  clickedFaqData: any;
  fetchFaqLists: () => void;
}

export default function AccountModal({
  onCancel,
  buttonType,
  clickedFaqData,
  fetchFaqLists,
}: AccountModalProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (buttonType === "modification") {
      form.setFieldsValue({
        title: clickedFaqData[0].title,
        content: clickedFaqData[0].content,
        status: clickedFaqData[0].status,
      });
    } else {
      form.resetFields();
    }
  }, [buttonType, clickedFaqData]);

  const handleAddFaq = async () => {
    const title = form.getFieldValue("title");
    const content = form.getFieldValue("content");
    const status = form.getFieldValue("status");

    if (!title || !content || !status) {
      return toast.error("입력란을 모두 채워주세요", { autoClose: 2000 });
    }

    const accessToken = localStorage.getItem("accessToken");

    if (buttonType === "modification") {
      const id = clickedFaqData[0].id;
      try {
        const response = await customFetch.patch(
          `/api/v1/admins/post/faqs/${id}`,
          {
            title: title,
            content: content,
            status: status,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        onCancel();
        form.resetFields();

        fetchFaqLists();
        toast.success("처리가 완료되었습니다", { autoClose: 4000 });
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const response = await customFetch.post(
          `/api/v1/admins/post/faqs`,
          {
            title: title,
            content: content,
            status: status,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        onCancel();
        form.resetFields();

        fetchFaqLists();
        toast.success("처리가 완료되었습니다", { autoClose: 4000 });
      } catch (error) {
        console.log(error);
      }
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
              style={{ marginBottom: 11 }}
              name="title"
              label={
                <span style={{ textAlign: "left" }}>
                  FAQ 타이틀
                  <span className="required-asterisk ml-1 text-red-500">*</span>
                </span>
              }
            >
              <Input />
            </Form.Item>
          </Col>
          <Col md={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              style={{ marginBottom: 11 }}
              name="content"
              label={
                <span style={{ textAlign: "left" }}>
                  FAQ 내용
                  <span className="required-asterisk ml-1 text-red-500">*</span>
                </span>
              }
            >
              <Input />
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
              className="input-group"
            >
              <Radio.Group>
                <Radio checked value="USED">
                  사용
                </Radio>
                <Radio value="UNUSED">미사용</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Flex
          style={{ marginTop: 11, marginBottom: 27 }}
          gap="middle"
          align="center"
          justify="center"
        >
          <Button
            onClick={handleAddFaq}
            style={{ padding: 0, width: 148, height: 42, fontWeight: 400 }}
            className="ant-btn ant-btn-info"
          >
            등록
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
