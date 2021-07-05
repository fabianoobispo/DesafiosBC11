import { getRepository, getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  category: string;
  value: number;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    // const transactionsRepository = getRepository(Transaction);
    const categoriesRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    // ----- extra
    if (!['income', 'outcome'].includes(type))
      throw new AppError('Transaction type is invalid');

    if (type === 'outcome' && value > total) {
      throw new AppError('Insufficient funds for this transaction');
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: '',
    });

    const checkCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!checkCategory) {
      const newCategory = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(newCategory);

      transaction.category_id = newCategory.id;
    } else {
      transaction.category_id = checkCategory.id;
    }

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
