import { Card, ListGroup, Badge } from 'react-bootstrap';
import { Link } from 'react-router';
import { useCategoriesStore } from '../../store/categories.store';
import { useTransactionsStore } from '../../store/transactions.store';
import { useUIStore } from '../../store/ui.store';
import { TransactionModal } from '../../components/Modals/TransactionModal';

export function RecentTransactions() {
  const {
    transactions
  } = useTransactionsStore();

  const { getCategoryById } = useCategoriesStore();
  const { openModal } = useUIStore();

  const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  // Используем фильтрованные транзакции если они есть, иначе все
  const recentTransactions = transactions.slice(0, 5);

  if (recentTransactions.length === 0) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <div className="text-muted mb-3">Нет транзакций</div>
          <button className="btn btn-primary">Добавить транзакцию</button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card className="h-100">
        <Card.Body>
          <Card.Title className="mb-3">Последние транзакции</Card.Title>
          <ListGroup variant="flush">
            {recentTransactions.map((t, index) => {
              const category = getCategoryById(t.categoryId);
              return (
                <ListGroup.Item
                  key={index}
                  className="d-flex align-items-center py-3 px-0 border-bottom"
                >
                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between">
                      <span className="fw-medium">{t.description || 'Без описания'}</span>
                      <Badge
                        bg={t.type === 'income' ? 'success' : 'danger'}
                        className="fs-6 px-2 py-1"
                      >
                        {t.type === 'income' ? '+' : '-'}
                        {t.amount.toLocaleString('ru-RU')} ₽
                      </Badge>
                    </div>
                    <div className="d-flex justify-content-between text-muted small">
                      <span>{category?.name || (t.type === 'income' ? 'Доход' : 'Без категории')}</span>
                      <span>{formatDate(t.date)}</span>
                    </div>
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
          <div className="d-flex justify-content-center gap-4 py-5">
            <button className="btn btn-primary" onClick={() => openModal('transaction')}>Добавить транзакцию</button>
            <button className="btn btn-primary">
              <Link to="/transactions" className="text-decoration-none text-white">
                Перейти к транзакциям
              </Link></button>
          </div>
        </Card.Body>
      </Card>
      <TransactionModal />
    </>
  );
}