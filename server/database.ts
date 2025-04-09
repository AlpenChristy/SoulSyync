import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { users, services, appointments, blogPosts, horoscopes, subscribers, testimonials } from '../shared/schema';
import * as bcrypt from 'bcrypt';
import dotenv from "dotenv";
dotenv.config();


const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client);

// Initialize the database with tables and sample data
export async function initializeDatabase() {
  console.log('🔄 Initializing database...');
  console.log(connectionString);
  
  try {
    // Check if users table already has data
    const existingUsers = await db.select().from(users).limit(1);
    
    if (existingUsers.length === 0) {
      console.log('💽 Seeding database with initial data...');
      
      // Create admin user
      const hashedPassword = await bcrypt.hash('password', 10);
      const adminUser = await db.insert(users).values({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@SoulSyync.com',
        fullName: 'Admin User',
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      }).returning();
      
      // Create services
      const servicesData = [
        {
          name: "Spiritual Counseling",
          description: "One-on-one sessions to explore your spiritual path, overcome obstacles, and find inner peace.",
          price: 8000, // $80.00
          duration: 60, // 60 minutes
          imageUrl: "https://images.pexels.com/photos/6541343/pexels-photo-6541343.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Chakra Balancing",
          description: "Realign your energy centers to promote physical, emotional, and spiritual well-being.",
          price: 9500, // $95.00
          duration: 75, // 75 minutes
          imageUrl: "https://images.pexels.com/photos/8964774/pexels-photo-8964774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Aura Cleansing",
          description: "Clear negative energies and strengthen your energetic field for protection and vitality.",
          price: 8500, // $85.00
          duration: 60, // 60 minutes
          imageUrl: "https://images.pexels.com/photos/3047319/pexels-photo-3047319.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Past Life Regression",
          description: "Journey into your past lives to gain insights into your current challenges and soul's purpose.",
          price: 12000, // $120.00
          duration: 90, // 90 minutes
          imageUrl: "https://images.pexels.com/photos/935830/pexels-photo-935830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: "Tarot Reading",
          description: "Gain spiritual guidance and clarity on life questions through the symbolic language of tarot.",
          price: 7500, // $75.00
          duration: 45, // 45 minutes
          imageUrl: "https://images.pexels.com/photos/6633336/pexels-photo-6633336.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await db.insert(services).values(servicesData);
      
      // Create some blog posts
      const blogPostsData = [
        {
          title: "5 Morning Meditation Practices to Start Your Day",
          content: `<p>Starting your day with meditation can set a positive tone for the hours ahead. Here are five practices to try:</p>
                   <h3>1. Mindful Breathing</h3>
                   <p>Begin with five minutes of focused breathing. Sit comfortably, close your eyes, and bring all your attention to the sensation of your breath entering and leaving your body.</p>
                   <h3>2. Gratitude Meditation</h3>
                   <p>Spend a few minutes reflecting on things you're grateful for. This practice shifts your focus to life's positives and can improve your overall outlook.</p>
                   <h3>3. Body Scan</h3>
                   <p>Moving your awareness slowly from your feet to your head, notice any sensations without judgment. This practice grounds you in the present and connects you with your physical self.</p>
                   <h3>4. Intention Setting</h3>
                   <p>Take time to set a positive intention for your day. This isn't about tasks, but about how you want to be — patient, compassionate, focused, etc.</p>
                   <h3>5. Loving-Kindness Meditation</h3>
                   <p>Send thoughts of love and well-being to yourself, loved ones, and gradually to all beings. This practice opens your heart and fosters connection.</p>
                   <p>Even just 10 minutes of morning meditation can transform your day. The key is consistency, not duration. Start small and make it a daily habit.</p>`,
          authorId: 1,
          category: "Meditation",
          imageUrl: "https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          featured: true,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          title: "The Beginner's Guide to Crystal Healing: Properties & Uses",
          content: `<p>Crystal healing is an ancient practice that uses the natural energetic properties of crystals to promote wellness. Here's what you need to know to get started:</p>
                   <h3>Understanding Crystal Energy</h3>
                   <p>Crystals have unique energy frequencies that can interact with our own energy field. When used intentionally, they can help balance and align our energy centers.</p>
                   <h3>Essential Crystals for Beginners</h3>
                   <ul>
                     <li><strong>Clear Quartz</strong>: Known as the "master healer," it amplifies energy and thought, and is believed to aid concentration and memory.</li>
                     <li><strong>Amethyst</strong>: Promotes calm and balance, helpful for reducing stress and anxiety.</li>
                     <li><strong>Rose Quartz</strong>: The stone of unconditional love, it helps open the heart chakra and heal emotional wounds.</li>
                     <li><strong>Black Tourmaline</strong>: A powerful grounding stone that provides protection against negative energies.</li>
                     <li><strong>Citrine</strong>: Associated with abundance and manifestation, it brings positive energy and clarity.</li>
                   </ul>
                   <h3>How to Use Crystals</h3>
                   <p>There are many ways to incorporate crystals into your spiritual practice:</p>
                   <ul>
                     <li>Meditation: Hold or place crystals on specific chakras while meditating.</li>
                     <li>Wearing: Jewelry allows the crystal to stay in your energy field throughout the day.</li>
                     <li>Home placement: Strategic positioning can create harmonious energy in your living spaces.</li>
                     <li>Crystal grids: Arranging multiple crystals in geometric patterns can amplify their properties.</li>
                   </ul>
                   <h3>Caring for Your Crystals</h3>
                   <p>Cleanse your crystals regularly to remove accumulated energies. Methods include moonlight exposure, smudging with sage, or placing them in salt.</p>
                   <p>Remember, crystal healing works best as a complement to other wellness practices, not as a replacement for professional healthcare.</p>`,
          authorId: 1,
          category: "Crystal Healing",
          imageUrl: "https://images.pexels.com/photos/3059750/pexels-photo-3059750.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          featured: false,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await db.insert(blogPosts).values(blogPostsData);
      
      console.log('✅ Database seeded successfully');
    } else {
      console.log('✅ Database already contains data, skipping seed');
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
}