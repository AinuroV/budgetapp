import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/auth.store';
import { useBudgetStore } from '../../store/budget.store';
import { Button, Form, Container, Alert, Card, FormCheck, Modal, Spinner } from 'react-bootstrap';
import styles from './RegisterPage.module.css';
import { useState } from 'react';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: signUp, isLoading: isAuthLoading, error: authError } = useAuthStore();
  const { setMonthlyBudget, isLoading: isBudgetLoading, error: budgetError } = useBudgetStore();
  
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [registeredUser, setRegisteredUser] = useState(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const success = await signUp(data.email, data.password);
    if (success) {
      setRegisteredUser(data.email);
      setShowBudgetModal(true);
    }
  };

  const handleBudgetSubmit = async (amount) => {
    const success = await setMonthlyBudget(Number(amount));
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <Container className={styles.authContainer}>
      <Card className={styles.authCard}>
        <Card.Body className={styles.authCardBody}>
          <h2 className="text-center mb-4">Регистрация</h2>
          
          {authError && (
            <Alert variant="danger" className="mb-3">
              {authError}
            </Alert>
          )}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                {...register('email', { 
                  required: 'Email обязателен',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Некорректный email'
                  }
                })}
                isInvalid={!!errors.email}
                placeholder="Введите ваш email"
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Пароль</Form.Label>
              <Form.Control
                type="password"
                {...register('password', { 
                  required: 'Пароль обязателен',
                  minLength: {
                    value: 8,
                    message: 'Пароль должен быть не менее 8 символов'
                  }
                })}
                isInvalid={!!errors.password}
                placeholder="Придумайте пароль"
              />
              <Form.Control.Feedback type="invalid">
                {errors.password?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Подтверждение пароля</Form.Label>
              <Form.Control
                type="password"
                {...register('confirmPassword', {
                  required: 'Подтвердите пароль',
                  validate: value => 
                    value === watch('password') || 'Пароли не совпадают'
                })}
                isInvalid={!!errors.confirmPassword}
                placeholder="Повторите пароль"
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <FormCheck
                {...register('terms', { 
                  required: 'Необходимо принять условия использования' 
                })}
                isInvalid={!!errors.terms}
                label={
                  <>
                    Я принимаю условия использования
                  </>
                }
              />
              {errors.terms && (
                <div className="text-danger" style={{ fontSize: '0.875em' }}>
                  {errors.terms.message}
                </div>
              )}
            </Form.Group>

            <div className="d-grid mb-3">
              <Button 
                variant="primary" 
                type="submit"
                disabled={isAuthLoading}
              >
                {isAuthLoading ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>
            </div>

            <div className="text-center">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-decoration-none">
                Войти
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Модальное окно для установки бюджета */}
      <BudgetModal 
        show={showBudgetModal}
        onHide={() => setShowBudgetModal(false)}
        onSubmit={handleBudgetSubmit}
        isLoading={isBudgetLoading}
        error={budgetError}
        email={registeredUser}
      />
    </Container>
  );
};

const BudgetModal = ({ show, onHide, onSubmit, isLoading, email }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount) {
      onSubmit(amount);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Установите ваш месячный бюджет</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Добро пожаловать, {email}! Перед началом работы укажите ваш месячный бюджет.</p>
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Месячный бюджет</Form.Label>
            <Form.Control
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Введите сумму"
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Пропустить
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={isLoading || !amount}
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="ms-2">Сохранение...</span>
            </>
          ) : 'Сохранить'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};