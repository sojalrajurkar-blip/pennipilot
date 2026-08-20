package com.pennypilot.expense;

/**
 * Allowed expense categories in PennyPilot V1.
 * Stored as a VARCHAR in the database using @Enumerated(EnumType.STRING).
 */
public enum ExpenseCategory {
    FOOD,
    TRANSPORT,
    SHOPPING,
    BILLS,
    HEALTH,
    ENTERTAINMENT,
    OTHER
}
