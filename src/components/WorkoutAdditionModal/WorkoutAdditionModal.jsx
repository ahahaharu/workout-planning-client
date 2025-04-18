import { Button, Divider, Form, Modal } from "antd";
import React from "react";

export default function WorkoutAdditionModal({ isOpen, onClose }) {
  const [form] = Form.useForm();

  const handleSubmit = (values) => {
    const formData = {
      ...values,
      image:
        fileList.length > 0 ? fileList[0].thumbUrl || fileList[0].url : null,
    };
    console.log("Form submitted:", formData);
    message.success("Тренировка записана");

    form.resetFields();
    setFileList([]);
    onClose();
  };
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
