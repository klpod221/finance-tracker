-- ==============================
-- Create function for new transaction
-- ==============================
CREATE OR REPLACE FUNCTION new_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- check if user balance exists
    IF NOT EXISTS (SELECT 1 FROM user_balances WHERE user_id = NEW.user_id) THEN
        INSERT INTO user_balances (user_id, total_income, total_expense, balance)
        VALUES (NEW.user_id, 0, 0, 0);
    END IF;

    -- Check user balance if expense is greater than balance
    IF NEW.type = 'expense' THEN
        IF (SELECT balance FROM user_balances WHERE user_id = NEW.user_id) < NEW.amount THEN
            RAISE EXCEPTION 'Insufficient balance';
        END IF;
    END IF;

    -- Update user balance
    UPDATE user_balances
    SET total_income = total_income + CASE WHEN NEW.type = 'income' THEN NEW.amount ELSE 0 END,
        total_expense = total_expense + CASE WHEN NEW.type = 'expense' THEN NEW.amount ELSE 0 END,
        balance = total_income - total_expense
    WHERE user_id = NEW.user_id;

    BEGIN
        IF NEW.savings_id IS NOT NULL THEN
            -- check if savings balance exists
            IF NOT EXISTS (SELECT 1 FROM savings WHERE id = NEW.savings_id) THEN
                RAISE EXCEPTION 'Savings not found';
            END IF;
            -- Update savings balance
            UPDATE savings
            SET current_amount = current_amount + CASE WHEN NEW.type = 'income' THEN -NEW.amount ELSE +NEW.amount END
            WHERE id = NEW.savings_id;
        ELSIF NEW.group_id IS NOT NULL THEN
            -- check if group balance exists
            IF NOT EXISTS (SELECT 1 FROM group_balances WHERE group_id = NEW.group_id) THEN
                INSERT INTO group_balances (group_id, total_income, total_expense, balance)
                VALUES (NEW.group_id, 0, 0, 0);
            END IF;

            -- Check group balance if expense is greater than balance
            IF NEW.type = 'expense' THEN
                IF (SELECT balance FROM group_balances WHERE group_id = NEW.group_id) < NEW.amount THEN
                    RAISE EXCEPTION 'Insufficient group balance';
                END IF;
            END IF;

            -- Update group balance
            UPDATE group_balances
            SET total_income = total_income + CASE WHEN NEW.type = 'income' THEN NEW.amount ELSE 0 END,
                total_expense = total_expense + CASE WHEN NEW.type = 'expense' THEN NEW.amount ELSE 0 END,
                balance = total_income - total_expense
            WHERE group_id = NEW.group_id;
        ELSEIF NEW.category_id IS NOT NULL THEN
        ELSE
            RAISE EXCEPTION 'Transaction must have a target';
        END IF;
    END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================
-- Create function for update transaction
-- ==============================
CREATE OR REPLACE FUNCTION update_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- check if user balance exists
    IF NOT EXISTS (SELECT 1 FROM user_balances WHERE user_id = OLD.user_id) THEN
        INSERT INTO user_balances (user_id, total_income, total_expense, balance)
        VALUES (OLD.user_id, 0, 0, 0);
    END IF;

    -- Check user balance if expense is greater than balance
    IF NEW.type = 'expense' THEN
        IF (SELECT balance FROM user_balances WHERE user_id = OLD.user_id) < NEW.amount THEN
            RAISE EXCEPTION 'Insufficient balance';
        END IF;
    END IF;

    -- Update user balance
    UPDATE user_balances
    SET total_income = total_income - CASE WHEN OLD.type = 'income' THEN OLD.amount ELSE 0 END + CASE WHEN NEW.type = 'income' THEN NEW.amount ELSE 0 END,
        total_expense = total_expense - CASE WHEN OLD.type = 'expense' THEN OLD.amount ELSE 0 END + CASE WHEN NEW.type = 'expense' THEN NEW.amount ELSE 0 END,
        balance = total_income - total_expense
    WHERE user_id = OLD.user_id;

    BEGIN
        IF NEW.savings_id IS NOT NULL THEN
            -- check if savings balance exists
            IF NOT EXISTS (SELECT 1 FROM savings WHERE id = NEW.savings_id) THEN
                RAISE EXCEPTION 'Savings not found';
            END IF;
            -- Update savings balance
            UPDATE savings
            SET current_amount = current_amount - CASE WHEN OLD.type = 'income' THEN -OLD.amount ELSE +OLD.amount END + CASE WHEN NEW.type = 'income' THEN -NEW.amount ELSE +NEW.amount END
            WHERE id = NEW.savings_id;
        ELSIF NEW.group_id IS NOT NULL THEN
            -- check if group balance exists
            IF NOT EXISTS (SELECT 1 FROM group_balances WHERE group_id = NEW.group_id) THEN
                INSERT INTO group_balances (group_id, total_income, total_expense, balance)
                VALUES (NEW.group_id, 0, 0, 0);
            END IF;

            -- Check group balance if expense is greater than balance
            IF NEW.type = 'expense' THEN
                IF (SELECT balance FROM group_balances WHERE group_id = NEW.group_id) < NEW.amount THEN
                    RAISE EXCEPTION 'Insufficient group balance';
                END IF;
            END IF;

            -- Update group balance
            UPDATE group_balances
            SET total_income = total_income - CASE WHEN OLD.type = 'income' THEN OLD.amount ELSE 0 END + CASE WHEN NEW.type = 'income' THEN NEW.amount ELSE 0 END,
                total_expense = total_expense - CASE WHEN OLD.type = 'expense' THEN OLD.amount ELSE 0 END + CASE WHEN NEW.type = 'expense' THEN NEW.amount ELSE 0 END,
                balance = total_income - total_expense
            WHERE group_id = NEW.group_id;
        ELSEIF NEW.category_id IS NOT NULL THEN
        ELSE
            RAISE EXCEPTION 'Transaction must have a target';
        END IF;
    END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==============================
