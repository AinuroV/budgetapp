import { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Form, 
  InputGroup,
  Badge,
  Spinner
} from 'react-bootstrap';
import {useTransactionsStore} from '../../store/transactions.store';
import {useCategoriesStore} from '../../store/categories.store';
import {useUIStore} from '../../store/ui.store';
import {TransactionModal} from '../../components/Modals/TransactionModal';


// Вспомогательная функция для получения названия месяца
const getMonthName = (monthIndex) => {
  const months = [
    'янв', 'фев', 'мар', 'апр', 'мая', 'июн',
    'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'
  ];
  return months[monthIndex];
};

// Улучшенный формат даты с названием месяца
const formatDateWithMonth = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = getMonthName(date.getMonth());
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export function TransactionsPage() {
  const {
    transactions,
    filteredTransactions,
    isLoading,
    fetchTransactions,
    setFilter,
    pagination,
    setPage,
    filters
  } = useTransactionsStore();

  const { getCategoryById, expenseCategories, incomeCategories } = useCategoriesStore();
  const { openModal } = useUIStore();

  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setFilter('searchQuery', localSearch);
  };

  const handleFilterChange = (name, value) => {
    setFilter(name, value);
  };

  const resetFilters = () => {
    setFilter('dateRange', 'month');
    setFilter('type', '');
    setFilter('category', '');
    setFilter('searchQuery', '');
    setLocalSearch('');
  };

  const getCategoryName = (categoryId, transactionType) => {
    if (!categoryId) return transactionType === 'income' ? 'Доход' : 'Расход';
    const category = getCategoryById(categoryId);
    return category?.name || 'Неизвестно';
  };

  const getCategoryColor = (categoryId) => {
    if (!categoryId) return '#6c757d';
    const category = getCategoryById(categoryId);
    return category?.color || '#6c757d';
  };

  const displayTransactions = filteredTransactions.length > 0 
    ? filteredTransactions 
    : transactions;

  return (
    <Container className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1>Все транзакции</h1>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary"
            onClick={() => openModal('transaction')}
          >
            Добавить транзакцию
          </Button>
        </Col>
      </Row>

      {/* Фильтры */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>Период</Form.Label>
                <Form.Select
                  value={filters.dateRange}
                  onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                >
                  <option value="week">Неделя</option>
                  <option value="month">Месяц</option>
                  <option value="year">Год</option>
                  <option value="all">Все время</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Тип</Form.Label>
                <Form.Select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value || null)}
                >
                  <option value="">Все типы</option>
                  <option value="income">Доходы</option>
                  <option value="expense">Расходы</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Категория</Form.Label>
                <Form.Select
                  value={filters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value || null)}
                  disabled={!filters.type}
                >
                  <option value="">Все категории</option>
                  {(filters.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Поиск</Form.Label>
                <Form onSubmit={handleSearchSubmit}>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="По описанию..."
                      value={localSearch}
                      onChange={(e) => setLocalSearch(e.target.value)}
                    />
                    <Button 
                      variant="outline-secondary" 
                      type="submit"
                    >
                      Найти
                    </Button>
                  </InputGroup>
                </Form>
              </Form.Group>
            </Col>
          </Row>

          <div className="d-flex justify-content-end mt-3">
            <Button 
              variant="outline-secondary" 
              className="me-2"
              onClick={resetFilters}
            >
              Сбросить фильтры
            </Button>
          </div>
        </Card.Body>
      </Card>

      {/* Таблица транзакций */}
      <Card>
        <Card.Body>
          {isLoading && transactions.length === 0 ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : displayTransactions.length === 0 ? (
            <div className="text-center py-5 text-muted">
              Нет транзакций по выбранным фильтрам
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <Table hover>
                  <thead>
                    <tr>
                      <th>Дата</th>
                      <th>Описание</th>
                      <th>Категория</th>
                      <th className="text-end">Сумма</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayTransactions.map((t) => (
                      <tr key={t.id}>
                        <td>{formatDateWithMonth(t.date)}</td>
                        <td>{t.description || '-'}</td>
                        <td>
                          <Badge 
                            bg="light" 
                            text="dark"
                            style={{ 
                              backgroundColor: `${getCategoryColor(t.categoryId)}20`,
                              color: getCategoryColor(t.categoryId)
                            }}
                          >
                            {getCategoryName(t.categoryId, t.type)}
                          </Badge>
                        </td>
                        <td className={`text-end fw-bold ${t.type === 'income' ? 'text-success' : 'text-danger'}`}>
                          {t.type === 'income' ? '+' : '-'}
                          {t.amount.toLocaleString('ru-RU')} ₽
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              {/* Пагинация */}
              {pagination.totalItems > pagination.itemsPerPage && (
                <div className="d-flex justify-content-center mt-4">
                  <nav>
                    <ul className="pagination">
                      <li className={`page-item ${pagination.currentPage === 1 ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setPage(pagination.currentPage - 1)}
                          disabled={pagination.currentPage === 1}
                        >
                          Назад
                        </button>
                      </li>
                      
                      {Array.from({ length: Math.ceil(pagination.totalItems / pagination.itemsPerPage) }).map((_, i) => (
                        <li 
                          key={i} 
                          className={`page-item ${pagination.currentPage === i + 1 ? 'active' : ''}`}
                        >
                          <button 
                            className="page-link" 
                            onClick={() => setPage(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      
                      <li className={`page-item ${pagination.currentPage * pagination.itemsPerPage >= pagination.totalItems ? 'disabled' : ''}`}>
                        <button 
                          className="page-link" 
                          onClick={() => setPage(pagination.currentPage + 1)}
                          disabled={pagination.currentPage * pagination.itemsPerPage >= pagination.totalItems}
                        >
                          Вперед
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>

      <TransactionModal />
    </Container>
  );
}