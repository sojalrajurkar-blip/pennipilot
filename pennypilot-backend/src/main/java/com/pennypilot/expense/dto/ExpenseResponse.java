package com.pennypilot.expense.dto;

import com.pennypilot.expense.ExpenseCategory;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

/**
 * Response DTO representing a single expense returned from the API.
 */
public record ExpenseResponse(
        Long id,
        String title,
        BigDecimal amount,
        ExpenseCategory category,
        LocalDate expenseDate,
        String description,
        Instant createdAt,
        Instant updatedAt
) {}
