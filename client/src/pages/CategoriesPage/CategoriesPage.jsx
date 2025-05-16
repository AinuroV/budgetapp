import { useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Tab, Tabs } from 'react-bootstrap';
import { useCategoriesStore } from '../../store/categories.store';
import { CategoriesList } from './CategoriesList';
import { CategoryForm } from './CategoryForm';

export const CategoriesPage = () => {

    const {
        categories,
        incomeCategories,
        expenseCategories,
        isLoading,
        error,
        fetchCategories
    } = useCategoriesStore();
    
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