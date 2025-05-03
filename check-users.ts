
import { db } from './db/index';
async function checkUsers() {
  const allUsers = await db.query.users.findMany();
  console.log('All users:');
  console.log(JSON.stringify(allUsers, null, 2));
}
checkUsers();
