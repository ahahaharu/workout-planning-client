import { Button, Form, Input, Modal, Select, Upload } from "antd";
import ImgCrop from "antd-img-crop";
const { TextArea } = Input;
import React, { useState } from "react";
import { message } from "antd";

export default function ExerciseAdditionModal({ isOpen, onClose }) {
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();

  const customUpload = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
      message.success(`${file.name} uploaded successfully`);
    }, 1000);
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

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
      title={<p>Добавление упражнения</p>}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          Добавить
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
              message: "Пожалуйста, введите название упражнения",
            },
          ]}
        >
          <Input placeholder="Название" />
        </Form.Item>

        <Form.Item label="Категория" name="category">
          <Select defaultValue={"none"}>
            <Select.Option value="none">Не указано</Select.Option>
            <Select.Option value="strength">Силовые</Select.Option>
            <Select.Option value="cardio">Кардио</Select.Option>
            <Select.Option value="endurance">Выносливость</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Часть тела" name="bodyPart">
          <Select defaultValue={"none"}>
            <Select.Option value="none">Не указано</Select.Option>
            <Select.Option value="chest">Грудь</Select.Option>
            <Select.Option value="back">Спина</Select.Option>
            <Select.Option value="biceps">Бицепс</Select.Option>
            <Select.Option value="triceps">Трицепс</Select.Option>
            <Select.Option value="shoulders">Плечи</Select.Option>
            <Select.Option value="legs">Ноги</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item label="Описание" name="description">
          <TextArea rows={3} />
        </Form.Item>

        <Form.Item label="Изображение">
          <ImgCrop rotationSlider>
            <Upload
              customRequest={customUpload}
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              maxCount={1}
            >
              {fileList.length < 1 && "+ Загрузить"}
            </Upload>
          </ImgCrop>
        </Form.Item>

        <Form.Item label="Видео YouTube" name="videoId">
          <Input placeholder="Введите URL видео" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
