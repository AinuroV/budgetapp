import { useEffect, useState, useRef } from 'react';
import {
    Container,
    Row,
    Col,
    Card,
    Button,
    Form,
    Spinner,
    Alert
} from 'react-bootstrap';
import { Chart } from 'chart.js';
import { useTransactionsStore } from '../../store/transactions.store';
import { useUIStore } from '../../store/ui.store';

export function StatisticsPage() {
    const { transactions, isLoading } = useTransactionsStore();
    const { addToast } = useUIStore();


    const [dateRange, setDateRange] = useState('all');
    const [activeChart, setActiveChart] = useState('line');

    const lineChartRef = useRef(null);
    const barChartRef = useRef(null);
    const lineChartInstance = useRef(null);
    const barChartInstance = useRef(null);

    useEffect(() => {
        if (transactions.length > 0) {
            renderCharts();
        }
        return () => {
            // Уничтожаем графики при размонтировании
            if (lineChartInstance.current) {
                lineChartInstance.current.destroy();
            }
            if (barChartInstance.current) {
                barChartInstance.current.destroy();
            }
        };
    }, [transactions, dateRange, activeChart]);

    const renderCharts = () => {
        const { lineData, barData } = prepareChartData();

        if (activeChart === 'line' && lineChartRef.current) {
            if (lineChartInstance.current) {
                lineChartInstance.current.destroy();
            }
            lineChartInstance.current = new Chart(lineChartRef.current.getContext('2d'), {
                type: 'line',
                data: lineData,
                options: getLineOptions()
            });
        }

        if (activeChart === 'bar' && barChartRef.current) {
            if (barChartInstance.current) {
                barChartInstance.current.destroy();
            }
            barChartInstance.current = new Chart(barChartRef.current.getContext('2d'), {
                type: 'bar',
                data: barData,
                options: getBarOptions()
            });
        }
    };

    const prepareChartData = () => {
        // Фильтрация транзакций по выбранному периоду
        const now = new Date();
        let startDate = new Date();

        switch (dateRange) {
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
            default:
                startDate = new Date(transactions[transactions.length - 1].date);
        }

        const filteredTransactions = transactions.filter(t =>
            new Date(t.date) >= startDate
        );

        // Подготовка данных для линейного графика
        const dailyData = filteredTransactions.reduce((acc, t) => {
            const date = t.date.split('T')[0];
            if (!acc[date]) {
                acc[date] = { income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                acc[date].income += t.amount;
            } else {
                acc[date].expense += t.amount;
            }
            return acc;
        }, {});

        const dates = Object.keys(dailyData).sort();
        const lineData = {
            labels: dates,
            datasets: [
                {
                    label: 'Доходы',
                    data: dates.map(date => dailyData[date].income),
                    borderColor: '#28a745',
                    backgroundColor: 'rgba(40, 167, 69, 0.1)',
                    tension: 0.1
                },
                {
                    label: 'Расходы',
                    data: dates.map(date => dailyData[date].expense),
                    borderColor: '#dc3545',
                    backgroundColor: 'rgba(220, 53, 69, 0.1)',
                    tension: 0.1
                }
            ]
        };

        // Подготовка данных для столбчатой диаграммы
        const monthlyData = filteredTransactions.reduce((acc, t) => {
            const date = new Date(t.date);
            const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
            if (!acc[monthYear]) {
                acc[monthYear] = { income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                acc[monthYear].income += t.amount;
            } else {
                acc[monthYear].expense += t.amount;
            }
            return acc;
        }, {});

        const months = Object.keys(monthlyData).sort((a, b) => {
            const [aMonth, aYear] = a.split('/').map(Number);
            const [bMonth, bYear] = b.split('/').map(Number);
            return aYear - bYear || aMonth - bMonth;
        });

        const barData = {
            labels: months.map(m => {
                const [month, year] = m.split('/');
                return `${getMonthName(parseInt(month) - 1)} ${year}`;
            }),
            datasets: [
                {
                    label: 'Доходы',
                    data: months.map(m => monthlyData[m].income),
                    backgroundColor: '#28a745',
                },
                {
                    label: 'Расходы',
                    data: months.map(m => monthlyData[m].expense),
                    backgroundColor: '#dc3545',
                }
            ]
        };

        return { lineData, barData };
    };

    const getLineOptions = () => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Доходы и расходы'
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    });

    const getBarOptions = () => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: 'Сравнение доходов и расходов по месяцам'
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    });

    const getMonthName = (monthIndex) => {
        const months = [
            'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
            'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'
        ];
        return months[monthIndex];
    };

    const handleExportCSV = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Дата,Тип,Категория,Сумма,Описание\n";

        transactions.forEach(t => {
            const row = [
                t.date,
                t.type === 'income' ? 'Доход' : 'Расход',
                t.categoryId || '',
                t.amount,
                t.description || ''
            ].join(',');
            csvContent += row + "\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "transactions.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        addToast({
            variant: 'success',
            title: 'Экспорт данных',
            message: 'Данные успешно экспортированы в CSV',
            delay: 3000
        });
    };

    return (
        <Container className="py-4">
            <Row className="mb-4 align-items-center">
                <Col>
                    <h1>Детальная статистика</h1>
                </Col>
                <Col xs="auto">
                    <Button
                        variant="outline-primary"
                        onClick={handleExportCSV}
                    >
                        Экспорт в CSV
                    </Button>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Период</Form.Label>
                        <Form.Select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                        >
                            <option value="week">Неделя</option>
                            <option value="month">Месяц</option>
                            <option value="year">Год</option>
                            <option value="all">Весь период</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col md={4}>
                    <Form.Group>
                        <Form.Label>Тип графика</Form.Label>
                        <Form.Select
                            value={activeChart}
                            onChange={(e) => setActiveChart(e.target.value)}
                        >
                            <option value="line">Динамика</option>
                            <option value="bar">Сравнение месяцев</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>

            {isLoading && !transactions.length ? (
                <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : transactions.length === 0 ? (
                <Alert variant="info">Нет данных для отображения</Alert>
            ) : (
                <Card className="mb-4">
                    <Card.Body style={{ position: 'relative', height: '500px' }}>
                        {activeChart === 'line' ? (
                            <canvas ref={lineChartRef} />
                        ) : (
                            <canvas ref={barChartRef} />
                        )}
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
}