import type { Metadata } from "next";
import Provider from "../components/Provider";
import "../styles/style.scss";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { ConfigProvider } from "antd";

export const metadata: Metadata = {
  title: "Who is Black",
  description: "Who is Black Admin page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <ConfigProvider
          theme={{
            token: {
              // Seed Token
              colorPrimary: "#4A4E57",
              colorInfo: "#A3A6AB",
              borderRadius: 2,
              fontFamily: "Roboto",
            },
          }}
        >
          <Provider>
            {children}
            <ToastContainer
              position="top-center"
              style={{ fontSize: "16px" }}
            />
          </Provider>
        </ConfigProvider>
      </body>
    </html>
  );
}
