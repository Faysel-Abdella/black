// import '../../../styles/style.scss'
import Sidebar from "../../components/Sidebar";

const DefaultLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="main-dashboard">
    <Sidebar />
    <main>
      {/* 임시 테스트로 빼놓은 패딩값 2xl:px-20 */}
      <div className="container flex flex-col min-h-screen py-[56px]">
        {children}
      </div>
    </main>
  </div>
);

export default DefaultLayout;
