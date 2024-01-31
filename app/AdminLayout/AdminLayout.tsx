// import '../../../styles/style.scss'

const AdminLayout = ({ children }: {children: React.ReactNode}) => (
  <div className='admin-auth'>
    <main>
      {children}
    </main>
  </div>
)

export default AdminLayout