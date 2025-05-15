import { Card } from 'react-bootstrap';
import { useEffect, useRef, useState } from 'react';
import {useCategoriesStore} from '../../store/categories.store';
import {useTransactionsStore} from '../../store/transactions.store';

export function CategoryChart() {
  const { expenseCategories } = useCategoriesStore();
  const { transactions } = useTransactionsStore();
  const [categoryData, setCategoryData] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(null);
  const svgRef = useRef(null);
  const size = 300;
  const center = size / 2;
  const radius = size / 2 - 10;

  useEffect(() => {
    if (expenseCategories.length > 0 && transactions.length > 0) {
      // Группируем расходы по категориям
      const categoryMap = {};
      expenseCategories.forEach(cat => {
        categoryMap[cat.id] = {
          name: cat.name,
          color: cat.color || '#999',
          amount: 0
        };
      });

      transactions
        .filter(t => t.type === 'expense')
        .forEach(t => {
          if (categoryMap[t.category_id]) {
            categoryMap[t.category_id].amount += Number(t.amount);
          }
        });

      // Фильтруем категории с расходами и сортируем
      const data = Object.values(categoryMap)
        .filter(cat => cat.amount > 0)
        .sort((a, b) => b.amount - a.amount);

      setCategoryData(data);
    }
  }, [expenseCategories, transactions]);

  // Рассчитываем параметры для секторов диаграммы
  const getSectorPath = (startAngle, endAngle) => {
    const start = polarToCartesian(center, center, radius, endAngle);
    const end = polarToCartesian(center, center, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
    
    return [
      `M ${center} ${center}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      'Z'
    ].join(' ');
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  const highlightCategory = (index) => {
    setHighlightedIndex(index);
  };

  const renderSectors = () => {
    if (categoryData.length === 0) return null;
    
    const total = categoryData.reduce((sum, cat) => sum + cat.amount, 0);
    let startAngle = 0;
    
    return categoryData.map((cat, index) => {
      const angle = (cat.amount / total) * 360;
      const endAngle = startAngle + angle;
      const path = getSectorPath(startAngle, endAngle);
      startAngle = endAngle;
      
      // Эффект подсветки
      const isHighlighted = highlightedIndex === index;
      const highlightColor = isHighlighted ? 
        adjustBrightness(cat.color, 20) : 
        cat.color;

      return (
        <g key={index}>
          <path
            d={path}
            fill={highlightColor}
            stroke="#fff"
            strokeWidth="1"
            onMouseEnter={() => highlightCategory(index)}
            onMouseLeave={() => highlightCategory(null)}
            style={{ transition: 'all 0.2s ease' }}
          />
        </g>
      );
    });
  };

  // Функция для изменения яркости цвета
  const adjustBrightness = (color, percent) => {
    const num = parseInt(color.replace('#', '')), 
          amt = Math.round(2.55 * percent),
          R = (num >> 16) + amt,
          G = (num >> 8 & 0x00FF) + amt,
          B = (num & 0x0000FF) + amt;
    
    return '#' + (
      0x1000000 + 
      (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 + 
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 + 
      (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Расходы по категориям</Card.Title>
        <div className="d-flex flex-column align-items-center">
          <svg 
            ref={svgRef} 
            width={size} 
            height={size} 
            viewBox={`0 0 ${size} ${size}`}
            className="mb-3"
          >
            {renderSectors()}
            <circle cx={center} cy={center} r={radius * 0.3} fill="#fff" />
            <text 
              x={center} 
              y={center} 
              textAnchor="middle" 
              dominantBaseline="middle"
              className="fw-bold"
            >
              {categoryData.length > 0 
                ? Math.round(categoryData.reduce((sum, cat) => sum + cat.amount, 0)) + ' ₽'
                : 'Нет данных'}
            </text>
          </svg>
          
          <div className="w-100">
            {categoryData.map((cat, index) => (
              <div 
                key={index} 
                className={`d-flex align-items-center mb-2 p-2 rounded ${highlightedIndex === index ? 'bg-light' : ''}`}
                onMouseEnter={() => highlightCategory(index)}
                onMouseLeave={() => highlightCategory(null)}
                style={{ cursor: 'pointer', transition: 'background-color 0.2s' }}
              >
                <div 
                  style={{
                    width: '12px',
                    height: '12px',
                    backgroundColor: highlightedIndex === index ? adjustBrightness(cat.color, 20) : cat.color,
                    borderRadius: '2px',
                    marginRight: '8px',
                    transition: 'all 0.2s'
                  }} 
                />
                <div className="flex-grow-1">
                  <span className={highlightedIndex === index ? 'fw-bold' : ''}>
                    {cat.name}
                  </span>
                  <span className="float-end">
                    {Math.round((cat.amount / categoryData.reduce((sum, c) => sum + c.amount, 0)) * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}