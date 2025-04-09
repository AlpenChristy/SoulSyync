
import bcrypt from 'bcrypt';
import { db } from './database';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';

async function resetAdminPassword() {
  const newPassword = 'password'; // Default password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  await db.update(users)
    .set({ 
      password: hashedPassword,
      updatedAt: new Date()
    })
    .where(eq(users.username, 'admin'));
    
  console.log('Admin password has been reset to:', newPassword);
}

resetAdminPassword().catch(console.error);
