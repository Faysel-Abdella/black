interface AdminType {
  permissions: string[];
  id: number;
  loginId: string;
  password: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  allowedIp: string | null;
  failedLoginCount: number;
  lastLoginDate: string;
  createdAt: string;
  updateedAt: string;
  author: {
    permissions: string[];
    id: number;
    loginId: string;
    password: string;
    name: string;
    department: string;
    email: string;
    phone: string;
    allowedIp: string | null;
    failedLoginCount: number;
    lastLoginDate: string;
    createdAt: string;
    updateedAt: string;
  };
}

