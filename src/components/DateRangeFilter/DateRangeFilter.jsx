import React from "react";
import { DatePicker, Button, Tooltip } from "antd";
import { CalendarOutlined, ReloadOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

export default function DateRangeFilter({ value, onChange, onReset }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <CalendarOutlined className="mr-2" />
          <span className="mr-2">Период:</span>
          <RangePicker
            value={value}
            onChange={onChange}
            allowClear={true}
            format="DD.MM.YYYY"
          />
        </div>
        <Tooltip title="Сбросить фильтр">
          <Button
            icon={<ReloadOutlined />}
            onClick={onReset}
            disabled={!value[0] && !value[1]}
          >
            Сбросить
          </Button>
        </Tooltip>
      </div>
    </div>
  );
}
