import { Button, Divider, Form, Modal } from "antd";
import React from "react";

export default function WorkoutAdditionModal({ isOpen, onClose }) {
  const [form] = Form.useForm();

  return (
    <Modal
      title={<p>Запись тренировки</p>}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Отмена
        </Button>,
        // <Button key="submit" type="primary" onClick={() => form.submit()}>
        //   Записать тренировку
        // </Button>,
      ]}
    >
      <div className="flex flex-col gap-3 my-5">
        <Button type="primary" size="large">
          Выбрать план тренировки
        </Button>
        <Button size="large">Начать пустую тренировку</Button>
      </div>
    </Modal>
  );
}
