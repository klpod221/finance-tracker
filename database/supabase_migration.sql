-- ==============================
-- User Profile
-- ==============================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT,
    currency TEXT DEFAULT 'VND',
    timezone TEXT DEFAULT 'Asia/Bangkok',
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE 
);

-- ==============================
-- Expense Categories
-- ==============================
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    limit NUMERIC DEFAULT 0 CHECK (limit >= 0),
    period TEXT DEFAULT 'monthly' CHECK (period IN ('daily', 'weekly', 'monthly')),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    color TEXT DEFAULT '#a0dc50',
    icon TEXT DEFAULT 'DollarCircleOutline',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, name),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================
-- Financial Groups
-- ==============================
DROP TABLE IF EXISTS groups;
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID NOT NULL,
    balance NUMERIC DEFAULT 0 CHECK (balance >= 0),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (name, owner_id),
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================
-- Group Members
-- ==============================
DROP TABLE IF EXISTS group_members;
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'member')),
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (group_id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- ==============================
-- Savings and Investments
-- ==============================
CREATE TABLE savings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#000000',
    icon TEXT,
    target_amount NUMERIC NOT NULL CHECK (target_amount > 0),
    current_amount NUMERIC DEFAULT 0 CHECK (current_amount >= 0),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================
-- Transactions
-- ==============================
DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    group_id UUID,
    category_id UUID,
    savings_id UUID,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    note TEXT,
    date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (savings_id) REFERENCES savings(id) ON DELETE SET NULL
);

