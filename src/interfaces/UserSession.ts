export interface UserSession {
  email: string;
  alias: string;
  clinicName: string;
  role: string;
  permissions: string[];
  menuItems: {
    label: string;
    href?: string;
    onClick?: (e: React.MouseEvent) => void;
  }[];
  loginTime: string;
}
