import { Button, Divider, Form, Input, Modal } from "antd";
const { TextArea } = Input;
import React from "react";

export default function WorkoutPlanAdditionModal({ isOpen, onClose }) {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const formData = {
      ...values,
      image:
        fileList.length > 0 ? fileList[0].thumbUrl || fileList[0].url : null,
    };
    console.log("Form submitted:", formData);
    message.success("Упражнение добавлено");

    form.resetFields();
    setFileList([]);
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
          <TextArea rows={3} />
        </Form.Item>
      </Form>
      <Divider />
      <div className="w-full flex justify-center mb-5">
        <Button type="primary">Добавить упражнение</Button>
      </div>
    </Modal>
  );
}
