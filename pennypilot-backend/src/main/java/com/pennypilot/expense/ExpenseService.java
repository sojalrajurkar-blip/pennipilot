package com.pennypilot.expense;

import com.pennypilot.expense.dto.ExpenseRequest;
import com.pennypilot.expense.dto.ExpenseResponse;
import com.pennypilot.expense.dto.ExpenseSummaryResponse;

import java.time.LocalDate;
import java.util.List;

/**
 * Service interface for expense business logic.
 */
public interface ExpenseService {

    ExpenseResponse createExpense(ExpenseRequest request);

    List<ExpenseResponse> getAllExpenses(ExpenseCategory category, LocalDate date, LocalDate fromDate, LocalDate toDate);

    ExpenseResponse getExpenseById(Long id);

    ExpenseResponse updateExpense(Long id, ExpenseRequest request);

    void deleteExpense(Long id);

    ExpenseSummaryResponse getSummary(ExpenseCategory category, LocalDate fromDate, LocalDate toDate);
}
