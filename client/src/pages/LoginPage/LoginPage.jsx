import { Link, useNavigate } from 'react-router';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../store/auth.store';
import { Button, Form, Container, Alert, Card } from 'react-bootstrap';
import styles from './LoginPage.module.css';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login, isLoading, error } = useAuthStore();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        const success = await login(data.email, data.password);
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <Container className={styles.authContainer}>
            <Card className={styles.authCard}>
                <Card.Body className={styles.authCardBody}>
                    <h2 className="text-center mb-4">Вход в BudgetApp</h2>

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
                                        value: 6,
                                        message: 'Пароль должен быть не менее 6 символов'
                                    }
                                })}
                                isInvalid={!!errors.password}
                                placeholder="Введите пароль"
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <div className="d-grid mb-3">
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Вход...' : 'Войти'}
                            </Button>
                        </div>

                        <div className="text-center">
                            <Link
                                to="/reset-password"
                                className="text-decoration-none"
                            >
                                Забыли пароль?
                            </Link>
                            <span className="mx-2">•</span>
                            <Link
                                to="/register"
                                className="text-decoration-none"
                            >
                                Регистрация
                            </Link>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};
