import React from "react";
import { Modal, Form, Input, Button } from "antd";

export default function WeightUpdateModal({
  visible,
  onClose,
  onSubmit,
  initialValue,
}) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible && initialValue) {
      form.setFieldsValue({ weight: initialValue });
    }
  }, [visible, initialValue, form]);

  return (
    <Modal
      title="Обновить текущий вес"
      open={visible}
      onCancel={onClose}
      footer={null}
      destroyOnClose={true}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={{ weight: initialValue }}
      >
        <Form.Item
          name="weight"
          label="Новый вес (кг)"
          rules={[
            {
              required: true,
              message: "Пожалуйста, введите ваш текущий вес",
            },
            {
              type: "number",
              min: 30,
              max: 300,
              transform: (value) => Number(value),
              message: "Вес должен быть между 30 и 300 кг",
            },
          ]}
        >
          <Input type="number" />
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end space-x-2">
            <Button onClick={onClose}>Отмена</Button>
            <Button type="primary" htmlType="submit">
              Обновить
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
}
