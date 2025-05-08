// controllers/FinancialGoalController.js
const { FinancialGoal } = require('../models/models');

// Создать новую финансовую цель
exports.create = async (req, res) => {
  try {
    const { title, targetAmount, currentAmount, deadline } = req.body;
    const userId = req.user.id; // Получаем ID пользователя из middleware аутентификации

    const goal = await FinancialGoal.create({
      title,
      targetAmount,
      currentAmount,
      deadline,
      userId,
    });

    return res.status(201).json(goal);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ошибка сервера при создании цели.' });
  }
};

// Получить все цели текущего пользователя
exports.getAll = async (req, res) => {
  try {
    const userId = req.user.id;
    const goals = await FinancialGoal.findAll({ where: { userId } });
    return res.status(200).json(goals);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ошибка сервера при получении целей.' });
  }
};

// Обновить существующую цель по ID
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, targetAmount, currentAmount, deadline } = req.body;
    const userId = req.user.id;

    // Ищем цель по ID и по ID пользователя (чтобы пользователь мог изменить только свои цели)
    const goal = await FinancialGoal.findOne({ where: { id, userId } });
    if (!goal) {
      return res.status(404).json({ error: 'Цель не найдена.' });
    }

    // Обновляем поля
    goal.title = title !== undefined ? title : goal.title;
    goal.targetAmount = targetAmount !== undefined ? targetAmount : goal.targetAmount;
    goal.currentAmount = currentAmount !== undefined ? currentAmount : goal.currentAmount;
    goal.deadline = deadline !== undefined ? deadline : goal.deadline;

    await goal.save();
    return res.json(goal);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ошибка сервера при обновлении цели.' });
  }
};

// Удалить цель по ID
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Ищем цель, принадлежащую текущему пользователю
    const goal = await FinancialGoal.findOne({ where: { id, userId } });
    if (!goal) {
      return res.status(404).json({ error: 'Цель не найдена.' });
    }

    await goal.destroy();
    return res.json({ message: 'Цель успешно удалена.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Ошибка сервера при удалении цели.' });
  }
};
