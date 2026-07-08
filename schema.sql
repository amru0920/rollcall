-- =====================================================
--  SISTEM ROLLCALL — IKM LUMUT  (Supabase schema)
--  Jalankan sekali dalam Supabase > SQL Editor
-- =====================================================

create table if not exists teachers (
  id uuid primary key default gen_random_uuid(),
  ic text unique not null,
  name text,
  class_name text,            -- kelas ketua ini (cth '1A')
  is_admin boolean default false,
  password_set boolean default false,
  created_at timestamptz default now()
);

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  nokp text unique not null,
  kelas text,                 -- cth '1A', '1B'
  created_at timestamptz default now()
);

-- Satu sesi rollcall per kelas per hari (subject sentiasa '')
create table if not exists attendance_sessions (
  id uuid primary key default gen_random_uuid(),
  class_name text not null,
  date date not null,
  subject text default '',
  recorded_by text,           -- ic ketua
  session_time text,          -- masa auto (HH:MM) semasa simpan
  created_at timestamptz default now(),   -- tarikh+masa auto simpan (server)
  unique(class_name, date, subject)
);

-- Hanya yang BUKAN hadir direkod. reason = 'Lewat' | 'Tidak Hadir'
create table if not exists absentees (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references attendance_sessions(id) on delete cascade,
  student_id uuid references students(id) on delete cascade,
  reason text,
  created_at timestamptz default now(),
  unique(session_id, student_id)
);

-- ---------- RLS ----------
alter table teachers            enable row level security;
alter table students            enable row level security;
alter table attendance_sessions enable row level security;
alter table absentees           enable row level security;

-- Pengguna yang dah log masuk (authenticated) boleh guna semua jadual.
-- Cipta/padam akaun ketua dibuat oleh Edge Function (service role, pintas RLS).
create policy "auth teachers"  on teachers            for all to authenticated using (true) with check (true);
create policy "auth students"  on students            for all to authenticated using (true) with check (true);
create policy "auth sessions"  on attendance_sessions for all to authenticated using (true) with check (true);
create policy "auth absentees" on absentees           for all to authenticated using (true) with check (true);

-- =====================================================
--  SELEPAS RUN INI, CIPTA ADMIN PERTAMA:
--  1) Authentication > Users > Add user:
--       email    = <ICanda>@kehadiran.local   (cth 900101071234@kehadiran.local)
--       password = 4 digit akhir IC
--       Auto Confirm User = ON
--  2) Ganti IC & nama di bawah, run:
--       insert into teachers (ic, name, is_admin)
--       values ('900101071234', 'Nama Pensyarah', true);
-- =====================================================