-- ==============================
-- Notifications
-- ==============================
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================
-- User Balances
-- ==============================
DROP TABLE IF EXISTS user_balances;
CREATE TABLE user_balances (
    user_id UUID PRIMARY KEY,
    total_income NUMERIC DEFAULT 0 CHECK (total_income >= 0),
    total_expense NUMERIC DEFAULT 0 CHECK (total_expense >= 0),
    balance NUMERIC DEFAULT 0 CHECK (balance >= 0),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================
-- Group Balances
-- ==============================
DROP TABLE IF EXISTS group_balances;
CREATE TABLE group_balances (
    group_id UUID PRIMARY KEY,
    total_income NUMERIC DEFAULT 0 CHECK (total_income >= 0),
    total_expense NUMERIC DEFAULT 0 CHECK (total_expense >= 0),
    balance NUMERIC DEFAULT 0 CHECK (balance >= 0),
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- ==============================
-- Trigger to update user balance on new transaction
-- ==============================
CREATE OR REPLACE FUNCTION update_user_balances()
RETURNS TRIGGER AS $$
BEGIN
    -- If it is an expense transaction
    IF (NEW.category_id IS NOT NULL AND (SELECT type FROM categories WHERE id = NEW.category_id) = 'expense') THEN
        UPDATE user_balances
        SET total_expense = total_expense + NEW.amount,
            balance = balance - NEW.amount
        WHERE user_id = NEW.user_id;
    -- If it is an income transaction
    ELSIF (NEW.category_id IS NOT NULL AND (SELECT type FROM categories WHERE id = NEW.category_id) = 'income') THEN
        UPDATE user_balances
        SET total_income = total_income + NEW.amount,
            balance = balance + NEW.amount
        WHERE user_id = NEW.user_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_balances
AFTER INSERT ON transactions
FOR EACH ROW EXECUTE FUNCTION update_user_balances();

-- ==============================
-- Trigger to update group balance on new transaction
-- ==============================
CREATE OR REPLACE FUNCTION update_group_balances()
RETURNS TRIGGER AS $$
BEGIN
    -- If the transaction belongs to a group
    IF NEW.group_id IS NOT NULL THEN
        -- If it is an expense transaction
        IF (NEW.category_id IS NOT NULL AND (SELECT type FROM categories WHERE id = NEW.category_id) = 'expense') THEN
            UPDATE group_balances
            SET total_expense = total_expense + NEW.amount,
                balance = balance - NEW.amount
            WHERE group_id = NEW.group_id;
        -- If it is an income transaction
        ELSIF (NEW.category_id IS NOT NULL AND (SELECT type FROM categories WHERE id = NEW.category_id) = 'income') THEN
            UPDATE group_balances
            SET total_income = total_income + NEW.amount,
                balance = balance + NEW.amount
            WHERE group_id = NEW.group_id;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_group_balances
AFTER INSERT ON transactions
FOR EACH ROW EXECUTE FUNCTION update_group_balances();

-- ==============================
-- Trigger to update user balance on transaction update or delete
-- ==============================
CREATE OR REPLACE FUNCTION adjust_user_balances()
RETURNS TRIGGER AS $$
BEGIN
    -- Remove old transaction from user_balances
    IF (OLD.category_id IS NOT NULL AND (SELECT type FROM categories WHERE id = OLD.category_id) = 'expense') THEN
        UPDATE user_balances
        SET total_expense = total_expense - OLD.amount,
            balance = balance + OLD.amount
        WHERE user_id = OLD.user_id;
    ELSIF (OLD.category_id IS NOT NULL AND (SELECT type FROM categories WHERE id = OLD.category_id) = 'income') THEN
        UPDATE user_balances
        SET total_income = total_income - OLD.amount,
            balance = balance - OLD.amount
        WHERE user_id = OLD.user_id;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_adjust_user_balances
AFTER DELETE ON transactions
FOR EACH ROW EXECUTE FUNCTION adjust_user_balances();

-- ==============================
-- Trigger to update group balance on transaction update or delete
-- ==============================
CREATE OR REPLACE FUNCTION adjust_group_balances()
RETURNS TRIGGER AS $$
BEGIN
    -- If the transaction belongs to a group
    IF OLD.group_id IS NOT NULL THEN
        -- Remove old transaction from group_balances
        IF (OLD.category_id IS NOT NULL AND (SELECT type FROM categories WHERE id = OLD.category_id) = 'expense') THEN
            UPDATE group_balances
            SET total_expense = total_expense - OLD.amount,
                balance = balance + OLD.amount
            WHERE group_id = OLD.group_id;
        ELSIF (OLD.category_id IS NOT NULL AND (SELECT type FROM categories WHERE id = OLD.category_id) = 'income') THEN
            UPDATE group_balances
            SET total_income = total_income - OLD.amount,
                balance = balance - OLD.amount
            WHERE group_id = OLD.group_id;
        END IF;
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_adjust_group_balances
AFTER DELETE ON transactions
FOR EACH ROW EXECUTE FUNCTION adjust_group_balances();

-- ==============================
-- Daily Transactions
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS daily_transactions;
CREATE MATERIALIZED VIEW daily_transactions AS
SELECT 
    user_id,
    DATE(date) AS transaction_date,
    SUM(CASE WHEN c.type = 'income' THEN amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN c.type = 'expense' THEN amount ELSE 0 END) AS total_expense
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
GROUP BY user_id, transaction_date;

-- ==============================
-- Monthly Transactions
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS monthly_transactions;
CREATE MATERIALIZED VIEW monthly_transactions AS
SELECT 
    user_id,
    DATE_TRUNC('month', date) AS transaction_month,
    SUM(CASE WHEN c.type = 'income' THEN amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN c.type = 'expense' THEN amount ELSE 0 END) AS total_expense
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
GROUP BY user_id, transaction_month;

-- ==============================
-- Yearly Transactions
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS yearly_transactions;
CREATE MATERIALIZED VIEW yearly_transactions AS
SELECT 
    user_id,
    DATE_TRUNC('year', date) AS transaction_year,
    SUM(CASE WHEN c.type = 'income' THEN amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN c.type = 'expense' THEN amount ELSE 0 END) AS total_expense
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
GROUP BY user_id, transaction_year;

-- ==============================
-- Category Transactions
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS category_transactions;
CREATE MATERIALIZED VIEW category_transactions AS
SELECT 
    t.user_id,
    c.id AS category_id,
    c.name AS category_name,
    c.type AS category_type,
    SUM(amount) AS total_amount
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
GROUP BY t.user_id, c.id, c.name, c.type;

-- ==============================
-- Daily Category Transactions
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS daily_category_transactions;
CREATE MATERIALIZED VIEW daily_category_transactions AS
SELECT 
    t.user_id,
    DATE(t.date) AS transaction_date,
    c.id AS category_id,
    c.name AS category_name,
    c.type AS category_type,
    SUM(amount) AS total_amount
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
GROUP BY t.user_id, transaction_date, c.id, c.name, c.type;

-- ==============================
-- Monthly Category Transactions
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS monthly_category_transactions;
CREATE MATERIALIZED VIEW monthly_category_transactions AS
SELECT 
    t.user_id,
    DATE_TRUNC('month', t.date) AS transaction_month,
    c.id AS category_id,
    c.name AS category_name,
    c.type AS category_type,
    SUM(amount) AS total_amount
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
GROUP BY t.user_id, transaction_month, c.id, c.name, c.type;

-- ==============================
-- Yearly Category Transactions
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS yearly_category_transactions;
CREATE MATERIALIZED VIEW yearly_category_transactions AS
SELECT 
    t.user_id,
    DATE_TRUNC('year', t.date) AS transaction_year,
    c.id AS category_id,
    c.name AS category_name,
    c.type AS category_type,
    SUM(amount) AS total_amount
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
GROUP BY t.user_id, transaction_year, c.id, c.name, c.type;

-- ==============================
-- Cronjob to update views
-- ==============================
-- Update daily transactions every hour
SELECT cron.schedule('daily_transactions', '0 * * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY daily_transactions');

-- Update monthly transactions daily
SELECT cron.schedule('monthly_transactions', '0 0 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_transactions');

-- Update yearly transactions daily
SELECT cron.schedule('yearly_transactions', '0 0 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY yearly_transactions');

-- Update category transactions every hour;
SELECT cron.schedule('category_transactions', '0 * * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY category_transactions');

-- Update daily category transactions every hour
SELECT cron.schedule('daily_category_transactions', '0 * * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY daily_category_transactions');

-- Update monthly category transactions daily
SELECT cron.schedule('monthly_category_transactions', '0 0 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY monthly_category_transactions');

-- Update yearly category transactions daily
SELECT cron.schedule('yearly_category_transactions', '0 0 * * *', 'REFRESH MATERIALIZED VIEW CONCURRENTLY yearly_category_transactions');
