import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/auth.store';
import { Button, Form, Container, Alert, Card, FormCheck } from 'react-bootstrap';
import styles from './RegisterPage.module.css';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register: signUp, isLoading, error } = useAuthStore();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const success = await signUp(data.email, data.password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <Container className={styles.authContainer}>
      <Card className={styles.authCard}>
        <Card.Body className={styles.authCardBody}>
          <h2 className="text-center mb-4">Регистрация в BudgetApp</h2>
          
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
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
                disabled={isLoading}
              >
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
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
    </Container>
  );
};