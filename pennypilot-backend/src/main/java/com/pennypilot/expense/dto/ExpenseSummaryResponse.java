package com.pennypilot.expense.dto;

import java.math.BigDecimal;

/**
 * Response DTO for expense summary (total amount + total count).
 */
public record ExpenseSummaryResponse(
        BigDecimal totalAmount,
        Long totalCount
) {}
