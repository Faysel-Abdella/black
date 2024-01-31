import { useState, useEffect } from "react";
import "dayjs/locale/ko";
import {
  Form,
  Row,
  Button,
  Radio,
  Input,
  Col,
  Flex,
  Space,
  Select,
} from "antd";
import { toast } from "react-toastify";
import dayjs from "dayjs";

import { Dayjs } from "dayjs";
import dayjsGenerateConfig from "rc-picker/lib/generate/dayjs";
import generatePicker from "antd/es/date-picker/generatePicker";
import locale from "antd/es/date-picker/locale/ko_KR";

import customFetch from "@/utils/customFetch";
import Image from "next/image";

import Sample1 from "../public/assets/images/smaple-1.png";
import Sample2 from "../public/assets/images/smaple-2.png";
import Sample3 from "../public/assets/images/smaple-3.png";
import Sample4 from "../public/assets/images/smaple-4.png";

const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);

interface MembershipProps {
  onCancel: () => void;
  clickedBlackListData?: any;
  fetchBlackLists?: () => void;
  isForRegister?: boolean;
}

export default function Membership({
  onCancel,
  clickedBlackListData,
  fetchBlackLists,
  isForRegister,
}: MembershipProps) {
  const [form] = Form.useForm();
  const { TextArea } = Input;

  const [availableTypes, setAvailableTypes] = useState([]);

  const [damageDate, setDamageDate] = useState("");

  const [firstDamageType, setFirstDamageType] = useState<string | null>("");

  const onChangeDamageDate = (date: any, dateString: any) => {
    setDamageDate(dateString);
  };

  const [selectedFiles, setSelectedFiles] = useState<any>([]);

  const [deleteImages, setDeleteImages] = useState<any>([]);

  const baseURL = "http://3.36.125.85:3000";

  useEffect(() => {
    if (clickedBlackListData && clickedBlackListData[0]) {
      setSelectedFiles(
        clickedBlackListData[0].files.map((file: any, index: number) => ({
          name: `첨부한 사진${index + 1}${file.slice(file.lastIndexOf("."))}`, // 파일 확장자 유지
          url: file,
          isNew: false,
        }))
      );
    }
  }, [clickedBlackListData]);

  const handleFileChange = (event: any) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files).map(
        (file: any, index: number) => ({
          file,
          name: `첨부한 사진${
            selectedFiles.length + index + 1
          }${file.name.slice(file.name.lastIndexOf("."))}`, // 파일 확장자 유지
          isNew: true,
        })
      );
      setSelectedFiles((prevFiles: any) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (fileIndex: any) => {
    setSelectedFiles((prevFiles: any) =>
      prevFiles.filter((_: any, index: any) => index !== fileIndex)
    );
    const fileToRemove = selectedFiles[fileIndex];
    if (!fileToRemove.isNew) {
      setDeleteImages((prevDeleteImages: any) => [
        ...prevDeleteImages,
        fileToRemove.url,
      ]);
    }
  };

  const renderFileList = () => {
    return selectedFiles.map((file: any, index: any) => (
      <button
        key={index}
        className="border border-gray-300 mr-2 px-2 my-1"
        onClick={() => handleRemoveFile(index)}
      >
        {file.name}
      </button>
    ));
  };

  const getAvailableTypes = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await customFetch.get(
        `/api/v1/admins/blacks/damagetypes`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const types = response.data;

      const transformedTypes = types.map((type: any) => ({
        value: type.name,
        label: type.name,
      }));

      setAvailableTypes(transformedTypes);
    } catch (error: any) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!isForRegister) {
      console.log(isForRegister);
      setFirstDamageType("먹튀");
    } else {
      console.log(isForRegister);
      setFirstDamageType("");
      setSelectedFiles([]);
    }
  }, [isForRegister]);

  useEffect(() => {
    // console.log(isForRegister);
    // console.log(clickedBlackListData[0]);
    getAvailableTypes();

    if (!isForRegister) {
      console.log(clickedBlackListData[0]);
      form.setFieldsValue({
        name: clickedBlackListData[0].consumerName,
        phone: clickedBlackListData[0].consumerNumber,
        birth: clickedBlackListData[0].consumerDOB,
        // type: clickedBlackListData[0].damageType,
        date: clickedBlackListData[0].damageDate,
        description: clickedBlackListData[0].damageContent,
      });
      setDamageDate(clickedBlackListData[0].damageDate);
    } else {
      form.resetFields();
      setDamageDate("");
      setSelectedFiles([]);
    }
  }, [clickedBlackListData, isForRegister]);

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "multipart/form-data",
    };

    try {
      const formData = new FormData();

      selectedFiles.forEach((file: any) => {
        if (file.isNew) {
          formData.append("files", file.file);
        }
      });

      // 삭제할 이미지 경로를 formData에 추가
      deleteImages.forEach((imagePath: any) => {
        formData.append("deleteImages", imagePath);
      });

      console.log("PASSED");

      formData.append("name", form.getFieldValue("name"));
      formData.append("phone", form.getFieldValue("phone"));
      formData.append("birth", form.getFieldValue("birth"));
      formData.append("damageDate", damageDate);
      formData.append("damageContent", form.getFieldValue("description"));
      formData.append("damageTypeId", "1");

      console.log(formData.keys);

      if (isForRegister) {
        const response = await customFetch.post(
          `/api/v1/admins/blacks`,
          formData,
          {
            headers,
          }
        );

        console.log(response);
      } else {
        const response = await customFetch.patch(
          `/api/v1/admins/blacks/${clickedBlackListData[0].id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        console.log(response);
      }

      onCancel();
      form.resetFields();
      toast.success("처리가 완료되었습니다.", { autoClose: 2000 });
      fetchBlackLists!();
    } catch (error: any) {
      toast.error(
        error.response.data.message.isArray
          ? error.response.data.message[0]
          : error.response.data.message
      );
      console.error(error);
    }
  };

  const renderImages = () => {
    // files 배열에 항목이 있는지 확인합니다.
    if (
      clickedBlackListData[0].files &&
      clickedBlackListData[0].files.length > 0
    ) {
      return clickedBlackListData[0].files.map((file: any, index: any) => (
        <Col key={index} flex="20%">
          <Image
            src={`${baseURL}${file}`} // 전체 URL 생성
            alt={`첨부 이미지 ${index + 1}`}
            style={{ width: "100%" }}
            width={86}
            height={86}
          />
        </Col>
      ));
    } else {
      // 파일이 없는 경우 표시할 메시지
      return <p>첨부된 사진이 없습니다.</p>;
    }
  };

  return (
    <>
      {isForRegister ? (
        <div className="modal-form form-inline">
          <Form colon={false} layout="horizontal" form={form}>
            <Row gutter={[16, 0]}>
              <Col md={24}>
                <h2 className="text-[20px] font-normal ">
                  블랙컨슈머 필수 입력 정보
                </h2>
              </Col>
              <Col md={24}>
                <h2 className="text-[14px] mb-4 mt-[8px] text-[#A3A6AB]">
                  블랙컨슈머 이름, 휴대폰번호, 생년월일 중 2개 이상의 정보를
                  입력해주세요
                </h2>
              </Col>
              <Col md={24}>
                <Form.Item
                  className="custom-label-margin"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  name="name"
                  label={
                    <span style={{ textAlign: "left" }}>
                      이름
                      <span className="required-asterisk ml-1 text-red-500">
                        *
                      </span>
                    </span>
                  }
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col md={24}>
                <Form.Item
                  className="custom-label-margin"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  name="phone"
                  label={
                    <span style={{ textAlign: "left" }}>
                      휴대폰번호
                      <span className="required-asterisk ml-1 text-red-500">
                        *
                      </span>
                    </span>
                  }
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col md={24}>
                <Form.Item
                  className="custom-label-margin"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  name="birth"
                  label={
                    <span style={{ textAlign: "left" }}>
                      생년월일
                      <span className="required-asterisk ml-1 text-red-500">
                        *
                      </span>
                    </span>
                  }
                >
                  <Input />
                </Form.Item>
              </Col>

              <Col md={24}>
                <h2 className="text-[20px] font-normal mt-[30px] mb-[15px]">
                  피해 정보
                </h2>
              </Col>

              <Col md={12}>
                <Form.Item
                  className="custom-label-margin"
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="damageType"
                  label={
                    <span style={{ textAlign: "left" }}>
                      피해 유형
                      <span className="required-asterisk ml-1 text-red-500">
                        *
                      </span>
                    </span>
                  }
                >
                  <Select
                    style={{ height: 42, borderRadius: 5 }}
                    placeholder="피해 유형 선택"
                    options={availableTypes}
                    defaultValue={firstDamageType}
                  />
                </Form.Item>
              </Col>
              <Col md={12}>
                <Form.Item
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  name="dateInput"
                  label={
                    <span style={{ marginLeft: 8, textAlign: "left" }}>
                      피해발생일
                      <span className="required-asterisk ml-1 text-red-500">
                        *
                      </span>
                    </span>
                  }
                  className="m-0 custom-label-margin"
                >
                  <Space>
                    <div className="flex">
                      <DatePicker
                        locale={locale}
                        className="h-[41px] border-cyan-600 rounded-xl"
                        onChange={onChangeDamageDate}
                        value={
                          !isForRegister && damageDate == ""
                            ? dayjs(
                                new Date(clickedBlackListData[0].damageDate)
                                  .toISOString()
                                  .split("T")[0]
                              )
                            : damageDate == ""
                            ? null
                            : dayjs(damageDate)
                        }
                        placeholder="변경"
                      />
                      {/* <Form.Item name="date">
                    <Input />
                  </Form.Item>
                  <Button
                    size="small"
                    className="ant-btn-info ml-2 font-normal"
                  >
                    변경
                  </Button> */}
                    </div>
                  </Space>
                </Form.Item>
              </Col>
              <Col md={24}>
                <Form.Item
                  className="custom-mini-modal-form"
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  name="description"
                  label="피해 내용"
                >
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
              <Col md={24}>
                <Form.Item
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  name="files"
                  label="사진첨부"
                  className="m-0"
                >
                  <Space style={{ display: "block" }}>
                    <div className="flex justify-center items-center">
                      <div
                        className=" flex items-center w-full min-h-[42px] h-auto border border-gray-300 rounded pl-2"
                        style={{ flexWrap: "wrap" }}
                      >
                        {renderFileList()}
                      </div>
                      <label
                        htmlFor="file-upload"
                        className="ant-btn ant-btn-info py-2 px-2 ml-2 cursor-pointer"
                      >
                        <p style={{ whiteSpace: "nowrap" }}>파일 선택</p>
                        <input
                          id="file-upload"
                          type="file"
                          multiple
                          style={{ display: "none" }}
                          onChange={handleFileChange}
                        />
                      </label>
                      {/* <Button size="small" className="ant-btn-info ml-2">
                    파일 선택
                  </Button> */}
                    </div>
                  </Space>
                </Form.Item>
              </Col>
            </Row>
            <Flex
              gap="middle"
              align="center"
              justify="center"
              className="mt-10"
            >
              <Button onClick={handleSubmit} className="ant-btn ant-btn-info">
                등록
              </Button>
              <Button className="ant-btn ant-btn-info" onClick={onCancel}>
                취소
              </Button>
            </Flex>
          </Form>
        </div>
      ) : (
        <div className="modal-form">
          <Form colon={false} layout="horizontal" form={form}>
            <Row gutter={[10, 0]}>
              <Col md={24}>
                <Form.Item
                  style={{ marginBottom: 13 }}
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 20 }}
                  name="name"
                  label={
                    <span style={{ textAlign: "left" }}>
                      블랙컨슈머
                      <span className="required-asterisk ml-1 text-red-500">
                        *
                      </span>
                      <p>이름</p>
                    </span>
                  }
                >
                  <Input readOnly style={{ marginLeft: 20 }} name="name" />
                </Form.Item>
              </Col>
              <Col md={24}>
                <Form.Item
                  style={{ marginBottom: 13 }}
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 20 }}
                  name="phone"
                  label={
                    <span style={{ textAlign: "left" }}>
                      블랙컨슈머
                      <span className="required-asterisk ml-1 text-red-500">
                        *
                      </span>
                      <p>휴대폰번호</p>
                    </span>
                  }
                >
                  <Input readOnly style={{ marginLeft: 20 }} name="phone" />
                </Form.Item>
              </Col>
              <Col md={24}>
                <Form.Item
                  style={{ marginBottom: 13 }}
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 20 }}
                  name="birth"
                  label={
                    <span style={{ textAlign: "left" }}>
                      블랙컨슈머
                      <span className="required-asterisk ml-1 text-red-500">
                        *
                      </span>
                      <p>생년월일</p>
                    </span>
                  }
                >
                  <Input readOnly style={{ marginLeft: 20 }} name="birth" />
                </Form.Item>
              </Col>
              <Col md={24}>
                <Form.Item
                  style={{ marginBottom: 13 }}
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 20 }}
                  name="date"
                  label={
                    <span style={{ textAlign: "left" }}>
                      피해발생일
                      <span className="required-asterisk ml-1 text-red-500">
                        *
                      </span>
                    </span>
                  }
                >
                  <Input
                    readOnly
                    style={{ marginLeft: 20 }}
                    name="dateOfDamage"
                  />
                </Form.Item>
              </Col>

              <Col md={24}>
                <Form.Item
                  style={{ marginBottom: 13 }}
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 20 }}
                  name="description"
                  label={
                    <span style={{ textAlign: "left", marginRight: 5 }}>
                      피해 내용
                      <span className="required-asterisk ml-1 text-red-500">
                        *
                      </span>
                    </span>
                  }
                >
                  <TextArea
                    readOnly
                    style={{ marginLeft: 20, resize: "none" }}
                    rows={4}
                    className="h-52"
                    name="description"
                  />
                </Form.Item>
              </Col>
              <Col md={24}>
                <Form.Item
                  style={{ marginBottom: 13 }}
                  labelCol={{ span: 2 }}
                  wrapperCol={{ span: 20 }}
                  name="note"
                  label="사진첨부"
                >
                  <div
                    style={{ marginLeft: 47 }}
                    className="block w-full border border-primary p-3 rounded-[5px]"
                  >
                    <Row gutter={[10, 10]}>{renderImages()}</Row>
                  </div>
                  {/* <TextArea rows={4} className='h-52' /> */}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      )}
    </>
  );
}
