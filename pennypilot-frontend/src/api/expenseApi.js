import axiosClient from './axiosClient';

export const expenseApi = {
  // GET /api/v1/expenses (with optional category, date, fromDate, toDate filters)
  getAllExpenses: (params = {}) => {
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    return axiosClient.get('/expenses', { params: cleanParams });
  },

  // GET /api/v1/expenses/{id}
  getExpenseById: (id) => axiosClient.get(`/expenses/${id}`),

  // POST /api/v1/expenses
  createExpense: (data) => axiosClient.post('/expenses', data),

  // PUT /api/v1/expenses/{id}
  updateExpense: (id, data) => axiosClient.put(`/expenses/${id}`, data),

  // DELETE /api/v1/expenses/{id}
  deleteExpense: (id) => axiosClient.delete(`/expenses/${id}`),

  // GET /api/v1/expenses/summary
  getExpenseSummary: (params = {}) => {
    const cleanParams = {};
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    return axiosClient.get('/expenses/summary', { params: cleanParams });
  },

  // GET /api/v1/categories
  getCategories: () => axiosClient.get('/categories'),
};
