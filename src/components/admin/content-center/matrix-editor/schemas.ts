export interface FieldDefinition {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'array' | 'icon';
  itemSchema?: FieldDefinition[]; // For arrays
}

export interface BlockSchema {
  fields: FieldDefinition[];
}

export const BLOCK_SCHEMAS: Record<string, BlockSchema> = {
  hero: {
    fields: [
      { key: 'logo_text', label: 'Текст логотипа', type: 'text' },
      { key: 'logo_sub', label: 'Подзаголовок логотипа', type: 'text' },
      { key: 'title', label: 'Заголовок Hero', type: 'textarea' },
      { key: 'description', label: 'Описание', type: 'textarea' },
      { key: 'button_text', label: 'Текст кнопки', type: 'text' },
      { key: 'image', label: 'Фоновое изображение', type: 'image' },
      { 
        key: 'stats', 
        label: 'Статистика (метрики)', 
        type: 'array',
        itemSchema: [
          { key: 'value', label: 'Значение', type: 'text' },
          { key: 'label', label: 'Описание', type: 'text' }
        ]
      }
    ]
  },
  quiz: {
    fields: [
      { key: 'title', label: 'Заголовок Квиза', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'text' },
      { 
        key: 'questions', 
        label: 'Вопросы квиза', 
        type: 'array',
        itemSchema: [
          { key: 'text', label: 'Текст вопроса', type: 'text' },
          { key: 'type', label: 'Тип (select/input)', type: 'text' },
          { key: 'options', label: 'Варианты (через запятую)', type: 'text' }
        ]
      }
    ]
  },
  services: {
    fields: [
      { key: 'title', label: 'Заголовок секции', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'text' },
      { 
        key: 'echelons', 
        label: 'Эшелоны продуктов', 
        type: 'array',
        itemSchema: [
          { key: 'title', label: 'Название эшелона', type: 'text' },
          { key: 'description', label: 'Описание', type: 'textarea' }
        ]
      }
    ]
  },
  method: {
    fields: [
      { key: 'title', label: 'Заголовок метода', type: 'text' },
      { 
        key: 'items', 
        label: 'Шаги метода', 
        type: 'array',
        itemSchema: [
          { key: 'title', label: 'Заголовок шага', type: 'text' },
          { key: 'description', label: 'Описание шага', type: 'textarea' },
          { key: 'icon', label: 'Иконка', type: 'icon' }
        ]
      }
    ]
  },
  calculator: {
    fields: [
      { key: 'title', label: 'Заголовок калькулятора', type: 'text' },
      { key: 'subtitle', label: 'Подзаголовок', type: 'text' },
      { key: 'button_text', label: 'Текст кнопки', type: 'text' }
    ]
  },
  cases: {
    fields: [
      { key: 'title', label: 'Заголовок кейсов', type: 'text' },
      { 
        key: 'cases', 
        label: 'Список кейсов', 
        type: 'array',
        itemSchema: [
          { key: 'title', label: 'Заголовок кейса', type: 'text' },
          { key: 'description', label: 'Описание', type: 'textarea' },
          { key: 'image', label: 'Изображение', type: 'image' },
          { key: 'result', label: 'Результат (цифры)', type: 'text' }
        ]
      }
    ]
  },
  contacts: {
    fields: [
      { key: 'title', label: 'Заголовок контактов', type: 'text' },
      { key: 'description', label: 'Описание', type: 'textarea' },
      { 
        key: 'socials', 
        label: 'Социальные сети', 
        type: 'array',
        itemSchema: [
          { key: 'platform', label: 'Платформа (TG/WA)', type: 'text' },
          { key: 'url', label: 'Ссылка', type: 'text' },
          { key: 'label', label: 'Надпись', type: 'text' }
        ]
      }
    ]
  },
  footer: {
    fields: [
      { key: 'logo_text', label: 'Текст логотипа', type: 'text' },
      { key: 'logo_sub', label: 'Подзаголовок', type: 'text' },
      { key: 'copyright', label: 'Копирайт', type: 'text' }
    ]
  }
};
