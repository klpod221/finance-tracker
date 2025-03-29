-- ==============================
-- Indexes for Users Table
-- ==============================
CREATE INDEX idx_users_created_at ON users (created_at);

-- ==============================
-- Indexes for Categories Table
-- ==============================
CREATE INDEX idx_categories_user_id ON categories (user_id);

CREATE INDEX idx_categories_name ON categories (name);

-- ==============================
-- Indexes for Groups Table
-- ==============================
CREATE INDEX idx_groups_created_at ON groups (created_at);

-- ==============================
-- Indexes for Group Members Table
-- ==============================
CREATE INDEX idx_group_members_user_id ON group_members (user_id);

CREATE INDEX idx_group_members_group_id ON group_members (group_id);

-- ==============================
-- Indexes for Savings Table
-- ==============================
CREATE INDEX idx_savings_user_id ON savings (user_id);

CREATE INDEX idx_savings_created_at ON savings (created_at);

-- ==============================
-- Indexes for Transactions Table
-- ==============================
CREATE INDEX idx_transactions_user_id ON transactions (user_id);

CREATE INDEX idx_transactions_group_id ON transactions (group_id);

CREATE INDEX idx_transactions_category_id ON transactions (category_id);

CREATE INDEX idx_transactions_savings_id ON transactions (savings_id);

CREATE INDEX idx_transactions_date ON transactions (date);

CREATE INDEX idx_transactions_created_at ON transactions (created_at);

-- ==============================
-- Indexes for Notifications Table
-- ==============================
CREATE INDEX idx_notifications_user_id ON notifications (user_id);

CREATE INDEX idx_notifications_created_at ON notifications (created_at);

-- ==============================
-- Indexes for User Balances Table
-- ==============================
CREATE INDEX idx_user_balances_user_id ON user_balances (user_id);

-- ==============================
-- Indexes for API Keys Table
-- ==============================
CREATE INDEX idx_api_keys_user_id ON api_keys (user_id);

CREATE INDEX idx_api_keys_status ON api_keys (status);

-- ==============================
-- Indexes for Group Balances Table
-- ==============================
CREATE INDEX idx_group_balances_group_id ON group_balances (group_id);