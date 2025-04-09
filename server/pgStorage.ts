import { and, eq, desc, asc, like } from 'drizzle-orm';
import { IStorage } from './storage';
import {
  User, InsertUser,
  Service, InsertService,
  Appointment, InsertAppointment,
  BlogPost, InsertBlogPost,
  Horoscope, InsertHoroscope,
  Subscriber, InsertSubscriber,
  Testimonial, InsertTestimonial,
  Event, InsertEvent
} from '@shared/schema';
import {
  users, services, appointments, blogPosts, horoscopes, subscribers, testimonials, events
} from '../shared/schema';
import { db } from './database';

export class PgStorage implements IStorage {
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return result[0];
  }

  async updateUser(id: number, user: Partial<User>): Promise<User | undefined> {
    const result = await db.update(users)
      .set({
        ...user,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async getUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(asc(users.username));
  }

  // Services
  async getService(id: number): Promise<Service | undefined> {
    const result = await db.select().from(services).where(eq(services.id, id)).limit(1);
    return result[0];
  }

  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(asc(services.name));
  }

  async createService(service: InsertService): Promise<Service> {
    const result = await db.insert(services).values({
      ...service,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return result[0];
  }

  async updateService(id: number, service: Partial<Service>): Promise<Service | undefined> {
    const result = await db.update(services)
      .set({
        ...service,
        updatedAt: new Date()
      })
      .where(eq(services.id, id))
      .returning();
    return result[0];
  }

  async deleteService(id: number): Promise<boolean> {
    const result = await db.delete(services).where(eq(services.id, id)).returning();
    return result.length > 0;
  }

  // Appointments
  async getAppointment(id: number): Promise<Appointment | undefined> {
    const result = await db.select().from(appointments).where(eq(appointments.id, id)).limit(1);
    return result[0];
  }

  async getAppointmentsByUser(userId: number): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.date), asc(appointments.time));
  }

  async getAppointmentsByService(serviceId: number): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.serviceId, serviceId))
      .orderBy(desc(appointments.date), asc(appointments.time));
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.date, date))
      .orderBy(asc(appointments.time));
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return await db.select().from(appointments)
      .orderBy(desc(appointments.date), asc(appointments.time));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const result = await db.insert(appointments).values({
      ...appointment,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return result[0];
  }

  async updateAppointment(id: number, appointment: Partial<Appointment>): Promise<Appointment | undefined> {
    const result = await db.update(appointments)
      .set({
        ...appointment,
        updatedAt: new Date()
      })
      .where(eq(appointments.id, id))
      .returning();
    return result[0];
  }

  async deleteAppointment(id: number): Promise<boolean> {
    const result = await db.delete(appointments).where(eq(appointments.id, id)).returning();
    return result.length > 0;
  }

  // Blog Posts
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const result = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    return result[0];
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return await db.select().from(blogPosts)
      .where(eq(blogPosts.category, category))
      .orderBy(desc(blogPosts.publishedAt));
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    console.log("Getting featured blog posts");
    
    // First get all blog posts for debugging
    const allPosts = await db.select().from(blogPosts);
    console.log("All blog posts:", allPosts);
    console.log("Featured values:", allPosts.map(post => post.featured));
    
    // PostgreSQL can represent boolean values in different ways
    // Get all posts and filter in JavaScript for safer handling
    const posts = await db.select().from(blogPosts);
    
    const featuredPosts = posts.filter(post => {
      // Handle different representations of boolean true
      if (post.featured === null) return false;
      if (typeof post.featured === 'boolean') return post.featured;
      // Handle string or other types
      const featuredStr = String(post.featured).toLowerCase();
      return featuredStr === 'true' || featuredStr === 't' || featuredStr === '1';
    }).sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    
    console.log("Featured posts:", featuredPosts);
    return featuredPosts;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const result = await db.insert(blogPosts).values({
      ...post,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return result[0];
  }

  async updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const result = await db.update(blogPosts)
      .set({
        ...post,
        updatedAt: new Date()
      })
      .where(eq(blogPosts.id, id))
      .returning();
    return result[0];
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.id, id)).returning();
    return result.length > 0;
  }

  // Horoscopes
  async getHoroscope(id: number): Promise<Horoscope | undefined> {
    const result = await db.select().from(horoscopes).where(eq(horoscopes.id, id)).limit(1);
    return result[0];
  }

  async getHoroscopeBySignAndDate(sign: string, date: string): Promise<Horoscope | undefined> {
    const result = await db.select().from(horoscopes)
      .where(and(eq(horoscopes.sign, sign), eq(horoscopes.date, date)))
      .limit(1);
    return result[0];
  }

  async getHoroscopesByDate(date: string): Promise<Horoscope[]> {
    console.log("getHoroscopesByDate called with date:", date);
    
    // Fetch all horoscopes for debugging
    const allHoroscopes = await db.select().from(horoscopes);
    console.log("All horoscopes in database:", allHoroscopes, "Count:", allHoroscopes.length);
    
    // Get horoscopes for requested date
    const result = await db.select().from(horoscopes)
      .where(eq(horoscopes.date, date))
      .orderBy(asc(horoscopes.sign));
    
    console.log("Horoscopes found for date", date, ":", result, "Count:", result.length);
    return result;
  }

  async createHoroscope(horoscope: InsertHoroscope): Promise<Horoscope> {
    const result = await db.insert(horoscopes).values({
      ...horoscope,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return result[0];
  }

  async updateHoroscope(id: number, horoscope: Partial<Horoscope>): Promise<Horoscope | undefined> {
    const result = await db.update(horoscopes)
      .set({
        ...horoscope,
        updatedAt: new Date()
      })
      .where(eq(horoscopes.id, id))
      .returning();
    return result[0];
  }

  async deleteHoroscope(id: number): Promise<boolean> {
    const result = await db.delete(horoscopes).where(eq(horoscopes.id, id)).returning();
    return result.length > 0;
  }

  // Newsletter Subscribers
  async getSubscriber(id: number): Promise<Subscriber | undefined> {
    const result = await db.select().from(subscribers).where(eq(subscribers.id, id)).limit(1);
    return result[0];
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    const result = await db.select().from(subscribers).where(eq(subscribers.email, email)).limit(1);
    return result[0];
  }

  async getSubscribers(): Promise<Subscriber[]> {
    return await db.select().from(subscribers)
      .where(eq(subscribers.subscribed, true))
      .orderBy(desc(subscribers.subscribedAt));
  }

  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const result = await db.insert(subscribers).values({
      ...subscriber,
    }).returning();
    return result[0];
  }

  async updateSubscriber(id: number, subscriber: Partial<Subscriber>): Promise<Subscriber | undefined> {
    const result = await db.update(subscribers)
      .set(subscriber)
      .where(eq(subscribers.id, id))
      .returning();
    return result[0];
  }

  async deleteSubscriber(id: number): Promise<boolean> {
    const result = await db.delete(subscribers).where(eq(subscribers.id, id)).returning();
    return result.length > 0;
  }

  // Testimonials
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    const result = await db.select().from(testimonials).where(eq(testimonials.id, id)).limit(1);
    return result[0];
  }

  async getTestimonialsByService(serviceId: number): Promise<Testimonial[]> {
    console.log("Fetching testimonials for service:", serviceId);
    
    // First get all testimonials for this service
    const allServiceTestimonials = await db.select().from(testimonials)
      .where(eq(testimonials.serviceId, serviceId))
      .orderBy(desc(testimonials.createdAt));
    
    console.log("Found", allServiceTestimonials.length, "testimonials for service", serviceId);
    
    // Filter for approved only
    const approvedTestimonials = allServiceTestimonials.filter(t => {
      // Safer type handling for PostgreSQL boolean values
      if (t.approved === null) return false;
      if (typeof t.approved === 'boolean') return t.approved;
      // Handle string or other types
      const approvedStr = String(t.approved).toLowerCase();
      return approvedStr === 'true' || approvedStr === 't' || approvedStr === '1';
    });
    
    console.log("After filtering for approved:", approvedTestimonials.length, "testimonials");
    return approvedTestimonials;
  }

  async getApprovedTestimonials(): Promise<Testimonial[]> {
    // Add logging to debug
    console.log("Fetching approved testimonials");
    const allTestimonials = await db.select().from(testimonials);
    console.log("All testimonials:", allTestimonials.length, "- with approved values:", allTestimonials.map(t => t.approved));
    
    // In PostgreSQL, the boolean value might be stored differently than a JS boolean
    // We'll retrieve all and then filter in JS to be safe
    const approved = allTestimonials.filter(t => {
      // Safer type handling for PostgreSQL boolean values
      if (t.approved === null) return false;
      if (typeof t.approved === 'boolean') return t.approved;
      // Handle string or other types
      const approvedStr = String(t.approved).toLowerCase();
      return approvedStr === 'true' || approvedStr === 't' || approvedStr === '1';
    });
    
    console.log("Filtered approved testimonials:", approved.length);
    return approved;
  }
  
  async getAllTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials)
      .orderBy(desc(testimonials.createdAt));
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const result = await db.insert(testimonials).values({
      ...testimonial,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    return result[0];
  }

  async updateTestimonial(id: number, testimonial: Partial<Testimonial>): Promise<Testimonial | undefined> {
    const result = await db.update(testimonials)
      .set({
        ...testimonial,
        updatedAt: new Date()
      })
      .where(eq(testimonials.id, id))
      .returning();
    return result[0];
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    const result = await db.delete(testimonials).where(eq(testimonials.id, id)).returning();
    return result.length > 0;
  }
}

export const storage = new PgStorage();