import { Card, ProgressBar } from 'react-bootstrap';
import {useTransactionsStore} from '../../store/transactions.store';

export function IncomeExpenseCard() {
  const { transactions } = useTransactionsStore();
  
  // Фильтруем транзакции за текущий месяц
  const currentMonthTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const currentDate = new Date();
    return (
      transactionDate.getMonth() === currentDate.getMonth() &&
      transactionDate.getFullYear() === currentDate.getFullYear()
    );
  });

  // Считаем доходы и расходы
  const income = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const total = income + expenses;
  const incomePercent = total > 0 ? Math.round((income / total) * 100) : 0;
  const expensePercent = 100 - incomePercent;

  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title className="mb-4">Доходы и расходы</Card.Title>
        
        <div className="d-flex justify-content-between mb-2">
          <span className="text-success">Доходы: {income.toLocaleString()} ₽</span>
          <span className="text-danger">Расходы: {expenses.toLocaleString()} ₽</span>
        </div>
        
        <ProgressBar className="mb-4">
          <ProgressBar variant="success" now={incomePercent} key={1} />
          <ProgressBar variant="danger" now={expensePercent} key={2} />
        </ProgressBar>
        
        <div className="d-flex justify-content-around text-center">
          <div>
            <div className="text-muted">Срд. доход</div>
            <h4>{(income / 30).toLocaleString(undefined, { maximumFractionDigits: 0 })} ₽</h4>
          </div>
          <div>
            <div className="text-muted">Срд. расход</div>
            <h4>{(expenses / 30).toLocaleString(undefined, { maximumFractionDigits: 0 })} ₽</h4>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}