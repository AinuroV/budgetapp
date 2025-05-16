import { Container, Row, Col } from 'react-bootstrap';

import {BalanceCard} from '../DashboardPage/BalanceCard';
import {IncomeExpenseCard} from '../DashboardPage/IncomeExpenseCard';
import {CategoryChart} from '../DashboardPage/CategoryChart';
import {RecentTransactions} from '../DashboardPage/RecentTransactions';

import {useTransactionsStore} from '../../store/transactions.store';


export function DashboardPage() {
  const { transactions } = useTransactionsStore();


  // Получаем последние 5 транзакций
  const recentTransactions = transactions.slice(0, 5);

  return (
    <Container className="py-4">
      <h1 className="mb-4">Дашборд</h1>
      
      <Row className="g-4 mb-4">
        <Col md={4}>
          <BalanceCard />
        </Col>
        <Col md={8}>
          <IncomeExpenseCard />
        </Col>
      </Row>
      
      <Row className="g-4">
        <Col md={6}>
          <CategoryChart />
        </Col>
        <Col md={6}>
          <RecentTransactions transactions={recentTransactions} />
        </Col>
      </Row>
    </Container>
  );
}