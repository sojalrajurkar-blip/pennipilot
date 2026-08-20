-- PennyPilot V1 - Create expenses table
-- Flyway migration: V1__create_expenses_table.sql

CREATE TABLE expenses (
    id             BIGSERIAL PRIMARY KEY,
    title          VARCHAR(150)     NOT NULL,
    amount         NUMERIC(12, 2)   NOT NULL CHECK (amount > 0),
    category       VARCHAR(30)      NOT NULL,
    expense_date   DATE             NOT NULL,
    description    VARCHAR(500),
    created_at     TIMESTAMPTZ      NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ      NOT NULL DEFAULT now(),

    CONSTRAINT chk_expense_category CHECK (
        category IN ('FOOD', 'TRANSPORT', 'SHOPPING', 'BILLS', 'HEALTH', 'ENTERTAINMENT', 'OTHER')
    )
);

CREATE INDEX idx_expenses_category ON expenses (category);
CREATE INDEX idx_expenses_expense_date ON expenses (expense_date);
