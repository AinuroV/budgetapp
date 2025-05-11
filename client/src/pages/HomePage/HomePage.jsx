import { useState } from 'react'
import { Link } from 'react-router';
import styles from './HomePage.module.css';
import { PlusIcon } from '../../assets/plusIcon'
import { MinusIcon } from '../../assets/minusIcon'
import { features, testimonials, faqItems } from './constants'
export const HomePage = () => {


    const [activeFaq, setActiveFaq] = useState([]);
    const toggleFAQ = (index) => {
        setActiveFaq(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };
    return (
        <>
            <section className='py-5'>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 d-flex flex-column justify-content-center">
                            <h1 className={styles.title}>Контроль финансов - это просто</h1>
                            <p className={styles.subtitle}>
                                Zi-BudgetApp помогает управлять вашими финансами, планировать бюджет
                                и достигать финансовых целей
                            </p>
                            <div className={styles.ctaButtons}>
                                <Link to="/register" className={`btn btn-primary ${styles.ctaBtn}`}>
                                    Попробовать бесплатно
                                </Link>
                            </div>
                        </div>
                        <div className="col-md-6 d-flex justify-content-center">
                            <img
                                width='400px'
                                height='400px'
                                src="/budget.png"
                                alt="Zi-BudgetApp в действии"
                                className={styles.heroImage}
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className='py-5'>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Возможности Zi-BudgetApp</h2>
                    <div className="row">
                        {features.map((feature, index) => (
                            <div className="col-md-4" key={index}>
                                <div className={styles.featureCard}>
                                    <div className={styles.featureIcon}>{feature.icon}</div>
                                    <h3 className={styles.featureTitle}>{feature.title}</h3>
                                    <p className={styles.featureText}>{feature.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className='py-5'>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Отзывы пользователей</h2>
                    <div className="row">
                        {testimonials.map((testimonial, index) => (
                            <div className="col-md-4" key={index}>
                                <div className={styles.testimonialCard}>
                                    <div className={styles.testimonialRating}>
                                        {testimonial.rating}
                                    </div>
                                    <p className={styles.testimonialText}>"{testimonial.text}"</p>
                                    <p className={styles.testimonialAuthor}>— {testimonial.name}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            <section className={styles.faq} id="faq">
                <div className="container">
                    <h2 className={styles.sectionTitle}>Частые вопросы</h2>
                    <div className={styles.faqItems}>
                        {faqItems.map((item, index) => (
                            <div
                                className={`${styles.faqItem} ${activeFaq.includes(index) ? styles.active : ''}`}
                                key={index}
                            >
                                <button
                                    className={styles.faqQuestion}
                                    onClick={() => toggleFAQ(index)}
                                    aria-expanded={activeFaq.includes(index)}
                                    aria-controls={`faq-answer-${index}`}
                                >
                                    <span className={styles.faqQuestionText}>{item.question}</span>
                                    <span className={styles.faqIcon}>
                                        {activeFaq.includes(index) ? (
                                            <MinusIcon />
                                        ) : (
                                            <PlusIcon />
                                        )}
                                    </span>
                                </button>
                                <div
                                    id={`faq-answer-${index}`}
                                    className={styles.faqAnswer}
                                    style={{
                                        maxHeight: activeFaq.includes(index) ? '500px' : '0'
                                    }}
                                >
                                    <div className={styles.faqAnswerContent}>
                                        <p>{item.answer}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    )
}
