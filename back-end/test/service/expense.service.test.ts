import expenseDb from '../../repository/expense.db';
import expenseService from '../../service/expense.service';
import { Expense } from '../../model/expense';

const mockExpenses = [
    new Expense({ id: 1, totalCost: 100, month: '12-2024' }),
    new Expense({ id: 2, totalCost: 200, month: '11-2024' }),
];

let mockExpenseDbGetAllExpenses: jest.Mock;
let mockExpenseDbCreateExpense: jest.Mock;

beforeEach(() => {
    mockExpenseDbGetAllExpenses = jest.fn();
    mockExpenseDbCreateExpense = jest.fn();
});

afterEach(() => {
    jest.clearAllMocks();
});

test('given valid expenses in the database, when getAllExpenses is called, then expenses are returned', async () => {
    // given
    expenseDb.getAllExpenses = mockExpenseDbGetAllExpenses.mockResolvedValue([mockExpenses]);

    // when
    const result = await expenseService.getAllExpenses();

    // then
    expect(result).toEqual([mockExpenses]);
    expect(mockExpenseDbGetAllExpenses).toHaveBeenCalledTimes(1);
});

test('given valid cost, when createExpense is called, then expense is created', async () => {
    // given
    const cost = 150;
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const mockExpense = new Expense({ id: 1, totalCost: cost, month: `${month}-${year}` });

    expenseDb.createExpense = mockExpenseDbCreateExpense.mockResolvedValue([mockExpense]);

    // when
    const result = await expenseDb.createExpense(cost);

    // then
    expect(result).toEqual([mockExpense]);
    expect(mockExpenseDbCreateExpense).toHaveBeenCalledTimes(1);
    expect(mockExpenseDbCreateExpense).toHaveBeenCalledWith(cost);
});
