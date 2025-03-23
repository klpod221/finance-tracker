-- ==============================
-- Hồ sơ người dùng
-- ==============================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    avatar TEXT,
    currency TEXT DEFAULT 'VND',
    timezone TEXT DEFAULT 'Etc/UTC',
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE 
);

-- ==============================
-- Danh mục chi tiêu
-- ==============================
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    color TEXT DEFAULT '#000000',
    icon TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, name),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================
-- Nhóm tài chính
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
-- Thành viên nhóm
-- ==============================
DROP TABLE IF EXISTS group_members;
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL,
    user_id UUID NOT NULL,
    role TEXT NOT NULL,
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (group_id, user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- ==============================
-- Giới hạn chi tiêu
-- ==============================
DROP TABLE IF EXISTS limits;
CREATE TABLE limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    category_id UUID NOT NULL,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    period TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, category_id, period),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- ==============================
-- Tiết kiệm và đầu tư
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
-- Giao dịch
-- ==============================
DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    group_id UUID,
    category_id UUID,
    savings_id UUID,
    amount NUMERIC NOT NULL,
    note TEXT,
    date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (savings_id) REFERENCES savings(id) ON DELETE SET NULL
);

-- ==============================
-- Thông báo
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
