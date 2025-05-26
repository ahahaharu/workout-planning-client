import { Button, Divider, Form, Input, Modal, message } from "antd";
const { TextArea } = Input;
import React from "react";

export default function WorkoutPlanAdditionModal({ isOpen, onClose, onAddWorkoutPlan }) {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    if (!values.name) {
      message.error("Пожалуйста, введите название плана тренировки");
      return;
    }
    
    if (onAddWorkoutPlan) {
      onAddWorkoutPlan(values);
    }
    
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={<p>Добавление программы тренировок</p>}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Создать программу
        </Button>,
      ]}
    >
      <Form
        form={form}
        labelCol={{ span: 7 }}
        wrapperCol={{ span: 14 }}
        layout="horizontal"
        onFinish={handleSubmit}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Наименование"
          name="name"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите название плана тренировки",
            },
          ]}
        >
          <Input placeholder="Название" />
        </Form.Item>

        <Form.Item label="Описание" name="description">
          <TextArea rows={3} placeholder="Описание программы тренировок" />
        </Form.Item>
      </Form>
    </Modal>
  );
}