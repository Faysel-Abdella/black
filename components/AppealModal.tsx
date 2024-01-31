import { Form, Row, Button, Radio, Input, Col, Flex } from "antd";

interface AppealModalProps {
  onCancel: () => void;
}

export default function AppealModal({ onCancel }: AppealModalProps) {
  const [form] = Form.useForm();
  const { TextArea } = Input;

  return (
    <div className="modal-form">
      <Form colon={false} layout="horizontal" form={form}>
        <Row gutter={[1, 0]}>
          <Col md={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              name="objectionId"
              label={
                <span style={{ textAlign: "left" }}>
                  이의신청자 ID
                  <span className="required-asterisk ml-1 text-red-500">*</span>
                </span>
              }
            >
              <Input />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              name="registerId"
              label={
                <span style={{ textAlign: "left" }}>
                  등록자 ID
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
                <span style={{ textAlign: "left", marginRight: 29 }}>
                  상태변경
                  <span className="required-asterisk ml-1 text-red-500">*</span>
                </span>
              }
            >
              <div className="p-3 border border-gray-300 rounded">
                <Radio.Group>
                  <Radio value="horizontal1">신청</Radio>
                  <Radio value="horizontal2">처리중</Radio>
                  <Radio value="horizontal3">처리완료</Radio>
                </Radio.Group>
              </div>
            </Form.Item>
          </Col>
          <Col md={24}>
            <Form.Item
              name="objectionContent"
              label={
                <span style={{ textAlign: "left", marginRight: 11 }}>
                  이의신청 내용
                </span>
              }
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
            >
              <TextArea rows={4} className="h-52" />
            </Form.Item>
          </Col>

          <Col md={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              name="consumerName"
              label={
                <span style={{ textAlign: "left", marginRight: 15 }}>
                  블랙컨슈머
                  <span className="required-asterisk ml-1 text-red-500">*</span>
                  <p>이름</p>
                </span>
              }
            >
              <Input />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              name="consumerPhone"
              label={
                <span style={{ textAlign: "left" }}>
                  블랙컨슈머
                  <span className="required-asterisk ml-1 text-red-500">*</span>
                  <p>휴대폰번호</p>
                </span>
              }
            >
              <Input />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              name="consumerBirth"
              label={
                <span style={{ textAlign: "left", marginRight: 15 }}>
                  블랙컨슈머
                  <span className="required-asterisk ml-1 text-red-500">*</span>
                  <p>생년월일</p>
                </span>
              }
            >
              <Input />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              name="damageDate"
              label={
                <span style={{ textAlign: "left" }}>
                  피해발생일
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
              name="damageContent"
              label={
                <span style={{ textAlign: "left", marginRight: 24 }}>
                  피해 내용
                  <span className="required-asterisk ml-1 text-red-500">*</span>
                </span>
              }
            >
              <TextArea rows={4} className="h-52" />
            </Form.Item>
          </Col>
          <Col md={24}>
            <Form.Item
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              name="damagePicture"
              label={
                <span style={{ textAlign: "left", marginRight: 36 }}>
                  사진첨부
                </span>
              }
            >
              <TextArea rows={4} className="h-52" />
            </Form.Item>
          </Col>
        </Row>
        <Flex
          style={{ marginTop: 25 }}
          gap="middle"
          align="center"
          justify="center"
        >
          <Button
            style={{ padding: 0, width: 148, height: 42, fontWeight: 400 }}
            className="ant-btn ant-btn-info"
          >
            수정
          </Button>
          <Button
            onClick={onCancel}
            style={{ padding: 0, width: 148, height: 42, fontWeight: 400 }}
            className="ant-btn ant-btn-info"
          >
            닫기
          </Button>
        </Flex>
      </Form>
    </div>
  );
}
