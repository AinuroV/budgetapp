import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useTransactionsStore } from '../../store/transactions.store';
import { useCategoriesStore } from '../../store/categories.store';
import { useBudgetStore } from '../../store/budget.store';
import { useUIStore } from '../../store/ui.store';
import { useEffect } from 'react';

export function TransactionModal() {
    const { addTransaction, isLoading: isAdding } = useTransactionsStore();
    const { setMonthlyBudget,monthlyBudget } = useBudgetStore()
    const { expenseCategories, incomeCategories, fetchCategories } = useCategoriesStore();
    const { currentModal, closeModal } = useUIStore();
    const isOpen = currentModal === 'transaction';

    const balance = Number(monthlyBudget?.amount)

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            type: 'expense',
            category_id: '',
            amount: '',
            date: new Date().toISOString().split('T')[0],
            description: ''
        }
    });

    const transactionType = watch('type');

    // Загружаем категории при открытии модалки
    useEffect(() => {
        if (isOpen) {
            fetchCategories();
            reset(); // Сбрасываем форму при каждом открытии
        }
    }, [isOpen, fetchCategories, reset]);

    const onSubmit = async (data) => {
        const success = await addTransaction({
            type: data.type,
            amount: Number(data.amount),
            date: data.date,
            description: data.description,
            category_id: data.category_id
        });

        const successBudget = await setMonthlyBudget(Number(data.amount)+balance)

        if (success && successBudget) {
            closeModal('transaction');
        }
    };

    // Автоматически выбираем первую категорию при изменении типа
    useEffect(() => {
        if (transactionType === 'expense' && expenseCategories.length > 0) {
            setValue('category_id', expenseCategories[0].id);
        } else if (transactionType === 'income' && incomeCategories.length > 0) {
            setValue('category_id', incomeCategories[0].id);
        } else {
            setValue('category_id', '');
        }
    }, [transactionType, expenseCategories, incomeCategories, setValue]);

    return (
        <Modal show={isOpen} onHide={() => closeModal('transaction')}>
            <Modal.Header closeButton>
                <Modal.Title>Добавить транзакцию</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Тип транзакции</Form.Label>
                        <div>
                            <Form.Check
                                inline
                                label="Доход"
                                type="radio"
                                value="income"
                                {...register('type')}
                            />
                            <Form.Check
                                inline
                                label="Расход"
                                type="radio"
                                value="expense"
                                {...register('type')}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>
                            {transactionType === 'income' ? 'Категория дохода' : 'Категория расхода'}
                        </Form.Label>
                        <Form.Select
                            {...register('category_id', {
                                required: 'Выберите категорию'
                            })}
                            isInvalid={!!errors.category_id}
                        >
                            {transactionType === 'income' ? (
                                <>
                                    {incomeCategories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {expenseCategories.map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </>
                            )}
                        </Form.Select>
                        {errors.category_id && (
                            <Form.Control.Feedback type="invalid">
                                {errors.category_id.message}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Сумма</Form.Label>
                        <Form.Control
                            type="number"
                            {...register('amount', {
                                required: 'Введите сумму',
                            })}
                            isInvalid={!!errors.amount}
                        />
                        {errors.amount && (
                            <Form.Control.Feedback type="invalid">
                                {errors.amount.message}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Дата</Form.Label>
                        <Form.Control
                            type="date"
                            {...register('date', { required: 'Укажите дату' })}
                            isInvalid={!!errors.date}
                        />
                        {errors.date && (
                            <Form.Control.Feedback type="invalid">
                                {errors.date.message}
                            </Form.Control.Feedback>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Описание</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={2}
                            {...register('description')}
                            placeholder="Необязательное описание"
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => closeModal('transaction')}
                        disabled={isAdding}
                    >
                        Отмена
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isAdding}
                    >
                        {isAdding ? (
                            <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                <span className="ms-2">Добавляем...</span>
                            </>
                        ) : 'Добавить'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
}