-- Create function for delete transaction
-- ==============================
CREATE OR REPLACE FUNCTION delete_transaction()
RETURNS TRIGGER AS $$
BEGIN
    -- Start update user balance
    -- check if user balance exists
    IF NOT EXISTS (SELECT 1 FROM user_balances WHERE user_id = OLD.user_id) THEN
        INSERT INTO user_balances (user_id, total_income, total_expense, balance)
        VALUES (OLD.user_id, 0, 0, 0);
    END IF;

    -- Check user balance if delete income that make balance negative
    IF OLD.type = 'income' THEN
        IF (SELECT balance FROM user_balances WHERE user_id = OLD.user_id) < OLD.amount THEN
            RAISE EXCEPTION 'Insufficient balance';
        END IF;
    END IF;

    -- Update user balance
    UPDATE user_balances
    SET total_income = total_income - CASE WHEN OLD.type = 'income' THEN OLD.amount ELSE 0 END,
        total_expense = total_expense - CASE WHEN OLD.type = 'expense' THEN OLD.amount ELSE 0 END,
        balance = total_income - total_expense
    WHERE user_id = OLD.user_id;

    BEGIN
        IF OLD.savings_id IS NOT NULL THEN
            -- check if savings balance exists
            IF NOT EXISTS (SELECT 1 FROM savings WHERE id = OLD.savings_id) THEN
                RAISE EXCEPTION 'Savings not found';
            END IF;
            -- Update savings balance
            UPDATE savings
            SET current_amount = current_amount + CASE WHEN OLD.type = 'income' THEN -OLD.amount ELSE +OLD.amount END
            WHERE id = OLD.savings_id;
        ELSIF OLD.group_id IS NOT NULL THEN
            -- check if group balance exists
            IF NOT EXISTS (SELECT 1 FROM group_balances WHERE group_id = OLD.group_id) THEN
                INSERT INTO group_balances (group_id, total_income, total_expense, balance)
                VALUES (OLD.group_id, 0, 0, 0);
            END IF;

            -- Check group balance if delete income that make balance negative
            IF OLD.type = 'income' THEN
                IF (SELECT balance FROM group_balances WHERE group_id = OLD.group_id) < OLD.amount THEN
                    RAISE EXCEPTION 'Insufficient group balance';
                END IF;
            END IF;

            -- Update group balance
            UPDATE group_balances
            SET total_income = total_income - CASE WHEN OLD.type = 'income' THEN OLD.amount ELSE 0 END,
                total_expense = total_expense - CASE WHEN OLD.type = 'expense' THEN OLD.amount ELSE 0 END,
                balance = balance - CASE WHEN OLD.type = 'income' THEN OLD.amount ELSE -OLD.amount END
            WHERE group_id = OLD.group_id;
        ELSEIF OLD.category_id IS NOT NULL THEN
        ELSE
            RAISE EXCEPTION 'Transaction must have a target';
        END IF;
    END;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- ==============================
-- Create trigger
-- ==============================
CREATE TRIGGER new_transaction_trigger
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION new_transaction();

CREATE TRIGGER update_transaction_trigger
BEFORE UPDATE ON transactions
FOR EACH ROW
WHEN (OLD.amount IS DISTINCT FROM NEW.amount OR OLD.type IS DISTINCT FROM NEW.type)
EXECUTE FUNCTION update_transaction();

CREATE TRIGGER delete_transaction_trigger
AFTER DELETE ON transactions
FOR EACH ROW
EXECUTE FUNCTION delete_transaction();