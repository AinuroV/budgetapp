import { useState, useEffect } from 'react';
import { Form, Button, Modal, Spinner, Row, Col } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { ColorPicker } from './ColorPicker';
import { useCategoriesStore } from '../../store/categories.store';

export const CategoryForm = ({ category, onClose }) => {
    const { addCategory, updateCategory, isLoading } = useCategoriesStore();
    const [showModal, setShowModal] = useState(!!category);
    const [selectedColor, setSelectedColor] = useState(category?.color || '#563d7c');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: category?.name || '',
            isTypeIncome: category?.isTypeIncome || false,
        },
    });

    useEffect(() => {
        if (category) {
            reset({
                name: category.name,
                isTypeIncome: category.isTypeIncome,
            });
            setSelectedColor(category.color);
        }
    }, [category, reset]);

    const onSubmit = async (data) => {
        const categoryData = {
            ...data,
            color: selectedColor,
        };

        if (category) {
            await updateCategory(category.id, categoryData);
        } else {
            await addCategory(categoryData);
            reset();
            setSelectedColor('#563d7c');
        }

        if (onClose) {
            onClose();
        }
    };

    const handleClose = () => {
        if (onClose) {
            onClose();
        } else {
            reset();
            setSelectedColor('#563d7c');
        }
    };

    return (
        <>
            {!category && (
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={5}>
                            <Form.Group className="mb-3">
                                <Form.Label>Название категории</Form.Label>
                                <Form.Control
                                    type="text"
                                    isInvalid={!!errors.name}
                                    {...register('name', { required: 'Обязательное поле' })}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name?.message}
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>

                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Тип категории</Form.Label>
                                <Form.Select {...register('isTypeIncome')}>
                                    <option value={false}>Расход</option>
                                    <option value={true}>Доход</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col md={3}>
                            <Form.Group className="mb-3">
                                <Form.Label>Цвет</Form.Label>
                                <ColorPicker
                                    selectedColor={selectedColor}
                                    onColorChange={setSelectedColor}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={3}>
                            <Button variant="primary" type="submit" disabled={isLoading}>
                                {isLoading ? (
                                    <Spinner animation="border" size="sm" />
                                ) : (
                                    'Добавить'
                                )}
                            </Button>
                        </Col>
                    </Row>
                </Form>
            )}

            {category && (
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Редактирование категории</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Form.Group className="mb-3">
                                <Form.Label>Название категории</Form.Label>
                                <Form.Control
                                    type="text"
                                    isInvalid={!!errors.name}
                                    {...register('name', { required: 'Обязательное поле' })}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.name?.message}
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Тип категории</Form.Label>
                                <Form.Select {...register('isTypeIncome')}>
                                    <option value={false}>Расход</option>
                                    <option value={true}>Доход</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Цвет</Form.Label>
                                <ColorPicker
                                    selectedColor={selectedColor}
                                    onColorChange={setSelectedColor}
                                />
                            </Form.Group>

                            <div className="d-flex justify-content-end">
                                <Button variant="secondary" onClick={handleClose} className="me-2">
                                    Отмена
                                </Button>
                                <Button variant="primary" type="submit" disabled={isLoading}>
                                    {isLoading ? (
                                        <Spinner animation="border" size="sm" />
                                    ) : (
                                        'Сохранить'
                                    )}
                                </Button>
                            </div>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};