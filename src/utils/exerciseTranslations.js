export const exerciseTypeMap = {
  STRENGTH: "Силовое",
  CARDIO: "Кардио",
  ENDURANCE: "Выносливость",
  Strength: "Силовое",
  Cardio: "Кардио",
  Endurance: "Выносливость",
  strength: "Силовое",
  cardio: "Кардио",
  endurance: "Выносливость",
};

export const bodyPartMap = {
  chest: "Грудь",
  back: "Спина",
  biceps: "Бицепс",
  triceps: "Трицепс",
  shoulders: "Плечи",
  legs: "Ноги",
  abs: "Пресс",
  arms: "Руки",
  general: "Общая",
  forearms: "Предплечья",
  calves: "Икры",
  glutes: "Ягодицы",
  quads: "Четырехглавая",
  hamstrings: "Задняя поверхность бедра",
  lats: "Широчайшие",
  core: "Кор",
  fullbody: "Все тело",
  lowerbody: "Нижняя часть тела",
  upperbody: "Верхняя часть тела",

  running: "Бег",
  cycling: "Велосипед",
  swimming: "Плавание",
  jumping: "Прыжки",
  rowing: "Гребля",
  walking: "Ходьба",
  elliptical: "Эллипс",
  stairmaster: "Степпер",

  static: "Статика",
  dynamic: "Динамика",
};

export const getExerciseTypeName = (type) => {
  if (!type) return "Неизвестно";
  return exerciseTypeMap[type] || type;
};

// Функция для получения русского названия части тела
export const getBodyPartName = (bodyPart) => {
  if (!bodyPart) return "";
  return bodyPartMap[bodyPart] || bodyPart;
};
