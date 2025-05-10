import { Link, useNavigate, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { Button, Form, Container, Alert, Card } from 'react-bootstrap';
import { useAuthStore } from '../../store/auth.store';
import styles from './ResetPasswordPage.module.css';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetPassword, isLoading, error,isSuccesReset } = useAuthStore();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: searchParams.get('email') || '',
    }
  });

  const onSubmit = async (data) => {
    const success = await resetPassword(data.email, data.newPassword);
    if (success) {
      navigate('/login', { state: { passwordReset: true } });
    }
  };

  return (
    <Container className={styles.authContainer}>
      <Card className={styles.authCard}>
        <Card.Body className={styles.authCardBody}>
          <h2 className="text-center mb-4">Сброс пароля</h2>
          
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          {isSuccesReset && (
            <Alert variant="success" className="mb-3">
              Пароль успешно изменён! Теперь вы можете войти с новым паролем.
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
                readOnly={!!searchParams.get('email')}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Новый пароль</Form.Label>
              <Form.Control
                type="password"
                {...register('newPassword', { 
                  required: 'Пароль обязателен',
                  minLength: {
                    value: 8,
                    message: 'Пароль должен быть не менее 8 символов'
                  }
                })}
                isInvalid={!!errors.newPassword}
                placeholder="Придумайте новый пароль"
              />
              <Form.Control.Feedback type="invalid">
                {errors.newPassword?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Подтверждение пароля</Form.Label>
              <Form.Control
                type="password"
                {...register('confirmPassword', {
                  required: 'Подтвердите пароль',
                  validate: value => 
                    value === watch('newPassword') || 'Пароли не совпадают'
                })}
                isInvalid={!!errors.confirmPassword}
                placeholder="Повторите новый пароль"
              />
              <Form.Control.Feedback type="invalid">
                {errors.confirmPassword?.message}
              </Form.Control.Feedback>
            </Form.Group>

            <div className="d-grid mb-3">
              <Button 
                variant="primary" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Сохранение...' : 'Сохранить новый пароль'}
              </Button>
            </div>

            <div className="text-center">
              <Link to="/login" className="text-decoration-none">
                Вернуться к входу
              </Link>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}