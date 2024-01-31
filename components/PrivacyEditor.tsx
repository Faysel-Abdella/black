"use client";
import "dayjs/locale/ko";
import React, { useEffect, useRef, useState } from "react";
import { Form, Row, Button, Space, Input, Col, Flex, Select } from "antd";
import Editor from "./CKEditor";
import dynamic from "next/dynamic";
import dayjs from "dayjs";
import { toast } from "react-toastify";

// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import customFetch from "@/utils/customFetch";

import { Dayjs } from "dayjs";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import generatePicker from "antd/es/date-picker/generatePicker";
import locale from "antd/es/date-picker/locale/ko_KR";

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

export default function PrivacyEditor({
  usedOnPage,
  extraFilter,
  buttonType,
  clickedData,
  fetchDataLists,
  handleCancel,
  isFetching,
}: {
  usedOnPage: string;
  extraFilter?: boolean;
  buttonType?: any;
  clickedData?: any;
  fetchDataLists?: () => void;
  handleCancel: () => void;
  isFetching?: boolean;
}) {
  const [form] = Form.useForm();
  const Editor = dynamic(() => import("./CKEditor"), { ssr: false });

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  let editorText = "";

  const firstFilling = () => {
    if (buttonType! === "modification" && usedOnPage === "announcement") {
      form.setFieldsValue({
        title: clickedData[0].title,
        content: clickedData[0].content,
      });
      setStartDate(
        new Date(clickedData[0].startDateTime).toISOString().split("T")[0]
      );
      setEndDate(
        new Date(clickedData[0].endDateTime).toISOString().split("T")[0]
      );
    } else if (
      buttonType! === "modification" &&
      usedOnPage === "privacyPolicy"
    ) {
      form.setFieldsValue({
        title: clickedData[0].title,
        content: clickedData[0].content,
      });
    } else if (buttonType! === "modification" && usedOnPage === "term") {
      form.setFieldsValue({
        title: clickedData[0].title,
        content: clickedData[0].content,
      });
    }
  };

  useEffect(() => {
    firstFilling();
    if (buttonType == "register") {
      form.resetFields();
      setStartDate("");
      setEndDate("");
    }
  }, [clickedData, buttonType, extraFilter]);

  useEffect(() => {
    firstFilling();
    if (buttonType == "register") {
      form.resetFields();
      setStartDate("");
      setEndDate("");
    }
  }, []);

  const onChangeStartDate = (date: any, dateString: any) => {
    setStartDate(dateString);
  };

  const onChangeEndDate = (date: any, dateString: any) => {
    setEndDate(dateString);
  };

  const handleEditorChange = (data: string) => {
    editorText = data;
  };

  const handleCorrection = async () => {
    if (usedOnPage === "announcement") {
      if (!form.getFieldValue("title") || !editorText) {
        return toast.error("입력란을 확인해주세요", { autoClose: 2000 });
      }

      const title = form.getFieldValue("title");
      const startDateTime = new Date(startDate).toISOString().split("T")[0];
      const endDateTime = new Date(endDate).toISOString().split("T")[0];
      const content = editorText;

      const accessToken = localStorage.getItem("accessToken");

      if (buttonType! === "modification") {
        const id = clickedData[0].id;
        try {
          setIsLoading(true);
          const response = await customFetch.patch(
            `/api/v1/admins/post/notices/${id}`,
            {
              title: title,
              startDateTime: startDateTime,
              endDateTime: endDateTime,
              content: content,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          handleCancel();
          form.resetFields();
          setIsLoading(false);
          editorText = "";
          setStartDate("");
          setEndDate("");
          toast.success("처리가 완료되었습니다", { autoClose: 2000 });
          fetchDataLists!();
        } catch (error: any) {
          setIsLoading(false);

          toast.error(error.response.data.message, {
            autoClose: 2000,
          });
          console.log(error);
        }
      } else {
        try {
          setIsLoading(true);
          const response = await customFetch.post(
            `/api/v1/admins/post/notices`,
            {
              title: title,
              startDateTime: startDateTime,
              endDateTime: endDateTime,
              content: content,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          console.log(response);

          handleCancel();
          form.resetFields();
          setIsLoading(false);
          editorText = "";
          setStartDate("");
          setEndDate("");
          toast.success("처리가 완료되었습니다", { autoClose: 2000 });
          fetchDataLists!();
        } catch (error: any) {
          setIsLoading(false);

          toast.error(error.response.data.message, {
            autoClose: 2000,
          });
          console.log(error);
        }
      }
    } else if (usedOnPage === "privacyPolicy") {
      if (!form.getFieldValue("title") || !editorText) {
        return toast.error("입력란을 확인해주세요", { autoClose: 2000 });
      }
      const title = form.getFieldValue("title");
      const content = editorText;

      const accessToken = localStorage.getItem("accessToken");

      if (buttonType! === "modification") {
        const id = clickedData[0].id;
        try {
          setIsLoading(true);
          const response = await customFetch.patch(
            `/api/v1/admins/post/privacy-policies/${id}`,
            {
              title: title,
              content: content,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          handleCancel();
          form.resetFields();
          setIsLoading(false);
          editorText = "";
          toast.success("처리가 완료되었습니다", { autoClose: 2000 });
          fetchDataLists!();
        } catch (error: any) {
          setIsLoading(false);
          toast.error(error.response.data.message, {
            autoClose: 2000,
          });

          console.log(error);
        }
      } else {
        try {
          setIsLoading(true);
          const response = await customFetch.post(
            `/api/v1/admins/post/privacy-policies`,
            {
              title: title,
              content: content,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          handleCancel();
          form.resetFields();
          setIsLoading(false);
          editorText = "";
          toast.success("처리가 완료되었습니다", { autoClose: 2000 });
          fetchDataLists!();
        } catch (error: any) {
          setIsLoading(false);
          toast.error(error.response.data.message, {
            autoClose: 2000,
          });

          console.log(error);
        }
      }
    } else if (usedOnPage === "term") {
      if (!form.getFieldValue("title") || startDate || endDate || !editorText) {
        return toast.error("입력란을 확인해주세요", { autoClose: 2000 });
      }
      const title = form.getFieldValue("title");
      const content = editorText;

      const accessToken = localStorage.getItem("accessToken");

      if (buttonType! === "modification") {
        const id = clickedData[0].id;
        try {
          setIsLoading(true);
          const response = await customFetch.patch(
            `/api/v1/admins/post/terms/${id}`,
            {
              title: title,
              content: content,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          handleCancel();
          form.resetFields();
          setIsLoading(false);

          editorText = "";
          toast.success("처리가 완료되었습니다", { autoClose: 2000 });
          fetchDataLists!();
        } catch (error: any) {
          setIsLoading(false);
          toast.error(error.response.data.message, {
            autoClose: 2000,
          });

          console.log(error);
        }
      } else {
        console.log(title);
        console.log(content);
        try {
          setIsLoading(true);
          const response = await customFetch.post(
            `/api/v1/admins/post/terms`,
            {
              title: title,
              content: content,
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          handleCancel();
          form.resetFields();
          setIsLoading(false);

          editorText = "";
          toast.success("처리가 완료되었습니다", { autoClose: 2000 });
          fetchDataLists!();
        } catch (error: any) {
          setIsLoading(false);
          toast.error(error.response.data.message, {
            autoClose: 2000,
          });

          console.log(error);
        }
      }
    }
  };

  const isValidDateFormat = (dateString: any) => {
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    return dateFormatRegex.test(dateString);
  };

  return (
    <div className="modal-form form-inline">
      <Form layout="horizontal" form={form}>
        <Row gutter={[16, 0]}>
          <Col md={24}>
            <Form.Item
              name="title"
              label="제목"
              rules={[{ required: true, message: "제목을 입력해주세요" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          {extraFilter ? (
            <Col md={24}>
              <Form.Item
                name="period"
                label="노출기간"
                rules={[{ required: true, message: "노출기간을 입력해주세요" }]}
              >
                <Space>
                  <Space.Compact block>
                    <div className="border-cyan-900">
                      <DatePicker
                        locale={locale}
                        className="h-[41px] border-cyan-600 rounded-xl"
                        onChange={onChangeStartDate}
                        value={
                          buttonType! === "modification" && startDate == ""
                            ? dayjs(
                                new Date(clickedData[0].startDateTime)
                                  .toISOString()
                                  .split("T")[0]
                              )
                            : startDate == ""
                            ? null
                            : dayjs(startDate)
                        }
                        placeholder="변경"
                      />
                    </div>

                    {/* <Form.Item
                      name="startDateTime"
                      rules={[{ required: true }]}
                      className="m-0"
                      style={{ width: "calc(100% - 74px)" }}
                    >
                      <Input />
                    </Form.Item>
                    <Button size="small" className="ant-btn-info">
                      변경
                    </Button> */}
                  </Space.Compact>
                  {/* <Select
                    defaultValue="lucy"
                    style={{ width: 70 }}
                    options={[
                      { value: "jack", label: "21" },
                      { value: "lucy", label: "22" },
                    ]}
                  />
                  <p>시</p>
                  <Select
                    defaultValue="lucy"
                    style={{ width: 70 }}
                    options={[
                      { value: "jack", label: "21" },
                      { value: "lucy", label: "22" },
                    ]}
                  /> */}
                  <p className="whitespace-nowrap"> ~ </p>
                  <Space.Compact block>
                    <div className="border-cyan-900">
                      <DatePicker
                        locale={locale}
                        className="h-[41px] border-cyan-600 rounded-xl"
                        onChange={onChangeEndDate}
                        value={
                          buttonType! === "modification" && endDate == ""
                            ? dayjs(
                                new Date(clickedData[0].endDateTime)
                                  .toISOString()
                                  .split("T")[0]
                              )
                            : endDate == ""
                            ? null
                            : dayjs(endDate)
                        }
                        placeholder="변경"
                      />
                    </div>
                    {/* <Form.Item
                      name="endDateTime"
                      rules={[{ required: true }]}
                      className="m-0"
                      style={{ width: "calc(100% - 74px)" }}
                    >
                      <Input />
                    </Form.Item>
                    <Button size="small" className="ant-btn-info">
                      변경
                    </Button> */}
                  </Space.Compact>
                  {/* <Select
                    defaultValue="lucy"
                    style={{ width: 70 }}
                    options={[
                      { value: "jack", label: "21" },
                      { value: "lucy", label: "22" },
                    ]}
                  />
                  <p>시</p>
                  <Select
                    defaultValue="lucy"
                    style={{ width: 70 }}
                    options={[
                      { value: "jack", label: "21" },
                      { value: "lucy", label: "22" },
                    ]}
                  />
                  <p>분</p> */}
                </Space>
              </Form.Item>
            </Col>
          ) : (
            ""
          )}
          <Col md={24}>
            <Form.Item
              name="content"
              label="내용"
              rules={[{ required: true, message: "내용을 입력해주세요" }]}
            >
              {/* <Editor onChange={handleEditorChange} /> */}
              <Editor
                // editor={ClassicEditor}

                onChange={handleEditorChange}
                buttonType={buttonType}
                clickedDataContent={
                  clickedData
                    ? clickedData[0]
                      ? clickedData[0].content
                        ? clickedData[0].content
                        : " "
                      : " "
                    : " "
                }
              />
            </Form.Item>
          </Col>
        </Row>
        <Flex gap="middle" align="center" justify="center" className="mt-8">
          <Button
            className="ant-btn ant-btn-info"
            disabled={isLoading}
            onClick={handleCorrection}
          >
            {isLoading ? (
              <div
                className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-slate-50 rounded-full"
                role="status"
                aria-label="loading"
              ></div>
            ) : buttonType === "register" ? (
              "등록"
            ) : (
              "수정"
            )}
          </Button>
          <Button onClick={handleCancel} className="ant-btn ant-btn-info">
            닫기
          </Button>
        </Flex>
      </Form>
    </div>
  );
}
