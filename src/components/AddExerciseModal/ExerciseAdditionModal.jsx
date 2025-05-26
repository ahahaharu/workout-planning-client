import { Button, Form, Input, Modal, Select, Upload, message } from "antd";
import ImgCrop from "antd-img-crop";
const { TextArea } = Input;
import React, { useState, useEffect } from "react";

export default function ExerciseAdditionModal({ 
  isOpen, 
  onClose, 
  onAddExercise, 
  exerciseTypes, 
  isEditMode = false, 
  initialData = null 
}) {
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    if (isOpen) {
      form.resetFields();
      setFileList([]);
      
      if (isEditMode && initialData) {
        form.setFieldsValue({
          name: initialData.name,
          category: initialData.category,
          description: initialData.description,
          videoId: initialData.videoId,
          bodyPart: initialData.bodyPart,
          cardioType: initialData.cardioType,
          targetMuscle: initialData.targetMuscle,
        });
        
        setSelectedCategory(initialData.category);
        
        // Добавляем изображение, если оно есть
        if (initialData.image) {
          setFileList([
            {
              uid: '-1',
              name: 'image.png',
              status: 'done',
              url: initialData.image,
              thumbUrl: initialData.image,
            },
          ]);
        }
      } else {
        setSelectedCategory(null);
      }
    }
  }, [isOpen, form, initialData, isEditMode]);

  const customUpload = ({ file, onSuccess }) => {
    setTimeout(() => {
      onSuccess("ok");
    }, 500);
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
      image: fileList.length > 0 ? fileList[0].thumbUrl || fileList[0].url : null,
    };
    
    // Если это режим редактирования, добавляем ID
    if (isEditMode && initialData) {
      formData.id = initialData.id;
    }
    
    // Проверка обязательных полей
    if (!formData.name) {
      message.error("Пожалуйста, введите название упражнения");
      return;
    }
    
    if (!formData.category) {
      message.error("Пожалуйста, выберите категорию упражнения");
      return;
    }
    
    // Для силовых упражнений требуется указать часть тела
    if (formData.category === exerciseTypes.STRENGTH && !formData.bodyPart) {
      message.error("Для силовых упражнений необходимо указать часть тела");
      return;
    }
    
    // Вызываем колбэк для добавления/обновления упражнения
    onAddExercise(formData);
    
    // Сбрасываем форму и закрываем модальное окно
    form.resetFields();
    setFileList([]);
    onClose();
  };

  return (
    <Modal
      title={<p>{isEditMode ? "Редактирование упражнения" : "Добавление упражнения"}</p>}
      open={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Отмена
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {isEditMode ? "Сохранить" : "Добавить"}
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

        <Form.Item 
          label="Категория" 
          name="category"
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите категорию",
            },
          ]}
        >
          <Select 
            placeholder="Выберите категорию"
            onChange={(value) => setSelectedCategory(value)}
            disabled={isEditMode} // Запрещаем менять категорию при редактировании
          >
            <Select.Option value={exerciseTypes.STRENGTH}>Силовые</Select.Option>
            <Select.Option value={exerciseTypes.CARDIO}>Кардио</Select.Option>
            <Select.Option value={exerciseTypes.ENDURANCE}>Выносливость</Select.Option>
          </Select>
        </Form.Item>

        {(selectedCategory === exerciseTypes.STRENGTH) && (
          <Form.Item 
            label="Часть тела" 
            name="bodyPart"
            rules={[
              {
                required: true,
                message: "Пожалуйста, выберите часть тела",
              },
            ]}
          >
            <Select placeholder="Выберите часть тела">
              <Select.Option value="chest">Грудь</Select.Option>
              <Select.Option value="back">Спина</Select.Option>
              <Select.Option value="biceps">Бицепс</Select.Option>
              <Select.Option value="triceps">Трицепс</Select.Option>
              <Select.Option value="shoulders">Плечи</Select.Option>
              <Select.Option value="legs">Ноги</Select.Option>
            </Select>
          </Form.Item>
        )}

        {(selectedCategory === exerciseTypes.CARDIO) && (
          <Form.Item label="Тип кардио" name="cardioType">
            <Select placeholder="Выберите тип кардио">
              <Select.Option value="running">Бег</Select.Option>
              <Select.Option value="cycling">Велосипед</Select.Option>
              <Select.Option value="swimming">Плавание</Select.Option>
              <Select.Option value="jumping">Прыжки</Select.Option>
              <Select.Option value="rowing">Гребля</Select.Option>
            </Select>
          </Form.Item>
        )}

        {(selectedCategory === exerciseTypes.ENDURANCE) && (
          <Form.Item label="Целевая мышца" name="targetMuscle">
            <Select placeholder="Выберите целевую мышцу">
              <Select.Option value="abs">Пресс</Select.Option>
              <Select.Option value="back">Спина</Select.Option>
              <Select.Option value="arms">Руки</Select.Option>
              <Select.Option value="legs">Ноги</Select.Option>
              <Select.Option value="general">Общая</Select.Option>
            </Select>
          </Form.Item>
        )}

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
