import React, { useState } from "react";
import PageLayout from "../../components/PageLayout/PageLayout";
import CategoryFilter from "../../components/CategoryFilter/CategoryFilter";
import image from "../../assets/image.png";
import { Button, Divider, Modal, Tabs } from "antd";
import { Edit, Trash } from "lucide-react";

export default function ExercisesPage() {
  const exerciseCategories = [
    { id: "1", name: "Кардио", count: 10 },
    { id: "2", name: "Силовые", count: 15 },
    { id: "3", name: "Растяжка", count: 5 },
  ];

  const exerciseBodyParts = [
    { id: "1", name: "Спина", count: 10 },
    { id: "2", name: "Грудь", count: 15 },
    { id: "3", name: "Бицепс", count: 15 },
    { id: "4", name: "Трицепс", count: 5 },
    { id: "5", name: "Плечи", count: 5 },
    { id: "6", name: "Ноги", count: 5 },
  ];

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleCategorySelect = (categories) => {
    setSelectedCategories(categories);
    console.log("Selected categories:", categories);
  };

  const handleBodyPartSelect = (bodyParts) => {
    setSelectedBodyParts(bodyParts);
    console.log("Selected body parts:", bodyParts);
  };

  const showLoading = () => {
    setOpen(true);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const onChange = (key) => {
    console.log(key);
  };
  const items = [
    {
      key: "1",
      label: "Информация",
      children: (
        <div className="flex flex-col gap-4">
          <div className="rounded-xl overflow-hidden">
            <img
              src={image}
              alt="image"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-3xl font-bold">Жим лёжа</h1>
          <div className="text-gray-600">
            <p>
              <b>Категория:</b> Силовые
            </p>
            <p>
              <b>Часть тела: </b>Грудь
            </p>
          </div>
          <div className="mb-5">
            <p>
              <b>Описание:</b>
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente
              aperiam, numquam fugit eum molestiae id molestias beatae
              voluptatibus voluptatum voluptatem distinctio quidem assumenda
              iste aliquid maiores ratione fuga tempore veritatis.
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Демонстрация",
      children: (
        <div className="flex flex-col gap-4 mb-4">
          <h1 className="text-2xl font-bold">Видео демострации упражнения</h1>
          <iframe
            src={`https://www.youtube.com/embed/SCVCLChPQFY`}
            className="w-full aspect-video rounded-xl"
            title="Жим лёжа демонстрация"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ),
    },
    {
      key: "3",
      label: "История",
      children: (
        <div className="flex flex-col gap-4 mb-4">
          <h1 className="text-2xl font-bold">История выполнения упражнения</h1>
          <p className="text-center">История пуста</p>
        </div>
      ),
    },
    {
      key: "4",
      label: "Настройки",
      children: (
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Настройки</h1>
          <div className="flex flex-col gap-4 mt-6">
            <Button type="primary" size="large">
              <Edit size={20} />
              Править упражнение
            </Button>
            <Button color="red" variant="outlined" size="large">
              <Trash size={20} />
              Удалить упражнение
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <PageLayout title="Упражнения">
      <div className="flex flex-row gap-4 mb-6">
        <CategoryFilter
          categories={exerciseCategories}
          title="Категория"
          onSelect={handleCategorySelect}
        />
        <CategoryFilter
          categories={exerciseBodyParts}
          title="Часть тела"
          onSelect={handleBodyPartSelect}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <div className="flex justify-between w-full p-4 border rounded-xl border-indigo-300">
          <div className="flex gap-4">
            <div className="w-22 h-22 rounded overflow-hidden">
              <img
                src={image}
                alt="image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-xl">Жим лёжа</h1>
              <p className="text-gray-400">Силовые · Грудь</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button size="large" onClick={showLoading}>
              Информация
            </Button>
            <Modal
              title={<p>Информация об упражнении</p>}
              footer={
                <div className="flex gap-4 justify-end">
                  <Button onClick={() => setOpen(false)}>
                    Добавить заметку
                  </Button>
                  <Button type="primary" onClick={() => setOpen(false)}>
                    Добавить в программу тренировок
                  </Button>
                </div>
              }
              loading={loading}
              open={open}
              onCancel={() => setOpen(false)}
            >
              <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </Modal>
            <Button size="large" type="primary">
              Добавить в программу
            </Button>
          </div>
        </div>
        <div className="flex justify-between w-full p-4 border rounded-xl border-indigo-300">
          <div className="flex gap-4">
            <div className="w-22 h-22 rounded overflow-hidden">
              <img
                src={image}
                alt="image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-xl">Жим лёжа</h1>
              <p className="text-gray-400">Силовые · Грудь</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button size="large">Информация</Button>
            <Button size="large" type="primary">
              Добавить в программу
            </Button>
          </div>
        </div>
        <div className="flex justify-between w-full p-4 border rounded-xl border-indigo-300">
          <div className="flex gap-4">
            <div className="w-22 h-22 rounded overflow-hidden">
              <img
                src={image}
                alt="image"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-xl">Жим лёжа</h1>
              <p className="text-gray-400">Силовые · Грудь</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button size="large">Информация</Button>
            <Button size="large" type="primary">
              Добавить в программу
            </Button>
          </div>
        </div>
      </div>

      <Divider />
      <div className="w-full flex justify-center">
        <Button type="primary" size="large">
          Добавить своё упражнение
        </Button>
      </div>
    </PageLayout>
  );
}
