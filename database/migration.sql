-- ==============================
-- User Profile
-- ==============================
DROP TABLE IF EXISTS users CASCADE;
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
DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    budget NUMERIC DEFAULT 0 CHECK (budget >= 0),
    period TEXT DEFAULT 'monthly' CHECK (period IN ('daily', 'weekly', 'monthly')),
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    color TEXT DEFAULT '#a0dc50',
    icon TEXT DEFAULT 'DollarCircleOutlined',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, name),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================
-- Financial Groups
-- ==============================
DROP TABLE IF EXISTS groups CASCADE;
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#a0dc50',
    icon TEXT DEFAULT 'DollarCircleOutlined',
    is_private BOOLEAN DEFAULT TRUE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- Group Members
-- ==============================
DROP TABLE IF EXISTS group_members CASCADE;
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    notification BOOLEAN DEFAULT TRUE,
    joined_at TIMESTAMP DEFAULT NOW(),
    join_status TEXT DEFAULT 'pending' CHECK (join_status IN ('pending', 'accepted')),
    UNIQUE (group_id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- ==============================
-- Savings and Investments
-- ==============================
DROP TABLE IF EXISTS savings CASCADE;
CREATE TABLE savings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
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
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE RESTRICT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (savings_id) REFERENCES savings(id) ON DELETE RESTRICT
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
-- API Management
-- ==============================
DROP TABLE IF EXISTS api_keys;
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    key TEXT NOT NULL UNIQUE,
    last_used TIMESTAMP,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, key),
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
