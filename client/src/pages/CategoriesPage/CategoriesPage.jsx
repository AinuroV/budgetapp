import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Tab, Tabs } from 'react-bootstrap';
// import { useCategoriesStore } from '../../store/categories.store';
import { CategoriesList } from './CategoriesList';
import { CategoryForm } from './CategoryForm';

// Моковые данные для тестирования
const mockCategories = [
    {
        id: '1',
        name: 'Продукты',
        color: '#FF6900',
        isTypeIncome: false,
        createdAt: new Date().toISOString(),
    },
    {
        id: '2',
        name: 'Транспорт',
        color: '#0693E3',
        isTypeIncome: false,
        createdAt: new Date().toISOString(),
    },
    {
        id: '3',
        name: 'Развлечения',
        color: '#EB144C',
        isTypeIncome: false,
        createdAt: new Date().toISOString(),
    },
    {
        id: '4',
        name: 'Зарплата',
        color: '#00D084',
        isTypeIncome: true,
        createdAt: new Date().toISOString(),
    },
    {
        id: '5',
        name: 'Фриланс',
        color: '#9900EF',
        isTypeIncome: true,
        createdAt: new Date().toISOString(),
    },
];

// Мок для useCategoriesStore
const useMockCategoriesStore = () => {
    const [categories, setCategories] = useState(mockCategories);
    const [isLoading, setIsLoading] = useState(false);

    const incomeCategories = categories.filter(c => c.isTypeIncome);
    const expenseCategories = categories.filter(c => !c.isTypeIncome);

    return {
        categories,
        incomeCategories,
        expenseCategories,
        isLoading,
        error: null,
        fetchCategories: () => {
            setIsLoading(true);
            setTimeout(() => {
                setCategories(mockCategories);
                setIsLoading(false);
            }, 500);
        },
        addCategory: (newCategory) => {
            const newId = Math.max(...categories.map(c => parseInt(c.id))) + 1;
            const categoryToAdd = {
                ...newCategory,
                id: newId.toString(),
                createdAt: new Date().toISOString(),
            };
            setCategories(prev => [...prev, categoryToAdd]);
            return Promise.resolve(true);
        },
        updateCategory: (id, updates) => {
            setCategories(prev =>
                prev.map(c => c.id === id ? { ...c, ...updates } : c)
            );
            return Promise.resolve(true);
        },
        deleteCategory: (id) => {
            setCategories(prev => prev.filter(c => c.id !== id));
            return Promise.resolve(true);
        },
        getCategoryById: (id) => categories.find(c => c.id === id),
        getCategoriesByType: (isIncome) => isIncome ? incomeCategories : expenseCategories,
    };
};


export const CategoriesPage = () => {
    const {
        categories,
        incomeCategories,
        expenseCategories,
        isLoading,
        error,
        fetchCategories
    } = useMockCategoriesStore();

    // const {
    //     categories,
    //     incomeCategories,
    //     expenseCategories,
    //     isLoading,
    //     error,
    //     fetchCategories
    // } = useCategoriesStore();
    
    useEffect(() => {
        fetchCategories();
    }, []);

    if (isLoading && categories.length === 0) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Загрузка...</span>
                </Spinner>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            <Row className="mb-4">
                <Col>
                    <h2>Управление категориями</h2>
                    <p className="text-muted">
                        Создавайте и редактируйте категории для ваших доходов и расходов
                    </p>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={6}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Добавить новую категорию</Card.Title>
                            <CategoryForm />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Tabs defaultActiveKey="expenses" className="mb-3">
                        <Tab eventKey="expenses" title="Категории расходов">
                            <CategoriesList
                                categories={expenseCategories}
                                type="expense"
                            />
                        </Tab>
                        <Tab eventKey="incomes" title="Категории доходов">
                            <CategoriesList
                                categories={incomeCategories}
                                type="income"
                            />
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
        </Container>
    );
};