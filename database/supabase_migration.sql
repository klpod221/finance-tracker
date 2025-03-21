-- ==============================
-- 1. Hồ sơ người dùng
-- ==============================
DROP TABLE IF EXISTS user_profile;
CREATE TABLE user_profile (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    currency TEXT DEFAULT 'VND',
    timezone TEXT DEFAULT 'UTC',
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- 2. Danh mục chi tiêu
-- ==============================
DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT CHECK (type IN ('income', 'expense')) NOT NULL,
    color TEXT DEFAULT '#000000',
    icon TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- 3. Nhóm tài chính
-- ==============================
DROP TABLE IF EXISTS groups;
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    balance NUMERIC DEFAULT 0 CHECK (balance >= 0),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- 4. Thành viên nhóm
-- ==============================
DROP TABLE IF EXISTS group_members;
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT CHECK (role IN ('admin', 'member')) NOT NULL,
    joined_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (group_id, user_id)
);

-- ==============================
-- 5. Giao dịch
-- ==============================
DROP TABLE IF EXISTS transactions;
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    group_id UUID REFERENCES groups(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    note TEXT,
    date TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- 6. Giới hạn chi tiêu
-- ==============================
DROP TABLE IF EXISTS limits;
CREATE TABLE limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    period TEXT CHECK (period IN ('daily', 'weekly', 'monthly')) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- 7. Tiết kiệm và đầu tư
-- ==============================
CREATE TABLE savings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    color TEXT DEFAULT '#000000',
    icon TEXT,
    target_amount NUMERIC NOT NULL CHECK (target_amount > 0),
    current_amount NUMERIC DEFAULT 0 CHECK (current_amount >= 0),
    created_at TIMESTAMP DEFAULT NOW()
);

-- ==============================
-- 8. Thông báo
-- ==============================
DROP TABLE IF EXISTS notifications;
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);
