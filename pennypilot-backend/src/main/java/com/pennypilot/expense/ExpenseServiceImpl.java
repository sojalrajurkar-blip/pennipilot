package com.pennypilot.expense;

import com.pennypilot.exception.ResourceNotFoundException;
import com.pennypilot.expense.dto.ExpenseRequest;
import com.pennypilot.expense.dto.ExpenseResponse;
import com.pennypilot.expense.dto.ExpenseSummaryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * Service implementation for expense business logic.
 */
@Service
@RequiredArgsConstructor
@Transactional
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final ExpenseMapper expenseMapper;

    @Override
    public ExpenseResponse createExpense(ExpenseRequest request) {
        Expense expense = expenseMapper.toEntity(request);
        Expense saved = expenseRepository.save(expense);
        return expenseMapper.toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ExpenseResponse> getAllExpenses(ExpenseCategory category, LocalDate date, LocalDate fromDate, LocalDate toDate) {
        List<Expense> expenses;

        if (category != null && fromDate != null && toDate != null) {
            expenses = expenseRepository.findByCategoryAndExpenseDateBetween(category, fromDate, toDate);
        } else if (category != null) {
            expenses = expenseRepository.findByCategory(category);
        } else if (date != null) {
            expenses = expenseRepository.findByExpenseDate(date);
        } else if (fromDate != null && toDate != null) {
            expenses = expenseRepository.findByExpenseDateBetween(fromDate, toDate);
        } else {
            expenses = expenseRepository.findAll();
        }

        return expenses.stream().map(expenseMapper::toResponse).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseResponse getExpenseById(Long id) {
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        return expenseMapper.toResponse(expense);
    }

    @Override
    public ExpenseResponse updateExpense(Long id, ExpenseRequest request) {
        Expense existing = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
        expenseMapper.updateEntityFromRequest(request, existing);
        Expense updated = expenseRepository.save(existing);
        return expenseMapper.toResponse(updated);
    }

    @Override
    public void deleteExpense(Long id) {
        if (!expenseRepository.existsById(id)) {
            throw new ResourceNotFoundException("Expense not found with id: " + id);
        }
        expenseRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public ExpenseSummaryResponse getSummary(ExpenseCategory category, LocalDate fromDate, LocalDate toDate) {
        List<Expense> expenses;

        if (category != null && fromDate != null && toDate != null) {
            expenses = expenseRepository.findByCategoryAndExpenseDateBetween(category, fromDate, toDate);
        } else if (category != null) {
            expenses = expenseRepository.findByCategory(category);
        } else if (fromDate != null && toDate != null) {
            expenses = expenseRepository.findByExpenseDateBetween(fromDate, toDate);
        } else {
            expenses = expenseRepository.findAll();
        }

        BigDecimal totalAmount = expenses.stream()
                .map(Expense::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new ExpenseSummaryResponse(totalAmount, (long) expenses.size());
    }
}
