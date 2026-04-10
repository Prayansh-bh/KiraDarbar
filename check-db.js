const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function check() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log("Checking latest payments...");
  const { data: payments, error } = await supabase
    .from('payments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error) console.error("Error fetching payments:", error);
  else console.log("Recent Payments:", JSON.stringify(payments, null, 2));

  console.log("\nChecking latest users...");
  const { data: users, error2 } = await supabase
    .from('users')
    .select('id, email, plan')
    .order('created_at', { ascending: false })
    .limit(5);

  if (error2) console.error("Error fetching users:", error2);
  else console.log("Recent Users:", JSON.stringify(users, null, 2));
}

check();
