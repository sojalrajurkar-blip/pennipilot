package com.pennypilot.expense;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * Spring Data JPA repository for Expense entities.
 * Filtering methods will be added here as JPQL or derived queries.
 */
@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByCategory(ExpenseCategory category);

    List<Expense> findByExpenseDate(LocalDate expenseDate);

    List<Expense> findByExpenseDateBetween(LocalDate fromDate, LocalDate toDate);

    List<Expense> findByCategoryAndExpenseDateBetween(ExpenseCategory category, LocalDate fromDate, LocalDate toDate);
}
