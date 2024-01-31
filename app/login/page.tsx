"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "react-toastify";
import AdminLayout from "../AdminLayout/AdminLayout";
import { Col, Row, Button, Form, Input, Typography, Space, Modal } from "antd";
import adminLogo from "../../public/assets/images/adminLogo.png";
import loginBg from "../../public/assets/images/loginBg.png";
import customFetch from "@/utils/customFetch";

export default function Home() {
  const { Text, Link } = Typography;
  const router = useRouter();
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleLogin = async (values: any) => {
    setIsLogging(true);
    const { email, password } = values;
    const credentials = `${email}:${password}`;
    console.log(credentials);
    const encodedCredentials = btoa(credentials);
    // console.log(encodedCredentials);

    try {
      const response = await customFetch.post(
        "/api/v1/auth/admins/login",
        {},
        {
          headers: {
            Authorization: `Basic ${encodedCredentials}`,
          },
        }
      );

      if (response.data) {
        localStorage.setItem("accessToken", response.data.accessToken);
      }
      setIsLogging(false);
      router.push("/");
    } catch (error: any) {
      console.log(error);
      setIsLogging(false);
      toast.error(error.response.data.message, {
        autoClose: 3000,
      });
    }
  };

  return (
    <AdminLayout>
      <Row align="middle">
        <Col span={12}>
          <div className="auth-section">
            <Image src={adminLogo} className="mb-4 mx-auto" alt="admin-log" />
            <p>Admin page</p>
            <div className="or">
              <p>or</p>
            </div>
            <Form layout="vertical" form={form} onFinish={handleLogin}>
              <Form.Item
                name="email"
                label={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>ID</span>
                    <span style={{ marginLeft: "4px", color: "red" }}>*</span>
                  </div>
                }
                rules={[{ required: true, message: "아이디를 입력해주세요" }]}
                // help={<Button>Forget email?</Button>}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="password"
                label={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <span>Password</span>
                    <span style={{ marginLeft: "4px", color: "red" }}>*</span>
                  </div>
                }
                rules={[{ required: true, message: "비밀번호를 입력해주세요" }]}
                // help={<Button>Forget password?</Button>}
              >
                <Input.Password />
              </Form.Item>
              <Space direction="vertical">
                <Button
                  type="primary"
                  className="mt-[80px] mb-3"
                  // onClick={handleLogin}
                  disabled={isLogging}
                  htmlType="submit"
                >
                  {isLogging ? "Logging..." : "Login"}
                </Button>
                {/* <Text
                  style={{ fontSize: 16, color: "#FF0000", fontWeight: 400 }}
                  type="danger"
                >
                  로그인 허용 IP가 아닙니다
                </Text> */}
              </Space>
            </Form>
          </div>
        </Col>
        <Col span={12}>
          <div className="login-img">
            <Image src={loginBg} alt="login-bg" />
          </div>
        </Col>
      </Row>
      <Modal
        title=""
        footer=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        centered
      >
        <div className="text-center pt-[50px]">
          <p>(미입력정보명)를/을 입력해주세요.</p>
          <Button
            type="primary"
            href="/"
            className="mt-[40px] mb-3 w-4/6"
            onClick={handleCancel}
          >
            확인
          </Button>
        </div>
      </Modal>
    </AdminLayout>
  );
}
