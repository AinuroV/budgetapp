import { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  ProgressBar, 
  Badge,
  Spinner,
  Form,
  Modal,
  InputGroup,
  Alert
} from 'react-bootstrap';
import { useGoalsStore } from '../../store/goals.store';
import { useUIStore } from '../../store/ui.store';

export function GoalsPage() {
  const {
    goals,
    activeGoals,
    completedGoals,
    isLoading,
    error,
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    addToGoal,
    getGoalProgress
  } = useGoalsStore();

  const { openModal, closeModal, currentModal } = useUIStore();
  
  const [activeTab, setActiveTab] = useState('active');
  const [goalToEdit, setGoalToEdit] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [goalToAddMoney, setGoalToAddMoney] = useState(null);
  const [addMoneyAmount, setAddMoneyAmount] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Формы
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    target_amount: '',
    deadline: '',
  });

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const goalData = {
      title: formData.title,
      description: formData.description,
      target_amount: Number(formData.target_amount),
      deadline: formData.deadline,
    };

    if (goalToEdit) {
      await updateGoal(goalToEdit.id, goalData);
    } else {
      await addGoal(goalData);
    }

    if (!error) {
      resetForm();
      closeModal('goal');
    }
  };

  const handleAddMoney = async () => {
    if (goalToAddMoney && addMoneyAmount) {
      await addToGoal(goalToAddMoney.id, Number(addMoneyAmount));
      if (!error) {
        setGoalToAddMoney(null);
        setAddMoneyAmount('');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      target_amount: '',
      deadline: '',
    });
    setGoalToEdit(null);
  };

  // Получение названия месяца
  const getMonthName = (monthIndex) => {
    const months = [
      'января', 'февраля', 'марта', 'апреля', 'мая', 'июня',
      'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'
    ];
    return months[monthIndex];
  };

  // Красивое форматирование даты
  const formatDatePretty = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = getMonthName(date.getMonth());
    const year = date.getFullYear();
    
    return `${day} ${month} ${year}`;
  };

  const filteredGoals = (activeTab === 'active' ? activeGoals : completedGoals).filter(goal =>
    goal.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    goal.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Финансовые цели</h1>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary"
            onClick={() => {
              resetForm();
              openModal('goal');
            }}
          >
            Добавить цель
          </Button>
        </Col>
      </Row>

      {/* Фильтры и табы */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <div className="d-flex">
                <Button
                  variant={activeTab === 'active' ? 'primary' : 'outline-primary'}
                  onClick={() => setActiveTab('active')}
                  className="me-2"
                >
                  Активные
                </Button>
                <Button
                  variant={activeTab === 'completed' ? 'primary' : 'outline-primary'}
                  onClick={() => setActiveTab('completed')}
                >
                  Завершенные
                </Button>
              </div>
            </Col>
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Поиск по названию или описанию..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Список целей */}
      {isLoading && goals.length === 0 ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : filteredGoals.length === 0 ? (
        <Card>
          <Card.Body className="text-center py-5 text-muted">
            Нет {activeTab === 'active' ? 'активных' : 'завершенных'} целей
          </Card.Body>
        </Card>
      ) : (
        <Row>
          {filteredGoals.map((goal) => (
            <Col key={goal.id} md={6} className="mb-4">
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Card.Title>{goal.title}</Card.Title>
                    <Badge bg={goal.completed ? 'success' : 'primary'}>
                      {goal.completed ? 'Завершено' : 'Активно'}
                    </Badge>
                  </div>
                  
                  <Card.Text className="text-muted mb-3">
                    {goal.description || 'Нет описания'}
                  </Card.Text>

                  <ProgressBar
                    now={getGoalProgress(goal.id)}
                    label={`${Math.round(getGoalProgress(goal.id))}%`}
                    variant={goal.completed ? 'success' : 'primary'}
                    className="mb-3"
                  />

                  <div className="d-flex justify-content-between mb-2">
                    <span>Накоплено:</span>
                    <span className="fw-bold">
                      {goal.current_amount.toLocaleString('ru-RU')} ₽ / {goal.target_amount.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>

                  <div className="d-flex justify-content-between mb-3">
                    <span>Срок:</span>
                    <span className={new Date(goal.deadline) < new Date() && !goal.completed ? 'text-danger' : ''}>
                      {formatDatePretty(goal.deadline)}
                    </span>
                  </div>

                  <div className="d-flex justify-content-end">
                    {!goal.completed && (
                      <>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          className="me-2"
                          onClick={() => setGoalToAddMoney(goal)}
                        >
                          Добавить
                        </Button>
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          className="me-2"
                          onClick={() => {
                            setFormData({
                              title: goal.title,
                              description: goal.description,
                              target_amount: goal.target_amount,
                              deadline: goal.deadline.split('T')[0],
                            });
                            setGoalToEdit(goal);
                            openModal('goal');
                          }}
                        >
                          Редактировать
                        </Button>
                      </>
                    )}
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => setGoalToDelete(goal)}
                    >
                      Удалить
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Модальное окно добавления/редактирования цели */}
      <Modal show={currentModal === 'goal'} onHide={() => {
        closeModal('goal');
        resetForm();
      }}>
        <Modal.Header closeButton>
          <Modal.Title>{goalToEdit ? 'Редактировать цель' : 'Добавить цель'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
            
            <Form.Group className="mb-3">
              <Form.Label>Название цели *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Описание</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Целевая сумма *</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  name="target_amount"
                  value={formData.target_amount}
                  onChange={handleInputChange}
                  required
                  min="1"
                />
                <InputGroup.Text>₽</InputGroup.Text>
              </InputGroup>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Срок выполнения *</Form.Label>
              <Form.Control
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => {
              closeModal('goal');
              resetForm();
            }}>
              Отмена
            </Button>
            <Button variant="primary" type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner as="span" size="sm" animation="border" role="status" aria-hidden="true" />
                  <span className="ms-2">Сохранение...</span>
                </>
              ) : goalToEdit ? 'Сохранить' : 'Добавить'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Модальное окно добавления денег к цели */}
      <Modal show={!!goalToAddMoney} onHide={() => setGoalToAddMoney(null)}>
        <Modal.Header closeButton>
          <Modal.Title>Добавить к цели: {goalToAddMoney?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
          
          <Form.Group className="mb-3">
            <Form.Label>Сумма</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                value={addMoneyAmount}
                onChange={(e) => setAddMoneyAmount(e.target.value)}
                min="1"
                max={goalToAddMoney?.target_amount - goalToAddMoney?.current_amount}
              />
              <InputGroup.Text>₽</InputGroup.Text>
            </InputGroup>
            <Form.Text className="text-muted">
              Осталось: {(goalToAddMoney?.target_amount - goalToAddMoney?.current_amount).toLocaleString('ru-RU')} ₽
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setGoalToAddMoney(null)}>
            Отмена
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddMoney}
            disabled={!addMoneyAmount || isLoading}
          >
            {isLoading ? (
              <>
                <Spinner as="span" size="sm" animation="border" role="status" aria-hidden="true" />
                <span className="ms-2">Добавление...</span>
              </>
            ) : 'Добавить'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Модальное окно подтверждения удаления */}
      <Modal show={!!goalToDelete} onHide={() => setGoalToDelete(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Удаление цели</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Вы уверены, что хотите удалить цель "{goalToDelete?.title}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setGoalToDelete(null)}>
            Отмена
          </Button>
          <Button 
            variant="danger" 
            onClick={async () => {
              await deleteGoal(goalToDelete.id);
              setGoalToDelete(null);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner as="span" size="sm" animation="border" role="status" aria-hidden="true" />
                <span className="ms-2">Удаление...</span>
              </>
            ) : 'Удалить'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}