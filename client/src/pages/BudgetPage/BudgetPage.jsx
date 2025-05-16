import { useEffect, useState } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    ProgressBar,
    Form,
    Button,
    Alert,
    Spinner,
    Badge,
    InputGroup
} from 'react-bootstrap';
import { useBudgetStore } from '../../store/budget.store';
import { useCategoriesStore } from '../../store/categories.store';
import { useUIStore } from '../../store/ui.store';

export function BudgetPage() {

    const {
        monthlyBudget,
        categoryLimits,
        spendingByCategory,
        exceededLimits,
        isLoading,
        error,
        fetchBudgetData,
        setMonthlyBudget,
        setCategoryLimit,
        getAvailableBudget,
        getCategoryProgress
    } = useBudgetStore();

    const { expenseCategories } = useCategoriesStore();
    const { addToast } = useUIStore();

    const [newBudget, setNewBudget] = useState('');
    const [limitInputs, setLimitInputs] = useState({});

    useEffect(() => {
        fetchBudgetData();
    }, [fetchBudgetData]);

    useEffect(() => {
        // Показываем уведомления о превышении лимитов
        exceededLimits.forEach(categoryId => {
            const category = expenseCategories.find(c => c.id === categoryId);
            if (category) {
                addToast({
                    variant: 'danger',
                    title: 'Превышен лимит',
                    message: `Категория "${category.name}" превысила установленный лимит!`,
                    delay: 5000
                });
            }
        });
    }, [exceededLimits, expenseCategories, addToast]);

    const handleSetBudget = async (e) => {
        e.preventDefault();
        if (!newBudget) return;

        const success = await setMonthlyBudget(Number(newBudget));
        if (success) {
            setNewBudget('');
            addToast({
                variant: 'success',
                title: 'Бюджет обновлен',
                message: `Месячный бюджет установлен в ${Number(newBudget).toLocaleString('ru-RU')} ₽`,
                delay: 3000
            });
        }
    };

    const handleSetLimit = async (categoryId) => {
        const limit = limitInputs[categoryId];
        if (!limit) return;

        const success = await setCategoryLimit(categoryId, Number(limit));
        if (success) {
            setLimitInputs(prev => ({ ...prev, [categoryId]: '' }));
            addToast({
                variant: 'success',
                title: 'Лимит обновлен',
                message: `Лимит для категории установлен в ${Number(limit).toLocaleString('ru-RU')} ₽`,
                delay: 3000
            });
        }
    };

    const availableBudget = getAvailableBudget();

    if (isLoading && !monthlyBudget) {
        return (
            <Container className="py-5 text-center">
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="py-4">
            <h1 className="mb-4">Планирование бюджета</h1>

            {/* Общий бюджет */}
            <Card className="mb-4">
                <Card.Body>
                    <Card.Title>Общий месячный бюджет</Card.Title>
                    {monthlyBudget ? (
                        <>
                            <div className="d-flex align-items-center mb-3">
                                <h2 className="mb-0 me-3">
                                    {monthlyBudget.amount.toLocaleString('ru-RU')} ₽
                                </h2>
                                <Badge bg={availableBudget >= 0 ? 'success' : 'danger'}>
                                    Доступно: {availableBudget.toLocaleString('ru-RU')} ₽
                                </Badge>
                            </div>

                            <Form onSubmit={handleSetBudget} className="mt-4">
                                <Row className="g-2">
                                    <Col md={6}>
                                        <Form.Control
                                            type="number"
                                            placeholder="Новый бюджет"
                                            value={newBudget}
                                            onChange={(e) => setNewBudget(e.target.value)}
                                        />
                                    </Col>
                                    <Col md={6}>
                                        <Button type="submit" variant="primary">
                                            Обновить бюджет
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </>
                    ) : (
                        <Alert variant="info">Месячный бюджет не установлен</Alert>
                    )}
                </Card.Body>
            </Card>

            {/* Лимиты по категориям */}
            <Card>
                <Card.Body>
                    <Card.Title>Лимиты по категориям</Card.Title>

                    {expenseCategories.length === 0 ? (
                        <Alert variant="info">Нет категорий расходов</Alert>
                    ) : (
                        <div className="table-responsive">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Категория</th>
                                        <th>Лимит</th>
                                        <th>Потрачено</th>
                                        <th>Прогресс</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {expenseCategories.map(category => {
                                        const limit = categoryLimits[category.id] || 0;
                                        const spent = spendingByCategory[category.id] || 0;
                                        const progress = getCategoryProgress(category.id);
                                        const isExceeded = exceededLimits.includes(category.id);

                                        return (
                                            <tr key={category.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        {category.name}
                                                        {isExceeded && (
                                                            <Badge bg="danger" className="ms-2">
                                                                Превышен
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    {limit > 0 ? (
                                                        <span className="fw-bold">
                                                            {limit.toLocaleString('ru-RU')} ₽
                                                        </span>
                                                    ) : '-'}
                                                </td>
                                                <td>
                                                    {spent > 0 ? (
                                                        <span className={isExceeded ? 'text-danger fw-bold' : ''}>
                                                            {spent.toLocaleString('ru-RU')} ₽
                                                        </span>
                                                    ) : '-'}
                                                </td>
                                                <td>
                                                    {limit > 0 ? (
                                                        <ProgressBar
                                                            variant={isExceeded ? 'danger' : progress > 80 ? 'warning' : 'success'}
                                                            now={progress}
                                                            label={`${Math.round(progress)}%`}
                                                        />
                                                    ) : '-'}
                                                </td>
                                                <td>
                                                    <InputGroup>
                                                        <Form.Control
                                                            type="number"
                                                            placeholder="Лимит"
                                                            value={limitInputs[category.id] || ''}
                                                            onChange={(e) => setLimitInputs(prev => ({
                                                                ...prev,
                                                                [category.id]: e.target.value
                                                            }))}
                                                        />
                                                        <Button
                                                            variant="outline-primary"
                                                            onClick={() => handleSetLimit(category.id)}
                                                            disabled={!limitInputs[category.id]}
                                                        >
                                                            Установить
                                                        </Button>
                                                    </InputGroup>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}