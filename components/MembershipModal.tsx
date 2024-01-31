"use client";
import React, { useEffect, useState } from "react";
import { Form, Col, Row, Button, Space, Input, Modal } from "antd";

import ConfirmMembership from "./ConfirmMembership";
import RejectmMembership from "./RejectmMembership";
import MembershipSanction from "./MembershipSanction";
import MembershipUnblock from "./MembershipUnblock";
import customFetch from "@/utils/customFetch";
import { toast } from "react-toastify";
import ChangePhone from "./ChangePhone";

export default function MembershipModal({
  clickedMemberData,
  fetchMembersLists,
  closeParentModal,
}: {
  clickedMemberData?: any;
  fetchMembersLists?: () => void;
  closeParentModal?: () => void;
}) {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("ConfirmMembership");

  const [isUnblockModalOpen, setIsUnblockModalOpen] = useState(true);

  const [isEmailSending, setIsEmailSending] = useState(false);

  const setFirstValue = () => {
    form.setFieldsValue({
      subscriptionType: clickedMemberData[0].subscriptionType,
      nickName: clickedMemberData[0].name,
      loginId: clickedMemberData[0].loginId,
      id: clickedMemberData[0].id,
      name: clickedMemberData[0].name,
      gosiwonName: clickedMemberData[0].gosiwonName,
      gosiwonAddress: clickedMemberData[0].gosiwonAddress,
      phone: clickedMemberData[0].phoneNumber,
      email: clickedMemberData[0].email,
      joinDate: clickedMemberData[0].joinDate,
      lastLoginDate: clickedMemberData[0].lastLoginDate,
      situation:
        clickedMemberData[0].accountStatus === "true" ? "정상" : "정지",
      releaseReason: clickedMemberData[0].releaseReason,
      banReason: clickedMemberData[0].banReason,
      agreement: clickedMemberData[0].agreement
        ? clickedMemberData[0].agreement
        : "---",
    });
  };

  useEffect(() => {
    setFirstValue();
  }, [clickedMemberData]);

  // useEffect(() => {
  //   setFirstValue();
  // }, []);

  const showModal = (type: any) => {
    setIsModalOpen(true);
    setModalType(type);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChangePhone = async () => {
    const accessToken = localStorage.getItem("accessToken");

    const updatedPhone = form.getFieldValue("phone");

    if (!updatedPhone) {
      return toast.error("휴대폰 번호를 입력해주세요", {
        autoClose: 2000,
      });
    }

    const memberId = +clickedMemberData[0].id;

    try {
      const response = await customFetch.patch(
        `/api/v1/admins/users/phone-email/${memberId}?field=PHONE`,
        {
          data: updatedPhone,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      handleCancel();
      toast.success("휴대폰번호가 변경되었습니다", { autoClose: 2000 });
      fetchMembersLists!();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSendEmail = async () => {
    const accessToken = localStorage.getItem("accessToken");
    setIsEmailSending(true);
    try {
      const response = await customFetch.post(
        `/api/v1/admins/mail/send-password/${clickedMemberData[0].id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setIsEmailSending(false);
      fetchMembersLists;
      toast.success("임시비밀번호가 발송되었습니다", { autoClose: 2000 });
      fetchMembersLists!();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="modal-form">
      <Form colon={false} layout="horizontal" form={form}>
        <Space className="w-full" direction="vertical" size={30}>
          <Row align="middle" gutter={[67, 15]}>
            <Col md={12}>
              <Row align="middle">
                <Col md={8}>
                  <label htmlFor="">가입 유형</label>
                </Col>
                <Col md={16} style={{ height: 42 }}>
                  <Form.Item name="subscriptionType">
                    <Input placeholder="자체 기입" readOnly />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col md={12}>
              <Row align="middle">
                <Col md={5}>
                  <label htmlFor="">닉네임</label>
                </Col>
                <Col md={19} style={{ height: 42 }}>
                  <Form.Item name="nickName">
                    <Input placeholder="부평부평" readOnly />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col md={12}>
              <Row align="middle">
                <Col md={8}>
                  <label htmlFor="">ID</label>
                </Col>
                <Col md={16} style={{ height: 42 }}>
                  <Form.Item name="loginId">
                    <Input placeholder="fdpd100" readOnly />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col md={12}>
              <Row align="middle">
                <Col md={5}>
                  <label htmlFor="">이름</label>
                </Col>
                <Col md={19} style={{ height: 42 }}>
                  <Form.Item name="name">
                    <Input placeholder="이중재" readOnly />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col md={12}>
              <Row align="middle">
                <Col md={8}>
                  <label htmlFor="">고시원주소</label>
                </Col>
                <Col md={16} style={{ height: 42 }}>
                  <Form.Item name="gosiwonAddress">
                    <Input placeholder="서울특별시" readOnly />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col md={12}>
              <Row align="middle">
                <Col md={5}>
                  <label htmlFor="">고시원명</label>
                </Col>
                <Col md={19} style={{ height: 42 }}>
                  <Form.Item name="gosiwonName">
                    <Input placeholder="블랙고시원" readOnly />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col md={12}>
              <Row align="middle">
                <Col md={8}>
                  <label htmlFor="">휴대폰번호</label>
                </Col>
                <Col md={16} style={{ height: 42 }}>
                  <Space size={5} className="self-start items-start">
                    <Form.Item name="phone">
                      <Input placeholder="010-4012-1146" />
                    </Form.Item>
                    <Button
                      size="small"
                      className="ant-btn-info"
                      style={{ fontWeight: 400 }}
                      onClick={() => showModal("ChangePhone")}
                    >
                      변경
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Col>
            <Col md={12}>
              <Row align="middle">
                <Col md={5}>
                  <label htmlFor="">이메일</label>
                </Col>
                <Col md={19} style={{ height: 42 }}>
                  <Space size={5} className="self-start items-start">
                    <Form.Item name="email">
                      <Input placeholder="fdpd100@naver.com" />
                    </Form.Item>
                    <Button
                      size="small"
                      className="ant-btn-info"
                      style={{ fontWeight: 400 }}
                      onClick={() => showModal("RejectmMembership")}
                    >
                      변경
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Col>
            <Col md={12} />
            <Col md={12}>
              <div className="text-right">
                <Button
                  shape="round"
                  size="small"
                  style={{
                    padding: 0,
                    width: 120,
                    height: 32,
                    fontWeight: 400,
                  }}
                  className="ant-btn-info"
                  onClick={() => showModal("ConfirmMembership")}
                >
                  임시비밀번호 발송
                </Button>
              </div>
            </Col>
          </Row>
          <Row align="middle" gutter={[67, 15]}>
            <Col md={12}>
              <Row align="middle">
                <Col md={8}>
                  <label htmlFor="">가입일</label>
                </Col>
                <Col md={16} style={{ height: 42 }}>
                  <Form.Item name="joinDate">
                    <Input placeholder="2023-08-04" readOnly />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col md={12}>
              <Row align="middle">
                <Col md={5}>
                  <label htmlFor="">
                    최근
                    <br /> 접속일시
                  </label>
                </Col>
                <Col md={19} style={{ height: 42 }}>
                  <Form.Item name="lastLoginDate">
                    <Input
                      placeholder="2023-08-11  ㅣ  11 : 21 : 31"
                      readOnly
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Col>
            <Col md={12}>
              <Row align="middle">
                <Col md={8}>
                  <label htmlFor="">
                    마케팅
                    <br />
                    수신동의
                  </label>
                </Col>
                <Col md={16} style={{ height: 42 }}>
                  <Space size={5} className="items-start self-start">
                    <Form.Item name="agreement">
                      <Input placeholder="동의" />
                    </Form.Item>
                    <Button size="small" className="ant-btn-info">
                      변경
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Col>
            <Col md={24}>
              <Row align="middle">
                <Col md={4} style={{ marginRight: "-10px" }}>
                  <label htmlFor="">상태</label>
                </Col>
                <Col md={20} style={{ height: 42 }}>
                  <Form.Item name="situation">
                    <Input
                      style={{ width: "102%" }}
                      placeholder="정상"
                      readOnly
                    />
                  </Form.Item>
                  <Button
                    style={{
                      padding: 0,
                      width: 75,
                      height: 32,
                      position: "absolute",
                      top: "5px",
                      right: "-3px",
                      borderRadius: 100,
                      fontWeight: 400,
                    }}
                    size="small"
                    className="ant-btn-info"
                    onClick={() => showModal("MembershipSanction")}
                  >
                    제재하기
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col md={24}>
              <Row align="middle">
                <Col md={4} style={{ marginRight: "-10px" }}>
                  <label htmlFor="">사유</label>
                </Col>
                <Col md={20} style={{ height: 42 }}>
                  <Form.Item name="banReason">
                    <Input style={{ width: "102%" }} placeholder="----" />
                  </Form.Item>
                  <Button
                    style={{
                      padding: 0,
                      width: 75,
                      height: 32,
                      position: "absolute",
                      top: "5px",
                      right: "-3px",
                      borderRadius: 100,
                      fontWeight: 400,
                    }}
                    size="small"
                    className="ant-btn-info"
                    onClick={() => {
                      setIsUnblockModalOpen(true);
                      showModal("MembershipUnblock");
                    }}
                  >
                    해제하기
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Space>
      </Form>
      <Modal
        className={
          modalType === "ConfirmMembership"
            ? "custom-mini-modal"
            : modalType === "MembershipSanction"
            ? "custom-mini-modal-restriction"
            : modalType === "MembershipUnblock"
            ? "custom-mini-modal-clear"
            : "custom-mini-modal"
        }
        title=""
        footer=""
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        closable={false}
        width={
          modalType === "MembershipSanction" ||
          modalType === "MembershipUnblock"
            ? 753
            : 510
        }
        centered
      >
        <div className="px-1">
          {(modalType === "MembershipSanction" ||
            modalType === "MembershipUnblock") && (
            <Button
              className="left-icon p-0 border-0 shadow-none text-left text-[30px] leading-none mb-[40px]"
              block
              onClick={handleCancel}
            >
              <img src="/assets/images/backIcon.png" />
            </Button>
          )}
          {modalType === "ConfirmMembership" ? (
            <ConfirmMembership
              onCancel={handleCancel}
              executeFunction={handleSendEmail}
              isLoading={isEmailSending}
              special={true}
            />
          ) : modalType === "ChangePhone" ? (
            <ChangePhone
              onCancel={handleCancel}
              executeFunction={handleChangePhone}
            />
          ) : modalType === "MembershipSanction" ? (
            <MembershipSanction
              isUnblockModalOpen={isUnblockModalOpen}
              setIsUnblockModalOpen={setIsUnblockModalOpen}
              onCancel={handleCancel}
              closeParentModal={closeParentModal!}
              memberId={clickedMemberData[0].id}
              fetchMembersLists={fetchMembersLists!}
            />
          ) : modalType === "MembershipUnblock" ? (
            <MembershipUnblock
              onCancel={handleCancel}
              closeParentModal={closeParentModal!}
              memberId={clickedMemberData[0].id}
              fetchMembersLists={fetchMembersLists!}
            />
          ) : (
            <RejectmMembership
              onCancel={handleCancel}
              memberId={clickedMemberData[0].id}
              updatedEmail={form.getFieldValue("email")}
              fetchMembersLists={fetchMembersLists!}
            />
          )}
        </div>
      </Modal>
    </div>
  );
}
