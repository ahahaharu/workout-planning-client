import { Button } from "antd";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { LogOut } from "lucide-react";

export default function ExitButton() {
  const { logout } = useAuth();
  return (
    <Button
      size="large"
      icon={<LogOut size={16} />}
      onClick={() => logout()}
      className="w-60 mr-3 border-indigo-200 text-indigo-600 hover:border-indigo-400 "
    >
      Выйти
    </Button>
  );
}
