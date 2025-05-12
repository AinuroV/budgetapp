import { useEffect, useState } from 'react';
import {
    Container,
    Card,
    Table,
    Button,
    Form,
    Badge,
    Spinner,
    Alert,
    Row,
    Col,
    InputGroup
} from 'react-bootstrap';
// import useHistoryStore from '../../store/history.store';
// import useAuthStore from '../../store/auth.store';

// Вспомогательная функция для форматирования даты
const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Вспомогательная функция для получения названия типа действия
const getActionTypeName = (type) => {
    const types = {
        'ADD': 'Добавление',
        'UPDATE': 'Изменение',
        'DELETE': 'Удаление',
        'UPDATE_BUDGET': 'Изменение бюджета',
        'SET_CATEGORY_LIMIT': 'Лимит категории'
    };
    return types[type] || type;
};

// Вспомогательная функция для получения названия типа сущности
const getEntityTypeName = (type) => {
    const types = {
        'Transaction': 'Транзакция',
        'Category': 'Категория',
        'Budget': 'Бюджет',
        'Goal': 'Цель'
    };
    return types[type] || type;
};
// Моковые данные истории
const mockHistory = [
    {
        id: 1,
        type: 'ADD',
        entityType: 'Transaction',
        entityId: 101,
        timestamp: '2023-06-15T10:30:00Z',
        userId: 1,
        data: {
            amount: 5000,
            description: 'Продукты',
            categoryId: 3
        }
    },
    {
        id: 2,
        type: 'UPDATE',
        entityType: 'Category',
        entityId: 3,
        timestamp: '2023-06-14T15:45:00Z',
        userId: 1,
        oldData: { name: 'Еда', limit: 10000 },
        newData: { name: 'Продукты', limit: 15000 }
    },
    {
        id: 3,
        type: 'UPDATE_BUDGET',
        entityType: 'Budget',
        timestamp: '2023-06-10T09:20:00Z',
        userId: 1,
        oldData: { amount: 40000 },
        newData: { amount: 50000 }
    },
    {
        id: 4,
        type: 'DELETE',
        entityType: 'Transaction',
        entityId: 100,
        timestamp: '2023-06-05T14:10:00Z',
        userId: 1,
        data: {
            amount: 2000,
            description: 'Кафе',
            categoryId: 6
        }
    },
    {
        id: 5,
        type: 'SET_CATEGORY_LIMIT',
        entityType: 'Budget',
        timestamp: '2023-06-01T11:00:00Z',
        userId: 1,
        entityId: 3,
        oldData: 10000,
        newData: 15000
    }
];

// Мок для useHistoryStore
const mockHistoryStore = {
    history: mockHistory,
    filteredHistory: mockHistory,
    isLoading: false,
    error: null,
    filters: {
        dateRange: 'month',
        actionType: null,
        entityType: null,
        startDate: null,
        endDate: null
    },
    fetchHistory: () => console.log('Fetching history...'),
    undoAction: (id) => {
        console.log(`Undoing action ${id}`);
        return Promise.resolve(true);
    },
    setFilter: (name, value) => {
        console.log(`Setting filter ${name} to ${value}`);
    },
    applyFilters: () => console.log('Applying filters...')
};

// Мок для useAuthStore
const mockAuthStore = {
    user: { id: 1, name: 'Тестовый пользователь' }
};

