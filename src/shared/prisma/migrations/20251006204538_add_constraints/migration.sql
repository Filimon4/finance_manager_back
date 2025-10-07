-- This is an empty migration.
ALTER TABLE operations
ADD CONSTRAINT check_account_category_null_logic CHECK (
    (to_cash_account_id IS NULL AND category_id IS NOT NULL) OR 
    (to_cash_account_id IS NOT NULL AND category_id IS NULL) OR 
    (to_cash_account_id IS NULL AND category_id IS NULL)
);

ALTER TABLE operations
ADD CONSTRAINT check_transfer_type_constraint CHECK (
    to_cash_account_id IS NULL OR type = 'TRANSFER'
);