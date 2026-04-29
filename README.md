# AIUB NOTES

React Native + Expo app for AIUB CSE students to find course notes, solutions, and study materials. It includes student flows, an admin dashboard, Supabase Auth, Database, Storage, RLS policies, and a generator that reads `../courselist.txt`.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Generate course data from the workspace course list:

```bash
npm run generate:courses
```

3. Create `.env` from `.env.example` and add your Supabase URL plus publishable/anon key.

4. In Supabase SQL Editor, run:

```sql
-- aiub-notes/supabase/schema.sql
-- aiub-notes/supabase/seed_courses.sql
```

5. In Supabase Auth > Email Templates > Confirm signup, include `{{ .Token }}` in the email body so students can enter the OTP in the app. The app uses password signup plus `verifyOtp({ type: "signup" })`.

6. Start the app:

```bash
npm start
```

## Admin Bootstrap

After an admin user signs up with an AIUB student email, for example `23-51455-1@student.aiub.edu`, and verifies OTP, run the bootstrap SQL at the bottom of `supabase/schema.sql` with that user's UUID.

## Storage Layout

- `materials/approved/{COURSE_CODE}/...` is readable by authenticated students.
- `materials/submissions/{USER_ID}/...` is readable by the submitting student and admins.
- Approved student submissions are copied to the approved folder by the admin workflow.

## Supabase Docs Checked

This project follows current Supabase guidance for Expo React Native session persistence, email OTP verification, private Storage signed URLs, and RLS/storage policies.