export function HistoryPage() {
    // Временная замена для тестирования
    const useHistoryStore = () => mockHistoryStore;
    const useAuthStore = () => mockAuthStore;


    const {
        history,
        filteredHistory,
        isLoading,
        error,
        filters,
        fetchHistory,
        undoAction,
        setFilter
    } = useHistoryStore();

    const { user } = useAuthStore();

    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const handleDateRangeChange = (range) => {
        setFilter('dateRange', range);
        if (range !== 'custom') {
            setFilter('startDate', null);
            setFilter('endDate', null);
        }
    };

    const applyCustomDateRange = () => {
        if (!customStartDate || !customEndDate) return;

        const startDate = new Date(customStartDate);
        const endDate = new Date(customEndDate);

        if (startDate > endDate) {
            alert('Начальная дата не может быть больше конечной');
            return;
        }

        setFilter('startDate', startDate);
        setFilter('endDate', endDate);
        setFilter('dateRange', 'custom');
    };

    const handleUndo = async (actionId) => {
        const success = await undoAction(actionId);
        if (success) {
            // Можно добавить уведомление об успехе
            console.log('Действие успешно отменено');
        }
    };

    const canUndo = (action) => {
        // Определяем, какие действия можно отменять
        return ['ADD', 'UPDATE', 'DELETE'].includes(action.type) &&
            ['Transaction', 'Category'].includes(action.entityType);
    };

    return (
        <Container className="py-4">
            <h1 className="mb-4">История изменений</h1>

            {/* Фильтры */}
            <Card className="mb-4">
                <Card.Body>
                    <Row>
                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Период</Form.Label>
                                <Form.Select
                                    value={filters.dateRange}
                                    onChange={(e) => handleDateRangeChange(e.target.value)}
                                >
                                    <option value="day">За день</option>
                                    <option value="week">За неделю</option>
                                    <option value="month">За месяц</option>
                                    <option value="year">За год</option>
                                    <option value="all">За все время</option>
                                    <option value="custom">Произвольный период</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        {filters.dateRange === 'custom' && (
                            <>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Начальная дата</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={customStartDate}
                                            onChange={(e) => setCustomStartDate(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Конечная дата</Form.Label>
                                        <Form.Control
                                            type="date"
                                            value={customEndDate}
                                            onChange={(e) => setCustomEndDate(e.target.value)}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={2} className="d-flex align-items-end">
                                    <Button
                                        variant="primary"
                                        onClick={applyCustomDateRange}
                                        disabled={!customStartDate || !customEndDate}
                                    >
                                        Применить
                                    </Button>
                                </Col>
                            </>
                        )}

                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Тип действия</Form.Label>
                                <Form.Select
                                    value={filters.actionType || ''}
                                    onChange={(e) => setFilter('actionType', e.target.value || null)}
                                >
                                    <option value="">Все действия</option>
                                    <option value="ADD">Добавление</option>
                                    <option value="UPDATE">Изменение</option>
                                    <option value="DELETE">Удаление</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group className="mb-3">
                                <Form.Label>Тип сущности</Form.Label>
                                <Form.Select
                                    value={filters.entityType || ''}
                                    onChange={(e) => setFilter('entityType', e.target.value || null)}
                                >
                                    <option value="">Все сущности</option>
                                    <option value="TRANSACTION">Транзакции</option>
                                    <option value="CATEGORY">Категории</option>
                                    <option value="BUDGET">Бюджет</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* История изменений */}
            <Card>
                <Card.Body>
                    {isLoading && !history.length ? (
                        <div className="text-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : filteredHistory.length === 0 ? (
                        <Alert variant="info">Нет данных по выбранным фильтрам</Alert>
                    ) : (
                        <div className="table-responsive">
                            <Table hover>
                                <thead>
                                    <tr>
                                        <th>Дата</th>
                                        <th>Действие</th>
                                        <th>Сущность</th>
                                        <th>Описание</th>
                                        <th>Пользователь</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredHistory.map((action) => (
                                        <tr key={action.id || action.timestamp}>
                                            <td>{formatDateTime(action.timestamp)}</td>
                                            <td>
                                                <Badge
                                                    bg={
                                                        action.type === 'ADD' ? 'success' :
                                                            action.type === 'UPDATE' ? 'warning' : 'danger'
                                                    }
                                                >
                                                    {getActionTypeName(action.type)}
                                                </Badge>
                                            </td>
                                            <td>{getEntityTypeName(action.entityType)}</td>
                                            <td>
                                                {action.entityType === 'Transaction' && (
                                                    <>
                                                        {action.type === 'ADD' && 'Добавлена транзакция'}
                                                        {action.type === 'UPDATE' && 'Изменена транзакция'}
                                                        {action.type === 'DELETE' && 'Удалена транзакция'}
                                                        {action.data?.amount &&
                                                            ` (${action.data.amount.toLocaleString('ru-RU')} ₽)`}
                                                    </>
                                                )}
                                                {action.entityType === 'Category' && (
                                                    <>
                                                        {action.type === 'ADD' && 'Добавлена категория'}
                                                        {action.type === 'UPDATE' && 'Изменена категория'}
                                                        {action.type === 'DELETE' && 'Удалена категория'}
                                                        {action.data?.name && `: ${action.data.name}`}
                                                    </>
                                                )}
                                                {action.entityType === 'Budget' && (
                                                    <>
                                                        {action.type === 'UPDATE_BUDGET' &&
                                                            `Бюджет изменен на ${action.newData.amount.toLocaleString('ru-RU')} ₽`}
                                                        {action.type === 'SET_CATEGORY_LIMIT' &&
                                                            `Лимит категории установлен в ${action.newData.toLocaleString('ru-RU')} ₽`}
                                                    </>
                                                )}
                                            </td>
                                            <td>{action.userId === user?.id ? 'Вы' : 'Система'}</td>
                                            <td className="text-end">
                                                {canUndo(action) && (
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        onClick={() => handleUndo(action.id)}
                                                    >
                                                        Отменить
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}