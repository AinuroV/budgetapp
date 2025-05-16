import { useState } from 'react';
import { Table, Button, Badge, Spinner } from 'react-bootstrap';
import { useCategoriesStore } from '../../store/categories.store';
import { CategoryForm } from './CategoryForm';

export const CategoriesList = ({ categories }) => {
  const { deleteCategory, isLoading } = useCategoriesStore();
  const [editingCategory, setEditingCategory] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Вы уверены, что хотите удалить эту категорию?')) {
      await deleteCategory(id);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-3">
        <Spinner animation="border" size="sm" />
      </div>
    );
  }

  if (categories?.length === 0) {
    return <p className="text-muted mt-3">Нет категорий для отображения</p>;
  }

  return (
    <>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Название</th>
            <th>Цвет</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {categories?.map((category) => (
            <tr key={category.id}>
              <td>{category.name}</td>
              <td>
                <span
                  className='badge'
                  style={{
                    backgroundColor: category.color,
                    color: getContrastColor(category.color)
                  }}
                >
                  {category.color}
                </span>
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => setEditingCategory(category)}
                >
                  Редактировать
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(category.id)}
                  disabled={isLoading}
                >
                  Удалить
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {editingCategory && (
        <CategoryForm
          category={editingCategory}
          onClose={() => setEditingCategory(null)}
        />
      )}
    </>
  );
};

// Вспомогательная функция для определения контрастного цвета текста
function getContrastColor(hexColor) {
  // Удаляем # если есть
  const hex = hexColor.replace('#', '');

  // Конвертируем в RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Рассчитываем яркость
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // Возвращаем черный или белый в зависимости от яркости фона
  return brightness > 128 ? '#000000' : '#FFFFFF';
}