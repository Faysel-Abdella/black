import { Form, Row, Button, Radio, Input, Col, Flex, Modal } from "antd";
import { toast } from "react-toastify";
import ConfirmMembership from "./ConfirmMembership";
import { useEffect, useState } from "react";
import customFetch from "@/utils/customFetch";

interface AccountModalProps {
  onCancel: () => void;
  buttonType: string;
  clickedAdminData?: any;
  fetchAdminLists?: () => void;
}

export default function AccountModal({
  onCancel,
  buttonType,
  clickedAdminData,
  fetchAdminLists,
}: AccountModalProps) {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("ConfirmMembership");
  const [changeInfoAdminData, setChangeInfoAdminData] =
    useState(clickedAdminData);
  const [allowedPermissions, setAllowedPermissions] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setChangeInfoAdminData(clickedAdminData);
    setAllowedPermissions([]);
    form.setFieldsValue({
      name: buttonType === "changeInfo" ? clickedAdminData[0].name : null,
      loginId: buttonType === "changeInfo" ? clickedAdminData[0].loginId : null,
      id: buttonType === "changeInfo" ? clickedAdminData[0].id : null,
      department:
        buttonType === "changeInfo" ? clickedAdminData[0].department : null,
      phone: buttonType === "changeInfo" ? clickedAdminData[0].phone : null,
      email: buttonType === "changeInfo" ? clickedAdminData[0].email : null,
      allowedIp:
        buttonType === "changeInfo"
          ? clickedAdminData[0].allowedIp
            ? clickedAdminData[0].allowedIp
            : "---"
          : null,
      permissions:
        buttonType === "changeInfo" ? clickedAdminData[0].permissions : null,
    });
    if (buttonType === "changeInfo") {
      setAllowedPermissions([]);
      if (
        clickedAdminData[0].permissions &&
        clickedAdminData[0].permissions.length > 0
      ) {
        const thisAdminPermissions = clickedAdminData[0].permissions.map(
          (permission: string) => permission
        );
        setAllowedPermissions(clickedAdminData[0].permissions);
      } else {
        setAllowedPermissions([]);
      }
    }
  }, [clickedAdminData, buttonType, form]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const accessToken = localStorage.getItem("accessToken");

    try {
      if (buttonType === "changeInfo") {
        const response = await customFetch.patch(
          `/api/v1/admins/${changeInfoAdminData[0].id}`,
          {
            password: changeInfoAdminData[0].password,
            name: form.getFieldValue("name"),
            department: form.getFieldValue("department"),
            email: form.getFieldValue("email"),
            phone: form.getFieldValue("phone"),
            allowedIp: form.getFieldValue("allowedIp"),
            permissions: allowedPermissions,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        setIsLoading(false);

        closeModal();
        onCancel();
        // Reset all permissions
        setAllowedPermissions([]);
        // Clear all fields
        form.resetFields();
        fetchAdminLists!();
        toast.success("처리가 완료되었습니다", { autoClose: 3500 });
      } else {
        setIsLoading(true);
        const response = await customFetch.post(
          "/api/v1/admins",
          {
            loginId: form.getFieldValue("loginId"),
            password: form.getFieldValue("password"),
            name: form.getFieldValue("name"),
            department: form.getFieldValue("department"),
            email: form.getFieldValue("email"),
            phone: form.getFieldValue("phone"),
            allowedIp: form.getFieldValue("allowedIp"),
            permissions: allowedPermissions,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setIsLoading(false);
        // Close the modal
        closeModal();
        onCancel();
        // Reset all permissions
        setAllowedPermissions([]);

        // Clear all fields
        form.resetFields();
        toast.success("처리가 완료되었습니다", { autoClose: 3500 });

        fetchAdminLists!();
      }
    } catch (error: any) {
      console.error(error);
      if (
        Array.isArray(error.response.data.message) &&
        error.response.data.message[0]
      ) {
        toast.error(error.response.data.message[0], {
          autoClose: 4000,
        });
      } else {
        toast.error(error.response.data.message, {
          autoClose: 4000,
        });
      }
    }
  };

  const handleSendEmail = async () => {
    const accessToken = localStorage.getItem("accessToken");
    setIsLoading(true);
    try {
      const response = await customFetch.post(
        `/api/v1/admins/mail/send-password/${changeInfoAdminData[0].id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setIsLoading(false);
      closeModal();
      onCancel();
      toast.success("처리가 완료되었습니다", { autoClose: 3500 });
      fetchAdminLists!();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    const accessToken = localStorage.getItem("accessToken");
    setIsLoading(true);
    try {
      const response = await customFetch.delete(
        `/api/v1/admins/${changeInfoAdminData[0].id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setIsLoading(false);
      closeModal();
      onCancel();
      toast.success("처리가 완료되었습니다", { autoClose: 3500 });
      fetchAdminLists!();
    } catch (error) {
      console.log(error);
    }
  };

  const permissionExists = (permission: string) => {
    return allowedPermissions.some(
      (element) => element.toLowerCase() === permission.toLowerCase()
    );
  };

  const handlePermissionChange = (newPermission: string) => {
    const isExist = allowedPermissions.indexOf(newPermission.toUpperCase());
    const isExistLower = allowedPermissions.indexOf(
      newPermission.toLowerCase()
    );

    if (isExist == -1 && isExistLower == -1) {
      setAllowedPermissions((prev) => [...prev, newPermission]);
    } else {
      const restPermissions = allowedPermissions.filter(
        (permission) => permission.toLowerCase() !== newPermission.toLowerCase()
      );

      setAllowedPermissions(restPermissions);
      console.log(restPermissions);
    }
  };

  const [isSelectAllActive, setIsSelectAllActive] = useState(false);

  const selectAll = () => {
    if (!isSelectAllActive) {
      const allPermissions = [
        "DASHBOARD",
        "OVERALL_METRICS",
        "USER_MANAGEMENT",
        "USER_BAN",
        "BLACK_MANAGEMENT",
        "ADMIN_MANAGEMENT",
        "ADMIN_PASSWORD_MISMATCH",
        "FAQ_MANAGEMENT",
        "CONTACT_SUPPORT",
      ];
      setAllowedPermissions(allPermissions);
      setIsSelectAllActive(true);
    } else {
      setAllowedPermissions([]);
      setIsSelectAllActive(false);
    }
  };

  const showModal = (type: any) => {
    setIsModalOpen(true);
    setModalType(type);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="modal-form form-inline">
      <Form colon={false} layout="horizontal" form={form}>
        <Row gutter={[16, 0]}>
          {buttonType === "changeInfo" && (
            <>
              <Col md={12} />
              <Col md={12} className="mb-[10px]">
                <div className="text-right">
                  <Button
                    shape="round"
                    size="small"
                    style={{
                      padding: 0,
                      width: 120,
                      height: 32,
                      fontWeight: 400,
                      marginRight: 10,
                    }}
                    className="ant-btn-info"
                    onClick={() => showModal("ConfirmMembership")}
                  >
                    임시비밀번호 발송
                  </Button>
                  <Button
                    shape="round"
                    size="small"
                    style={{
                      padding: 0,
                      width: 40,
                      height: 32,
                      fontWeight: 400,
                    }}
                    className="ant-btn-info"
                    onClick={handleDelete}
                  >
                    삭제
                  </Button>
                </div>
              </Col>
            </>
          )}
          <Col md={24}>
            <Form.Item
              style={{ marginBottom: 15 }}
              name="loginId"
              label={
                <span style={{ textAlign: "left" }}>
                  ID
                  <span className="required-asterisk ml-1 text-red-500">*</span>
                </span>
              }
            >
              <Input name="id" />
            </Form.Item>
          </Col>
          {buttonType === "register" && (
            <>
              <Col md={12}>
                <Form.Item
                  style={{ marginBottom: 15 }}
                  name="password"
                  label={
                    <span style={{ textAlign: "left" }}>
                      비밀번호
                      <span className="required-asterisk ml-1 text-red-500">
                        *
                      </span>
                    </span>
                  }
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item
                  style={{ marginBottom: 15 }}
                  name="checkPassword"
                  label={
                    <span style={{ textAlign: "left" }}>
                      비밀번호 확인
                      <span className="required-asterisk ml-1 text-red-500">
                        *
                      </span>
                    </span>
                  }
                >
                  <Input />
                </Form.Item>
              </Col>
            </>
          )}
          <Col md={12}>
            <Form.Item
              style={{ marginBottom: 15 }}
              name="name"
              label={
                <span style={{ textAlign: "left" }}>
                  이름
                  <span className="required-asterisk ml-1 text-red-500">*</span>
                </span>
              }
            >
              <Input name="name" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              style={{ marginBottom: 15 }}
              name="department"
              label={
                <span style={{ textAlign: "left" }}>
                  소속부서
                  <span className="required-asterisk ml-1 text-red-500">*</span>
                </span>
              }
            >
              <Input name="department" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              style={{ marginBottom: 15 }}
              name="phone"
              label={
                <span style={{ textAlign: "left" }}>
                  휴대폰번호
                  <span className="required-asterisk ml-1 text-red-500">*</span>
                </span>
              }
            >
              <Input name="phone" />
            </Form.Item>
          </Col>
          <Col md={12}>
            <Form.Item
              style={{ marginBottom: 15 }}
              name="email"
              label={
                <span style={{ textAlign: "left" }}>
                  이메일 주소
                  <span className="required-asterisk ml-1 text-red-500">*</span>
                </span>
              }
            >
              <Input name="email" required={true} />
            </Form.Item>
          </Col>
          <Col md={24}>
            <Form.Item
              style={{ marginBottom: 15 }}
              name="allowedIp"
              label={<span style={{ textAlign: "left" }}>허용 IP</span>}
            >
              <Input name="allowedIp" required />
            </Form.Item>
          </Col>
          <Col md={24}>
            <Form.Item
              style={{ marginBottom: 15 }}
              // name="settings"
              name="permissions"
              label={<span style={{ textAlign: "left" }}>권한 설정</span>}
              className="input-group"
            >
              {/* <Radio.Group> */}
              {/* select all */}
              <Radio
                value="horizontal"
                checked={isSelectAllActive}
                onClick={selectAll}
              >
                전체 선택
              </Radio>
              {/* </Radio.Group> */}
            </Form.Item>
          </Col>
          <Col md={24}>
            <Form.Item
              style={{ marginBottom: 15 }}
              name="home"
              label={<span style={{ textAlign: "left" }}>홈</span>}
              className="input-group"
            >
              {/* <Radio.Group onChange={(e) => handlePermissionChange(e, "home")}> */}
              <Radio
                value="DASHBOARD"
                checked={permissionExists("DASHBOARD")}
                onClick={() => handlePermissionChange("DASHBOARD")}
              >
                대시보드
              </Radio>
              <Radio
                value="OVERALL_METRICS"
                onClick={() => handlePermissionChange("OVERALL_METRICS")}
                checked={permissionExists("OVERALL_METRICS")}
              >
                종합지표
              </Radio>
              {/* </Radio.Group> */}
            </Form.Item>
          </Col>
          <Col md={24}>
            <Form.Item
              style={{ marginBottom: 15 }}
              name="memberManagement"
              label={<span style={{ textAlign: "left" }}>회원관리</span>}
              className="input-group"
            >
              {/* <Radio.Group */}
              {/* onChange={(e) => handlePermissionChange(e, "memberManagement")} */}
              {/* > */}
              <Radio
                value="USER_MANAGEMENT"
                onClick={() => handlePermissionChange("USER_MANAGEMENT")}
                checked={permissionExists("USER_MANAGEMENT")}
              >
                회원 관리
              </Radio>
              <Radio
                value="USER_BAN"
                onClick={() => handlePermissionChange("USER_BAN")}
                checked={permissionExists("USER_BAN")}
              >
                회원 제재
              </Radio>
              {/* <Radio value="2_user_update">등록 관리</Radio> */}
              {/* </Radio.Group> */}
            </Form.Item>
          </Col>
          <Col md={24}>
            <Form.Item
              style={{ marginBottom: 15 }}
              name="consumerManagement"
              label={<span style={{ textAlign: "left" }}>블랙리스트 관리</span>}
              className="input-group"
            >
              {/* <Radio.Group */}
              {/* onChange={(e) => */}
              {/* handlePermissionChange(e, "consumerManagement") */}
              {/* } */}
              {/* > */}
              <Radio
                value="BLACK_MANAGEMENT"
                onClick={() => handlePermissionChange("BLACK_MANAGEMENT")}
                checked={permissionExists("BLACK_MANAGEMENT")}
              >
                승인요청 관리
              </Radio>
              {/* Appeal Management */}
              {/* <Radio value="3_Appeal Management">이의신청 관리</Radio> */}
              {/* </Radio.Group> */}
            </Form.Item>
          </Col>
          <Col md={24}>
            <Form.Item
              style={{ marginBottom: 15 }}
              name="accountManagement"
              label={<span style={{ textAlign: "left" }}>계정 관리</span>}
              className="input-group"
            >
              {/* <Radio.Group */}
              {/*  onChange={(e) => handlePermissionChange(e, "accountManagement")} */}
              {/*  > */}
              <Radio
                value="ADMIN_MANAGEMENT"
                onClick={() => handlePermissionChange("ADMIN_MANAGEMENT")}
                checked={permissionExists("ADMIN_MANAGEMENT")}
              >
                계정관리
              </Radio>
              <Radio
                value="ADMIN_PASSWORD_MISMATCH"
                onClick={() =>
                  handlePermissionChange("ADMIN_PASSWORD_MISMATCH")
                }
                checked={permissionExists("ADMIN_PASSWORD_MISMATCH")}
              >
                비밀번호 불일치 관리
              </Radio>
              {/* admin_create */}
              {/* <Radio value="4_admin_create">등록 관리</Radio> */}
              {/* </Radio.Group> */}
            </Form.Item>
          </Col>

          <Col md={24}>
            <Form.Item
              name="noticeManagement"
              label={<span style={{ textAlign: "left" }}>공지 관리</span>}
              className="input-group"
            >
              {/* <Radio.Group */}
              {/* onChange={(e) => handlePermissionChange(e, "noticeManagement")} */}
              {/*  > */}
              <Radio
                value="FAQ_MANAGEMENT"
                onClick={() => handlePermissionChange("FAQ_MANAGEMENT")}
                checked={permissionExists("FAQ_MANAGEMENT")}
              >
                FAQ 관리
              </Radio>
              <Radio
                value="CONTACT_SUPPORT"
                onClick={() => handlePermissionChange("CONTACT_SUPPORT")}
                checked={permissionExists("CONTACT_SUPPORT")}
              >
                1 : 1 문의하기
              </Radio>
              {/* </Radio.Group> */}
            </Form.Item>
          </Col>
        </Row>
        <Flex
          style={{ marginTop: 30 }}
          gap="middle"
          align="center"
          justify="center"
        >
          <Button
            style={{ padding: 0, width: 148, height: 42, fontWeight: 400 }}
            className="ant-btn ant-btn-info"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <div
                className="animate-spin inline-block w-5 h-5 border-[3px] border-current border-t-transparent text-slate-50 rounded-full"
                role="status"
                aria-label="loading"
              ></div>
            ) : (
              "등록"
            )}
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
      <Modal
        className={"ConfirmMembership"}
        title=""
        footer=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        width={510}
        centered
      >
        <div className="px-1">
          <ConfirmMembership
            onCancel={handleCancel}
            executeFunction={handleSendEmail}
            isLoading={isLoading}
          />
        </div>
      </Modal>
    </div>
  );
}
