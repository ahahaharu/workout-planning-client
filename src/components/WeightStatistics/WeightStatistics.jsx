import React from "react";
import { Card, Empty, Button, Spin } from "antd";
import {
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
} from "recharts";
import DateRangeFilter from "../DateRangeFilter/DateRangeFilter";

export default function WeightStatistics({
  stats,
  loading,
  dateRange,
  onDateRangeChange,
  onDateRangeReset,
  onAddWeight,
  currentUser,
  formatDate,
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!stats || !stats.dateWeights || stats.dateWeights.length === 0) {
    return (
      <>
        <DateRangeFilter
          value={dateRange}
          onChange={onDateRangeChange}
          onReset={onDateRangeReset}
        />
        <Card>
          <Empty
            description={
              dateRange[0] || dateRange[1]
                ? "Нет данных о весе в выбранном диапазоне дат"
                : "Нет данных о весе"
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
          <div className="flex justify-center mt-4">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAddWeight}
            >
              Добавить запись о весе
            </Button>
          </div>
        </Card>
      </>
    );
  }

  return (
    <>
      <DateRangeFilter
        value={dateRange}
        onChange={onDateRangeChange}
        onReset={onDateRangeReset}
      />

      <Card className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">
              Текущий вес: {currentUser.currentWeight} кг
            </h1>
            {stats.dateWeights.length > 1 && (
              <p className="text-gray-500 flex items-center mt-2">
                {stats.userWeightProgress > 0 ? (
                  <ArrowUpOutlined style={{ color: "#cf1322" }} />
                ) : (
                  <ArrowDownOutlined style={{ color: "#3f8600" }} />
                )}
                <span className="ml-1">
                  {Math.abs(stats.userWeightProgress).toFixed(1)} кг с{" "}
                  {formatDate(stats.dateWeights[0].date)}
                </span>
                {dateRange[0] && dateRange[1] && " (в выбранном периоде)"}
              </p>
            )}
          </div>
          <Button type="primary" size="large" onClick={onAddWeight}>
            Обновить вес
          </Button>
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={stats.dateWeights.map((item) => ({
                date: formatDate(item.date),
                weight: item.weight,
              }))}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
              <ChartTooltip formatter={(value) => [`${value} кг`, "Вес"]} />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#818cf8"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  );
}
