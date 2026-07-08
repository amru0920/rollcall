# Sistem Rollcall — IKM Lumut (panduan pasang)

Berdasarkan sistem kehadiran SMK Batu Maung, diubah untuk rollcall:
**buang subjek/latihan/disiplin**, tambah status **Lewat**, masa & tarikh **auto** semasa simpan.

## Struktur peranan
- **Ketua Kelas** → login `index.html`, rekod kehadiran kelas sendiri.
- **Pensyarah (Admin)** → login `admin.html`, urus ketua + pelajar + Laporan & Analisis.
- Login guna **No. KP**. Kata laluan awal = **4 digit akhir No. KP**.

## Langkah pasang (sekali sahaja)

### 1. Database
Supabase > **SQL Editor** > tampal `schema.sql` > **Run**.

### 2. Cipta admin pertama
- **Authentication > Users > Add user**
  - email: `<ICanda>@kehadiran.local` (cth `900101071234@kehadiran.local`)
  - password: 4 digit akhir IC
  - **Auto Confirm User: ON**
- **SQL Editor**, run (ganti IC & nama):
  ```sql
  insert into teachers (ic, name, is_admin)
  values ('900101071234', 'Nama Pensyarah', true);
  ```

### 3. Edge Function (cipta akaun ketua)
Supabase > **Edge Functions** > **Create function** > nama `admin-teachers` >
tampal isi `supabase/functions/admin-teachers/index.ts` > **Deploy**.
> Pada tetapan function, **Verify JWT = OFF** (kita sahkan admin sendiri di dalam kod).
> Tak perlu set secret — `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
> smemang wujud automatik dalam Edge runtime.

### 4. Deploy laman
Upload semua fail (kecuali folder `supabase/`) ke **Cloudflare Pages**
(drag folder atau connect repo). Fail `config.js` & `admin-config.js` sudah ada kredential kau.

## Guna harian
1. **Admin** (`admin.html`) → tab **Ketua Kelas** → *Tambah + Cipta Akaun* (atau Import CSV).
   Setiap ketua set **Kelas** dia (cth `1A`).
2. Tab **Pelajar** → *Import CSV* (templat: `Nama,NoKP,Kelas` — lihat `templat_pelajar.csv`).
3. **Ketua** (`index.html`) → login No. KP → pilih tarikh → tekan pelajar yang **Lewat**/**Tidak Hadir** → **Simpan** (masa auto).
4. **Admin > Laporan & Analisis** → carta + kekerapan tidak hadir.

## Nota
- Peratus kehadiran sekarang kira **Lewat & Tidak Hadir** dua-dua turunkan kadar.
  Kalau nak **Lewat dikira hadir**, bagitahu — tukar 1 baris.
- Susunan ikut semester: guna nama kelas (cth `1A`, `1B`). Field `kelas` = pengenal kelas.
