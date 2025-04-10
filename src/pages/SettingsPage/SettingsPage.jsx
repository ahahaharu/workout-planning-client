import React from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import { Button } from "antd";
import { useTheme } from "../../context/ThemeContext";

export default function SettingsPage() {
  const { toggleTheme } = useTheme();
  return (
    <PageLayout title="Настройки">
      <Button onClick={() => toggleTheme("dark")}>Тема</Button>
    </PageLayout>
  );
}
