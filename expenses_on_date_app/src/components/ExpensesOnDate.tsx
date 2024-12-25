import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface Expense {
  date: string;
  category: string;
  amount: number;
}

const ExpensesOnDate = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState<Expense>({
    date: new Date().toISOString().slice(0, 10),
    category: '',
    amount: 0,
  });
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [categories, setCategories] = useState([
    { value: 'Food', label: 'Food' },
    { value: 'Transportation', label: 'Transportation' },
    { value: 'Entertainment', label: 'Entertainment' },
    { value: 'Other', label: 'Other' },
  ]);
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    const storedExpenses = localStorage.getItem('expenses');
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
    const totalExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    setRemainingAmount(monthlyIncome - totalExpenses);
  }, [expenses, monthlyIncome]);

  const handleAddExpense = () => {
    if (newExpense.date && newExpense.category && newExpense.amount > 0) {
      setExpenses([...expenses, newExpense]);
      setNewExpense({
        date: new Date().toISOString().slice(0, 10),
        category: '',
        amount: 0,
      });
      setCustomCategory('');
    }
  };

  const handleMonthlyIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMonthlyIncome(Number(e.target.value));
  };

  const handleDeleteExpense = (index: number) => {
    setExpenses(expenses.filter((expense, i) => i !== index));
  };

  const handleExpenseChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof Expense
  ) => {
    const value = field === 'amount' ? Number(e.target.value) : e.target.value;
    setNewExpense({ ...newExpense, [field]: value });
  };

  const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomCategory(e.target.value);
    setNewExpense((prev) => ({
      ...prev,
      category: e.target.value,
    }));
  };

  const data = expenses.map(expense => ({ name: expense.date, amount: expense.amount, category: expense.category }));

  return (
    <div className="max-w-5xl mx-auto p-4 mt-4">
      <h1 className="text-3xl font-bold mb-4">Expenses On Date</h1>
      <div className="flex flex-col mb-4">
        <label className="mb-2 text-gray-600">Monthly Income:</label>
        <input
          type="number"
          value={monthlyIncome === 0 ? '' : monthlyIncome}
          onChange={handleMonthlyIncomeChange}
          placeholder="Monthly Income"
          className="p-2 border border-gray-300 rounded-lg placeholder:text-gray-600"
        />
        <label className="mb-2 mt-4 text-gray-600">Remaining Amount: {remainingAmount === 0 ? '' : `$${remainingAmount}`}</label>
      </div>
      <div className="flex flex-col mb-4">
        <h2 className="text-2xl font-bold mb-4">Expenses List</h2>
        <table className="w-full table-auto">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">S.No</th>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Amount Spent</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2">New</td>
              <td className="px-4 py-2">
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => handleExpenseChange(e, 'date')}
                  className="p-2 border border-gray-300 rounded-lg w-full"
                />
              </td>
              <td className="px-4 py-2">
                <select
                  value={newExpense.category}
                  onChange={(e) => handleExpenseChange(e, 'category')}
                  className="p-2 border border-gray-300 rounded-lg w-full"
                >
                  <option value="" className="text-gray-600">Select Category</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>

                {newExpense.category === 'Other' && (
                  <input
                    type="text"
                    value={customCategory}
                    onChange={handleCustomCategoryChange}
                    placeholder="Enter custom category"
                    className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
                  />
                )}
              </td>
              <td className="px-4 py-2">
                <input
                  type="number"
                  value={newExpense.amount === 0 ? '' : newExpense.amount}
                  onChange={(e) => handleExpenseChange(e, 'amount')}
                  placeholder="Amount"
                  className="p-2 border border-gray-300 rounded-lg w-full placeholder:text-gray-600"
                />
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={handleAddExpense}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Add
                </button>
              </td>
            </tr>
            {expenses.map((expense, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{expense.date}</td>
                <td className="px-4 py-2">{expense.category}</td>
                <td className="px-4 py-2">${expense.amount}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDeleteExpense(index)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col mb-4">
        <h2 className="text-2xl font-bold mb-4">Monthly Expenses</h2>
        <LineChart width={500} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </div>
    </div>
  );
};

export default ExpensesOnDate;
