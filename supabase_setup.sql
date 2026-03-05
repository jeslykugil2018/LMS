-- 1. Create Campuses Table
CREATE TABLE IF NOT EXISTS campuses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE, -- Added UNIQUE to prevent duplicates
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Students Table
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  district TEXT,
  age INTEGER,
  campus_id UUID REFERENCES campuses(id),
  total_payment NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Admins Table
CREATE TABLE IF NOT EXISTS admins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE, -- Added UNIQUE to prevent duplicate admin links
  email TEXT NOT NULL,
  role TEXT DEFAULT 'Campus Admin', -- 'Super Admin' or 'Campus Admin'
  campus_id UUID REFERENCES campuses(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Create Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id) NOT NULL,
  amount NUMERIC NOT NULL,
  method TEXT DEFAULT 'Cash',
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE campuses ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies for Students Table
DROP POLICY IF EXISTS "Super Admins have full access to students" ON students;
CREATE POLICY "Super Admins have full access to students" ON students
FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid() AND admins.role = 'Super Admin')
);

DROP POLICY IF EXISTS "Campus Admins can only access their campus students" ON students;
CREATE POLICY "Campus Admins can only access their campus students" ON students
FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid() AND admins.campus_id = students.campus_id AND admins.role = 'Campus Admin')
);

-- 7. RLS Policies for Admins Table (CRITICAL FOR LOGIN)
DROP POLICY IF EXISTS "Admins can view their own record" ON admins;
CREATE POLICY "Admins can view their own record" ON admins
FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Super Admins can view all admins" ON admins;
CREATE POLICY "Super Admins can view all admins" ON admins
FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid() AND admins.role = 'Super Admin')
);

-- 8. RLS Policies for Campuses Table
DROP POLICY IF EXISTS "Everyone can view campuses" ON campuses;
CREATE POLICY "Everyone can view campuses" ON campuses
FOR SELECT USING (true);

DROP POLICY IF EXISTS "Super Admins can manage campuses" ON campuses;
CREATE POLICY "Super Admins can manage campuses" ON campuses
FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid() AND admins.role = 'Super Admin')
);

-- 9. RLS Policies for Payments Table
DROP POLICY IF EXISTS "Super Admins have full access to payments" ON payments;
CREATE POLICY "Super Admins have full access to payments" ON payments
FOR ALL USING (
  EXISTS (SELECT 1 FROM admins WHERE admins.user_id = auth.uid() AND admins.role = 'Super Admin')
);

DROP POLICY IF EXISTS "Campus Admins can only access their campus payments" ON payments;
CREATE POLICY "Campus Admins can manage their campus payments" ON payments
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM admins 
    JOIN students ON students.campus_id = admins.campus_id
    WHERE admins.user_id = auth.uid() 
    AND admins.role = 'Campus Admin'
    AND payments.student_id = students.id
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM admins 
    JOIN students ON students.campus_id = admins.campus_id
    WHERE admins.user_id = auth.uid() 
    AND admins.role = 'Campus Admin'
    AND payments.student_id = students.id
  )
);

-- 10. INITIAL SETUP (RUN THESE IN ORDER)

-- A. Create first campuses
INSERT INTO campuses (name) VALUES ('Northex'), ('UpBold') ON CONFLICT DO NOTHING;

-- B. Create first Super Admin
-- Note: Run this after signing up via the app or confirming your UID below:
DELETE FROM admins WHERE user_id = '87f7fdc9-2ea9-430f-9146-aa781267452f';
INSERT INTO admins (user_id, email, role) 
VALUES ('87f7fdc9-2ea9-430f-9146-aa781267452f', 'clipzylk@gmail.com', 'Super Admin');

-- C. (Optional) Create Campus Admin
-- INSERT INTO admins (user_id, email, role, campus_id) 
-- VALUES ('CAMPUS_ADMIN_UID', 'campus@admin.com', 'Campus Admin', 'CAMPUS_UUID_HERE');
