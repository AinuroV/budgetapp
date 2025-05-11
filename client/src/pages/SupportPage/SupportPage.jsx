import { useState } from 'react';
import {
  Container,
  Card,
  Form,
  Button,
  Accordion,
  Alert,
  Badge,
  Row,
  Col
} from 'react-bootstrap';

export function SupportPage() {
  const [ticketType, setTicketType] = useState('question');
  const [message, setMessage] = useState('');
  const [tickets, setTickets] = useState([
    {
      id: 1,
      type: 'bug',
      message: 'Не сохраняются настройки валюты',
      status: 'решено',
      date: '2023-06-15'
    },
    {
      id: 2,
      type: 'question',
      message: 'Как добавить новую категорию?',
      status: 'в обработке',
      date: '2023-06-18'
    }
  ]);

  const faqItems = [
    {
      question: 'Как сбросить пароль?',
      answer: 'На странице входа нажмите "Забыли пароль" и следуйте инструкциям.'
    },
    {
      question: 'Как экспортировать данные?',
      answer: 'В настройках перейдите в раздел "Резервные копии" и нажмите "Экспортировать данные".'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message) return;

    const newTicket = {
      id: Date.now(),
      type: ticketType,
      message,
      status: 'в обработке',
      date: new Date().toISOString().split('T')[0]
    };

    setTickets([newTicket, ...tickets]);
    setMessage('');

    // Здесь будет отправка на сервер
    console.log('Ticket submitted:', newTicket);
  };

  return (
    <Container className="py-4">
      <h1 className="mb-4">Техническая поддержка</h1>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Создать обращение</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Тип обращения</Form.Label>
                  <Form.Select
                    value={ticketType}
                    onChange={(e) => setTicketType(e.target.value)}
                  >
                    <option value="bug">Ошибка в приложении</option>
                    <option value="question">Вопрос</option>
                    <option value="suggestion">Предложение</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Описание проблемы</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Опишите вашу проблему максимально подробно..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Прикрепить скриншоты (до 3)</Form.Label>
                  <Form.Control type="file" multiple accept="image/*" />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Отправить обращение
                </Button>
              </Form>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body>
              <Card.Title>История обращений</Card.Title>
              {tickets.length === 0 ? (
                <Alert variant="info">У вас нет отправленных обращений</Alert>
              ) : (
                <div className="list-group">
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="list-group-item">
                      <div className="d-flex justify-content-between">
                        <h6 className="mb-1">
                          {ticket.type === 'bug' && 'Ошибка: '}
                          {ticket.type === 'question' && 'Вопрос: '}
                          {ticket.type === 'suggestion' && 'Предложение: '}
                          {ticket.message}
                        </h6>
                        <Badge
                          bg={ticket.status === 'решено' ? 'success' : 'warning'}
                          className="ms-2"
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                      <small className="text-muted">
                        {new Date(ticket.date).toLocaleDateString('ru-RU')}
                      </small>
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Body>
              <Card.Title>FAQ</Card.Title>
              <Accordion>
                {faqItems.map((item, index) => (
                  <Accordion.Item key={index} eventKey={index.toString()}>
                    <Accordion.Header>{item.question}</Accordion.Header>
                    <Accordion.Body>{item.answer}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>

              <hr className="my-4" />

              <Card.Title>Контакты</Card.Title>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <strong>Email:</strong> support@zi-budgetapp.ru
                </li>
                <li>
                  <strong>Telegram-бот:</strong> @ZiBudgetAppSupportBot
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}