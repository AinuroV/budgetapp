import { useState } from 'react';
import {
  Container,
  Card,
  Form,
  Button,
  Tabs,
  Tab
} from 'react-bootstrap';
import { useUIStore } from '../../store/ui.store';

export function SettingsPage() {
  const {
    theme,
    language,
    currency,
    toggleTheme,
    setLanguage,
    setCurrency
  } = useUIStore();

  const [activeTab, setActiveTab] = useState('appearance');

  const handleExportData = () => {
    // Логика экспорта данных
    console.log('Exporting data...');
    useUIStore.getState().addToast({
      variant: 'success',
      title: 'Экспорт данных',
      message: 'Данные успешно экспортированы'
    });
  };

  const handleImportData = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Логика импорта данных
    console.log('Importing data from:', file.name);
    useUIStore.getState().addToast({
      variant: 'success',
      title: 'Импорт данных',
      message: `Файл ${file.name} успешно загружен`
    });
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Настройки</h1>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="appearance" title="Внешний вид">
          <Card className="mb-4">
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Тема оформления</Form.Label>
                <div>
                  <Form.Check
                    type="radio"
                    label="Светлая"
                    name="theme"
                    id="theme-light"
                    checked={theme === 'light'}
                    onChange={() => toggleTheme('light')}
                  />
                  <Form.Check
                    type="radio"
                    label="Темная"
                    name="theme"
                    id="theme-dark"
                    checked={theme === 'dark'}
                    onChange={() => toggleTheme('dark')}
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Язык</Form.Label>
                <Form.Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="ru">Русский</option>
                  <option value="en">English</option>
                </Form.Select>
              </Form.Group>

              <Form.Group>
                <Form.Label>Валюта</Form.Label>
                <Form.Select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="RUB">Рубль (RUB)</option>
                  <option value="USD">Доллар (USD)</option>
                  <option value="EUR">Евро (EUR)</option>
                </Form.Select>
              </Form.Group>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="backup" title="Резервные копии">
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-3">Экспорт данных</h5>
              <p className="text-muted mb-3">
                Скачайте резервную копию всех ваших данных в формате JSON
              </p>
              <Button variant="primary" onClick={handleExportData}>
                Экспортировать данные
              </Button>

              <hr className="my-4" />

              <h5 className="mb-3">Импорт данных</h5>
              <p className="text-muted mb-3">
                Восстановите данные из ранее созданной резервной копии
              </p>
              <Form.Group>
                <Form.Label>Выберите файл для импорта</Form.Label>
                <Form.Control
                  type="file"
                  accept=".json"
                  onChange={handleImportData}
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
}