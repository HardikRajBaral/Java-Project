-- Insert default admin user
-- Password: admin123 (hashed with BCrypt)
INSERT INTO users (id, email, username, password, role, created_at, updated_at) 
VALUES (
    gen_random_uuid(),
    'admin@auction.com', 
    'admin', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    'ADMIN',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Insert default customer user
-- Password: customer123 (hashed with BCrypt)
INSERT INTO users (id, email, username, password, role, created_at, updated_at) 
VALUES (
    gen_random_uuid(),
    'customer@auction.com', 
    'customer', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    'CUSTOMER',
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;