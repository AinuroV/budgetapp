import { Container, Card, Accordion } from 'react-bootstrap';

export function HelpPage() {
  const helpSections = [
    {
      title: 'Работа с транзакциями',
      items: [
        {
          question: 'Как добавить транзакцию?',
          answer: 'На странице "Транзакции" нажмите кнопку "Добавить транзакцию" и заполните форму.'
        },
        {
          question: 'Как отредактировать транзакцию?',
          answer: 'Найдите нужную транзакцию в списке и нажмите на кнопку "Редактировать".'
        }
      ]
    },
    {
      title: 'Планирование бюджета',
      items: [
        {
          question: 'Как настроить бюджет?',
          answer: 'На странице "Бюджет" вы можете установить общий месячный бюджет и лимиты по категориям.'
        },
        {
          question: 'Что означают цвета в прогрессе категорий?',
          answer: 'Зеленый - лимит не превышен, желтый - близко к лимиту, красный - лимит превышен.'
        }
      ]
    },
    {
      title: 'Категории',
      items: [
        {
          question: 'Как добавить новую категорию?',
          answer: 'На странице "Категории" нажмите кнопку "Добавить категорию" и заполните форму.'
        }
      ]
    }
  ];

  return (
    <Container className="py-4">
      <h1 className="mb-4">Справка</h1>

      <Card>
        <Card.Body>
          <h5 className="mb-4">Документация по использованию приложения</h5>

          {helpSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-4">
              <h6>{section.title}</h6>
              <Accordion>
                {section.items.map((item, itemIndex) => (
                  <Accordion.Item
                    key={itemIndex}
                    eventKey={`${sectionIndex}-${itemIndex}`}
                  >
                    <Accordion.Header>{item.question}</Accordion.Header>
                    <Accordion.Body>{item.answer}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          ))}
        </Card.Body>
      </Card>
    </Container>
  );
}