"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import adminLogo from "../public/assets/images/adminLogo.png";
import { Button } from "antd";
import { usePathname } from "next/navigation";

export default function Home() {
  const router = usePathname();
  const staticMenuItems = [
    {
      label: "홈",
      menuItem: [
        { label: "대시보드", path: "/" },
        { label: "종합지표", path: "/indicator" },
      ],
    },
    {
      label: "회원 관리",
      menuItem: [
        { label: "회원관리", path: "/membership-management" },
        { label: "회원 제재", path: "/membership" },
      ],
    },
    {
      label: "블랙리스트 관리",
      menuItem: [
        { label: "등록관리", path: "/registration" },
        { label: "승인요청 관리", path: "/approval-request" },
        // { label: "이의신청 관리", path: "/appeal-management" },
      ],
    },
    {
      label: "계정 관리",
      menuItem: [
        { label: "계정관리", path: "/account" },
        { label: "비밀번호 불일치 관리", path: "/password-management" },
      ],
    },
    {
      label: "공지 관리",
      menuItem: [
        { label: "공지사항", path: "/announcement" },
        { label: "FAQ 관리", path: "/faq" },
        { label: "1:1 문의하기", path: "/contact" },
      ],
    },
    {
      label: "약관 관리",
      menuItem: [
        { label: "개인정보 처리방침", path: "/privacy-policy" },
        { label: "이용약관", path: "/term-of-use" },
      ],
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <Image
          src={adminLogo}
          width={86}
          height={59}
          alt="logo"
          className="mx-auto"
        />
      </div>
      <div className="sidebar-body">
        <ul>
          {staticMenuItems.map((menuItems) => (
            <li key={menuItems.label}>
              <h3 className="text-[20px] font-bold">{menuItems.label}</h3>
              <ul>
                {menuItems.menuItem.map((item) => (
                  <li
                    key={item.path}
                    className={router === item.path ? "active" : ""}
                  >
                    <Link href={item.path}>{item.label}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
      <div className="sidebar-footer">
        <Button
          style={{
            width: 184,
            height: 39,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          type="primary"
          shape="round"
          block
          href="/login"
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
