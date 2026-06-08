const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:Db3vhi%2FdnD%2F_swr@db.fepxgtherpcvxklqnaib.supabase.co:5432/postgres',
});

async function runMigration() {
  try {
    await client.connect();
    await client.query("DELETE FROM cases;");
    console.log("Todos los casos eliminados. Base de datos reseteada para E2E.");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await client.end();
  }
}

runMigration();
