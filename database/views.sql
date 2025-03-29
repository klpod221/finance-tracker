-- ==============================
-- Daily Transactions 
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS daily_transactions;
CREATE MATERIALIZED VIEW daily_transactions AS
SELECT
    user_id,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS balance,
    date_trunc('day', date) AS date
FROM transactions
GROUP BY user_id, date_trunc('day', date)
WITH DATA;

-- ==============================
-- Monthly Transactions
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS monthly_transactions;
CREATE MATERIALIZED VIEW monthly_transactions AS
SELECT
    user_id,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS balance,
    date_trunc('month', date) AS date
FROM transactions
GROUP BY user_id, date_trunc('month', date)
WITH DATA;

-- ==============================
-- Yearly Transactions
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS yearly_transactions;
CREATE MATERIALIZED VIEW yearly_transactions AS
SELECT
    user_id,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS balance,
    date_trunc('year', date) AS date
FROM transactions
GROUP BY user_id, date_trunc('year', date)
WITH DATA;

-- ==============================
-- Weekly Transactions
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS weekly_transactions;
CREATE MATERIALIZED VIEW weekly_transactions AS
SELECT
    user_id,
    SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS total_income,
    SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS total_expense,
    SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS balance,
    date_trunc('week', date) AS date
FROM transactions
GROUP BY user_id, date_trunc('week', date)
WITH DATA;

-- ==============================
-- Category-wise Expenses
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS category_expenses;
CREATE MATERIALIZED VIEW category_expenses AS
SELECT
    t.user_id,
    t.category_id,
    c.name AS category_name,
    SUM(t.amount) AS total_expense,
    date_trunc('month', t.date) AS month
FROM transactions t
JOIN categories c ON t.category_id = c.id
WHERE t.type = 'expense'
GROUP BY t.user_id, t.category_id, c.name, date_trunc('month', t.date)
WITH DATA;

-- ==============================
-- Savings Progress
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS savings_progress;
CREATE MATERIALIZED VIEW savings_progress AS
SELECT
    s.user_id,
    s.id AS savings_id,
    s.name,
    s.target_amount,
    s.current_amount,
    (s.current_amount / s.target_amount) * 100 AS progress_percentage,
    date_trunc('month', s.created_at) AS month
FROM savings s
WITH DATA;

-- ==============================
-- Cronjob to update views
-- ==============================
-- SELECT cron.unschedule('daily_transactions');
-- SELECT cron.unschedule('monthly_transactions');
-- SELECT cron.unschedule('yearly_transactions');
-- SELECT cron.unschedule('weekly_transactions');
-- SELECT cron.unschedule('category_expenses');
-- SELECT cron.unschedule('savings_progress');

SELECT cron.schedule('daily_transactions', '0 * * * *', 'REFRESH MATERIALIZED VIEW daily_transactions');
SELECT cron.schedule('monthly_transactions', '0 0 * * *', 'REFRESH MATERIALIZED VIEW monthly_transactions');
SELECT cron.schedule('yearly_transactions', '0 0 * * *', 'REFRESH MATERIALIZED VIEW yearly_transactions');
SELECT cron.schedule('weekly_transactions', '0 0 * * 0', 'REFRESH MATERIALIZED VIEW weekly_transactions');
SELECT cron.schedule('category_expenses', '0 0 * * *', 'REFRESH MATERIALIZED VIEW category_expenses');
SELECT cron.schedule('savings_progress', '0 0 * * *', 'REFRESH MATERIALIZED VIEW savings_progress');
