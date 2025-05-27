import React from "react";
import { Card, Empty, Spin, Statistic, Row, Col, Divider } from "antd";
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  TrophyOutlined,
  FireOutlined,
  DashboardOutlined,
  FieldTimeOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import DateRangeFilter from "../DateRangeFilter/DateRangeFilter";

export default function WorkoutStatistics({
  stats,
  loading,
  dateRange,
  onDateRangeChange,
  onDateRangeReset,
  formatDate,
  formatDuration,
}) {
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  if (!stats || !stats.workoutsByDate || stats.workoutsByDate.length === 0) {
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
                ? "Нет данных о тренировках в выбранном диапазоне дат"
                : "Нет данных о тренировках"
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
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
        <Row gutter={16}>
          <Col span={6}>
            <Statistic
              title="Всего тренировок"
              value={stats.workoutsByDate.length}
              prefix={<TrophyOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Общий вес"
              value={stats.workoutsByDate.reduce(
                (sum, workout) => sum + (workout.totalWeight || 0),
                0
              )}
              suffix="кг"
              prefix={<FireOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Общая дистанция"
              value={stats.workoutsByDate
                .reduce((sum, workout) => sum + (workout.totalDistance || 0), 0)
                .toFixed(1)}
              suffix="км"
              prefix={<DashboardOutlined />}
            />
          </Col>
          <Col span={6}>
            <Statistic
              title="Общее время"
              value={formatDuration(
                stats.workoutsByDate.reduce(
                  (sum, workout) => sum + (workout.totalDuration || 0),
                  0
                )
              )}
              prefix={<FieldTimeOutlined />}
            />
          </Col>
        </Row>

        {stats.workoutsByDate.length > 1 && (
          <div className="mt-4">
            <Divider>Прогресс</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Прогресс веса"
                  value={Math.abs(stats.totalWeightProgress).toFixed(1)}
                  suffix="кг"
                  valueStyle={{
                    color:
                      stats.totalWeightProgress < 0 ? "#cf1322" : "#3f8600",
                  }}
                  prefix={
                    stats.totalWeightProgress < 0 ? (
                      <ArrowDownOutlined />
                    ) : (
                      <ArrowUpOutlined />
                    )
                  }
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Дистанция"
                  value={Math.abs(stats.totalDistanceProgress).toFixed(1)}
                  suffix="км"
                  valueStyle={{
                    color:
                      stats.totalDistanceProgress >= 0 ? "#3f8600" : "#cf1322",
                  }}
                  prefix={
                    stats.totalDistanceProgress >= 0 ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )
                  }
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Время"
                  value={formatDuration(Math.abs(stats.totalDurationProgress))}
                  valueStyle={{
                    color:
                      stats.totalDurationProgress >= 0 ? "#3f8600" : "#cf1322",
                  }}
                  prefix={
                    stats.totalDurationProgress >= 0 ? (
                      <ArrowUpOutlined />
                    ) : (
                      <ArrowDownOutlined />
                    )
                  }
                />
              </Col>
            </Row>
          </div>
        )}
      </Card>

      <Card className="mb-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={stats.workoutsByDate.map((item) => ({
                date: formatDate(new Date(item.date)),
                вес: item.totalWeight || 0,
                дистанция: item.totalDistance || 0,
                время: item.totalDuration || 0,
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <ChartTooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="вес"
                fill="#8884d8"
                name="Вес (кг)"
              />
              <Bar
                yAxisId="right"
                dataKey="дистанция"
                fill="#82ca9d"
                name="Дистанция (км)"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </>
  );
}
