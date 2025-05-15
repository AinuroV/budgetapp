import { Card } from 'react-bootstrap';
import {useBudgetStore} from '../../store/budget.store';

export function BalanceCard() {
  const { monthlyBudget, spendingByCategory } = useBudgetStore();
  
  // Рассчитываем общие расходы
  const totalExpenses = Object.values(spendingByCategory).reduce((sum, amount) => sum + amount, 0);
  const balance = Number(monthlyBudget?.amount) - totalExpenses;

  return (
    <Card className="h-100">
      <Card.Body className="d-flex flex-column justify-content-center">
        <Card.Title className="text-center mb-3">Текущий баланс</Card.Title>
        <div className="text-center">
          <h2 className={balance >= 0 ? 'text-success' : 'text-danger'}>
            {balance.toLocaleString()} ₽
          </h2>
          <small className="text-muted">из {monthlyBudget?.amount.toLocaleString()} ₽</small>
        </div>
      </Card.Body>
    </Card>
  );
}