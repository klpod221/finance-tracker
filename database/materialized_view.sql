-- ==============================
-- 1. Hiển thị số dư của từng user
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS user_balance;
CREATE MATERIALIZED VIEW user_balance AS
SELECT 
    u.id,
    COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END), 0) AS total_income,
    COALESCE(SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END), 0) AS total_expense,
    COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE -t.amount END), 0) AS balance
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
LEFT JOIN categories c ON t.category_id = c.id
GROUP BY u.id;

-- ==============================
-- 2. Hiển thị số dư của từng nhóm
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS group_balance;
CREATE MATERIALIZED VIEW group_balance AS
SELECT 
    g.id AS group_id,
    g.name,
    COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END), 0) AS total_income,
    COALESCE(SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END), 0) AS total_expense,
    COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE -t.amount END), 0) AS balance
FROM groups g
LEFT JOIN transactions t ON g.id = t.group_id
LEFT JOIN categories c ON t.category_id = c.id
GROUP BY g.id;

-- ==============================
-- 3. Giới hạn chi tiêu theo danh mục
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS spending_limits;
CREATE MATERIALIZED VIEW spending_limits AS
SELECT 
    l.user_id,
    l.category_id,
    l.amount AS limit_amount,
    l.period,
    COALESCE(SUM(t.amount), 0) AS spent_amount,
    (l.amount - COALESCE(SUM(t.amount), 0)) AS remaining
FROM limits l
LEFT JOIN transactions t 
    ON l.user_id = t.user_id 
    AND l.category_id = t.category_id
    AND (
        (l.period = 'daily' AND t.date >= NOW() - INTERVAL '1 day') OR
        (l.period = 'weekly' AND t.date >= NOW() - INTERVAL '1 week') OR
        (l.period = 'monthly' AND t.date >= NOW() - INTERVAL '1 month')
    )
GROUP BY l.user_id, l.category_id, l.amount, l.period;

-- ==============================
-- 4. Tổng thu nhập và chi tiêu theo tháng
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS monthly_transactions;
CREATE MATERIALIZED VIEW monthly_transactions AS
SELECT 
    t.user_id,
    DATE_TRUNC('month', t.date) AS month,
    COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE 0 END), 0) AS total_income,
    COALESCE(SUM(CASE WHEN c.type = 'expense' THEN t.amount ELSE 0 END), 0) AS total_expense,
    COALESCE(SUM(CASE WHEN c.type = 'income' THEN t.amount ELSE -t.amount END), 0) AS balance
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
GROUP BY t.user_id, DATE_TRUNC('month', t.date);

-- ==============================
-- 5. Tổng chi tiêu theo danh mục
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS category_spending;
CREATE MATERIALIZED VIEW category_spending AS
SELECT 
    t.user_id,
    t.category_id,
    c.name AS category_name,
    c.color AS category_color,
    SUM(t.amount) AS total_spent
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
WHERE c.type = 'expense'
GROUP BY t.user_id, t.category_id, c.name, c.color;

-- ==============================
-- 6. Giao dịch gần đây của nhóm
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS recent_group_transactions;
CREATE MATERIALIZED VIEW recent_group_transactions AS
SELECT 
    t.group_id,
    t.id AS transaction_id,
    t.user_id,
    u.name AS user_name,
    t.amount,
    t.note,
    t.date,
    c.name AS category_name,
    c.color AS category_color
FROM transactions t
LEFT JOIN users u ON t.user_id = u.id
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.group_id IS NOT NULL
ORDER BY t.date DESC
LIMIT 50;

-- ==============================
-- 7. Giao dịch gần đây của cá nhân
-- ==============================
DROP MATERIALIZED VIEW IF EXISTS recent_user_transactions;
CREATE MATERIALIZED VIEW recent_user_transactions AS
SELECT 
    t.user_id,
    t.id AS transaction_id,
    t.amount,
    t.note,
    t.date,
    c.name AS category_name,
    c.color AS category_color
FROM transactions t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.group_id IS NULL
ORDER BY t.date DESC
LIMIT 20;

-- Tạo cronjob
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Remove all existing cron jobs
-- check cron jobs exists
-- SELECT cron.unschedule('user_balance') IF EXISTS;
-- SELECT cron.unschedule('group_balance');
-- SELECT cron.unschedule('recent_group_transactions');
-- SELECT cron.unschedule('recent_user_transactions');
-- SELECT cron.unschedule('category_spending');
-- SELECT cron.unschedule('monthly_transactions');
-- SELECT cron.unschedule('spending_limits');

-- Làm mới mỗi giờ
SELECT cron.schedule('user_balance','0 * * * *', 'REFRESH MATERIALIZED VIEW user_balance');
SELECT cron.schedule('group_balance', '0 * * * *', 'REFRESH MATERIALIZED VIEW group_balance');
SELECT cron.schedule('recent_group_transactions','0 * * * *', 'REFRESH MATERIALIZED VIEW recent_group_transactions');
SELECT cron.schedule('recent_user_transactions','0 * * * *', 'REFRESH MATERIALIZED VIEW recent_user_transactions');

-- Làm mới mỗi 6h
SELECT cron.schedule('category_spending', '0 */6 * * *', 'REFRESH MATERIALIZED VIEW category_spending');

-- Làm mới mỗi ngày
SELECT cron.schedule('monthly_transactions', '0 0 * * *', 'REFRESH MATERIALIZED VIEW monthly_transactions');
SELECT cron.schedule('spending_limits', '0 0 * * *', 'REFRESH MATERIALIZED VIEW spending_limits');
