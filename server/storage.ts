import {
  users, User, InsertUser,
  services, Service, InsertService,
  appointments, Appointment, InsertAppointment,
  blogPosts, BlogPost, InsertBlogPost,
  horoscopes, Horoscope, InsertHoroscope,
  subscribers, Subscriber, InsertSubscriber,
  testimonials, Testimonial, InsertTestimonial
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  getUsers(): Promise<User[]>;

  // Services
  getService(id: number): Promise<Service | undefined>;
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: Partial<Service>): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;

  // Appointments
  getAppointment(id: number): Promise<Appointment | undefined>;
  getAppointmentsByUser(userId: number): Promise<Appointment[]>;
  getAppointmentsByService(serviceId: number): Promise<Appointment[]>;
  getAppointmentsByDate(date: string): Promise<Appointment[]>;
  getAllAppointments(): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, appointment: Partial<Appointment>): Promise<Appointment | undefined>;
  deleteAppointment(id: number): Promise<boolean>;

  // Blog Posts
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPostsByCategory(category: string): Promise<BlogPost[]>;
  getFeaturedBlogPosts(): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Horoscopes
  getHoroscope(id: number): Promise<Horoscope | undefined>;
  getHoroscopeBySignAndDate(sign: string, date: string): Promise<Horoscope | undefined>;
  getHoroscopesByDate(date: string): Promise<Horoscope[]>;
  createHoroscope(horoscope: InsertHoroscope): Promise<Horoscope>;
  updateHoroscope(id: number, horoscope: Partial<Horoscope>): Promise<Horoscope | undefined>;
  deleteHoroscope(id: number): Promise<boolean>;

  // Newsletter Subscribers
  getSubscriber(id: number): Promise<Subscriber | undefined>;
  getSubscriberByEmail(email: string): Promise<Subscriber | undefined>;
  getSubscribers(): Promise<Subscriber[]>;
  createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber>;
  updateSubscriber(id: number, subscriber: Partial<Subscriber>): Promise<Subscriber | undefined>;
  deleteSubscriber(id: number): Promise<boolean>;

  // Testimonials
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  getTestimonialsByService(serviceId: number): Promise<Testimonial[]>;
  getApprovedTestimonials(): Promise<Testimonial[]>;
  getAllTestimonials(): Promise<Testimonial[]>; // New method to get ALL testimonials
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(id: number, testimonial: Partial<Testimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private services: Map<number, Service>;
  private appointments: Map<number, Appointment>;
  private blogPosts: Map<number, BlogPost>;
  private horoscopes: Map<number, Horoscope>;
  private subscribers: Map<number, Subscriber>;
  private testimonials: Map<number, Testimonial>;
  
  private userIdCounter: number;
  private serviceIdCounter: number;
  private appointmentIdCounter: number;
  private blogPostIdCounter: number;
  private horoscopeIdCounter: number;
  private subscriberIdCounter: number;
  private testimonialIdCounter: number;

  constructor() {
    this.users = new Map();
    this.services = new Map();
    this.appointments = new Map();
    this.blogPosts = new Map();
    this.horoscopes = new Map();
    this.subscribers = new Map();
    this.testimonials = new Map();

    this.userIdCounter = 1;
    this.serviceIdCounter = 1;
    this.appointmentIdCounter = 1;
    this.blogPostIdCounter = 1;
    this.horoscopeIdCounter = 1;
    this.subscriberIdCounter = 1;
    this.testimonialIdCounter = 1;

    // Initialize with sample data
    this.initializeData();
  }

  private initializeData() {
    // Sample admin user
    this.createUser({
      username: "admin",
      password: "$2b$10$vKbmz0uwPLpQrHOVQboXx.RMuUBgU8LMExrVcbw.eMnNEXrfZx5ke", // "password"
      email: "admin@SoulSyync.com",
      fullName: "Admin User",
    }).then(user => {
      this.updateUser(user.id, { role: "admin" });
    });

    // Sample services
    const services = [
      {
        name: "Spiritual Counseling",
        description: "One-on-one sessions to explore your spiritual path, overcome obstacles, and find inner peace.",
        price: 8000, // $80.00
        duration: 60, // 60 minutes
        imageUrl: "https://images.pexels.com/photos/6541343/pexels-photo-6541343.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      },
      {
        name: "Chakra Balancing",
        description: "Realign your energy centers to promote physical, emotional, and spiritual well-being.",
        price: 9500, // $95.00
        duration: 75, // 75 minutes
        imageUrl: "https://images.pexels.com/photos/8964774/pexels-photo-8964774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      },
      {
        name: "Aura Cleansing",
        description: "Clear negative energies and strengthen your energetic field for protection and vitality.",
        price: 8500, // $85.00
        duration: 60, // 60 minutes
        imageUrl: "https://images.pexels.com/photos/3758105/pexels-photo-3758105.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      },
      {
        name: "Meditation Guidance",
        description: "Learn personalized meditation techniques to quiet the mind and connect with your inner wisdom.",
        price: 7500, // $75.00
        duration: 60, // 60 minutes
        imageUrl: "https://images.pexels.com/photos/8964912/pexels-photo-8964912.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      }
    ];

    services.forEach(service => {
      this.createService(service);
    });

    // Sample blog posts
    const blogPosts = [
      {
        title: "5 Morning Meditation Techniques to Start Your Day Right",
        content: `<p>Starting your day with meditation can set a positive tone for the hours ahead. Here are five techniques to try:</p>
                 <h3>1. Mindful Breathing</h3>
                 <p>Sit comfortably and focus solely on your breath for 5-10 minutes. Notice the sensation of air entering and leaving your body.</p>
                 <h3>2. Gratitude Meditation</h3>
                 <p>Begin by listing three things you're grateful for, then sit quietly and feel the appreciation in your heart.</p>
                 <h3>3. Body Scan</h3>
                 <p>Progressively relax each part of your body from toes to head, releasing tension as you go.</p>
                 <h3>4. Visualization</h3>
                 <p>Imagine your ideal day unfolding, focusing on how you want to feel rather than specific events.</p>
                 <h3>5. Mantra Repetition</h3>
                 <p>Choose a word or phrase that resonates with you and repeat it silently for 5-10 minutes.</p>
                 <p>Consistency is key. Even just five minutes each morning can make a significant difference in your mental clarity and emotional balance throughout the day.</p>`,
        authorId: 1,
        category: "Meditation",
        imageUrl: "https://images.pexels.com/photos/3822355/pexels-photo-3822355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        featured: true
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
        featured: false
      }
    ];

    blogPosts.forEach(post => {
      this.createBlogPost(post);
    });

    // Sample testimonials
    const testimonials = [
      {
        userId: null,
        name: "Jessica D.",
        content: "The chakra balancing session was transformative. I felt an immediate shift in my energy and a newfound clarity that has stayed with me for weeks.",
        rating: 5,
        serviceId: 2,
        approved: true
      },
      {
        userId: null,
        name: "Michael S.",
        content: "I was skeptical at first, but after just three spiritual counseling sessions, I've gained invaluable insights about my life's purpose. Truly life-changing.",
        rating: 5,
        serviceId: 1,
        approved: true
      },
      {
        userId: null,
        name: "Anna T.",
        content: "The aura cleansing was exactly what I needed. I felt lighter, more positive, and had better sleep afterward. Will definitely be booking monthly sessions.",
        rating: 5,
        serviceId: 3,
        approved: true
      }
    ];

    testimonials.forEach(testimonial => {
      this.createTestimonial(testimonial);
    });

    // Sample horoscopes
    const today = new Date().toISOString().split('T')[0];
    const horoscopes = [
      {
        sign: "aries",
        content: "Today is ideal for new beginnings, Aries. Your energy and confidence are high, making it the perfect time to initiate projects or have important conversations. Trust your instincts, but remember to balance action with thoughtfulness.",
        date: today,
        authorId: 1
      },
      {
        sign: "taurus",
        content: "Focus on stability and security today, Taurus. Your practical nature will help you make sound financial decisions. Take time to appreciate the simple pleasures around you, as they will bring you the most joy.",
        date: today,
        authorId: 1
      },
      {
        sign: "gemini",
        content: "Communication flows easily for you today, Gemini. It's an excellent time for networking, writing, or any form of expression. Your curiosity leads you to interesting discoveries - follow where it takes you.",
        date: today,
        authorId: 1
      },
      {
        sign: "cancer",
        content: "Your intuition is especially strong today, Cancer. Pay attention to your dreams and inner feelings as they contain important guidance. Home and family matters take center stage, bringing comfort and emotional fulfillment.",
        date: today,
        authorId: 1
      },
      {
        sign: "leo",
        content: "Your natural leadership qualities shine today, Leo. Others look to you for guidance and inspiration. Creative endeavors are favored, so don't hesitate to express yourself authentically.",
        date: today,
        authorId: 1
      },
      {
        sign: "virgo",
        content: "Details matter more than usual today, Virgo. Your analytical skills help you solve problems that have been puzzling others. Take time for self-care and don't be too critical of yourself or others.",
        date: today,
        authorId: 1
      },
      {
        sign: "libra",
        content: "Harmony and balance are themes for you today, Libra. Relationships improve through honest communication and compromise. Artistic pursuits are especially favored, bringing beauty into your life and others.",
        date: today,
        authorId: 1
      },
      {
        sign: "scorpio",
        content: "Transformation is highlighted for you today, Scorpio. Let go of what no longer serves you to make room for new growth. Your intensity and focus help you achieve what others might find impossible.",
        date: today,
        authorId: 1
      },
      {
        sign: "sagittarius",
        content: "Adventure calls to you today, Sagittarius. Explore new ideas, places, or philosophies. Your optimism is contagious, lifting the spirits of those around you. Trust in your own wisdom and experience.",
        date: today,
        authorId: 1
      },
      {
        sign: "capricorn",
        content: "Professional matters progress well today, Capricorn. Your discipline and determination are recognized and appreciated. Remember to balance work with relaxation for sustainable success.",
        date: today,
        authorId: 1
      },
      {
        sign: "aquarius",
        content: "Innovative ideas flow freely today, Aquarius. Your unique perspective helps solve community or group challenges. Technological matters are favored, and unexpected connections prove valuable.",
        date: today,
        authorId: 1
      },
      {
        sign: "pisces",
        content: "Your compassionate nature touches others deeply today, Pisces. Creative and spiritual pursuits bring fulfillment. Trust your intuition in matters of the heart, as it guides you toward meaningful connections.",
        date: today,
        authorId: 1
      }
    ];

    horoscopes.forEach(horoscope => {
      this.createHoroscope(horoscope);
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { ...user, id, role: "user" };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, user: Partial<User>): Promise<User | undefined> {
    const existingUser = await this.getUser(id);
    if (!existingUser) return undefined;

    const updatedUser: User = { ...existingUser, ...user };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Services
  async getService(id: number): Promise<Service | undefined> {
    return this.services.get(id);
  }

  async getServices(): Promise<Service[]> {
    return Array.from(this.services.values());
  }

  async createService(service: InsertService): Promise<Service> {
    const id = this.serviceIdCounter++;
    const newService: Service = { ...service, id };
    this.services.set(id, newService);
    return newService;
  }

  async updateService(id: number, service: Partial<Service>): Promise<Service | undefined> {
    const existingService = await this.getService(id);
    if (!existingService) return undefined;

    const updatedService: Service = { ...existingService, ...service };
    this.services.set(id, updatedService);
    return updatedService;
  }

  async deleteService(id: number): Promise<boolean> {
    return this.services.delete(id);
  }

  // Appointments
  async getAppointment(id: number): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async getAppointmentsByUser(userId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.userId === userId
    );
  }

  async getAppointmentsByService(serviceId: number): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.serviceId === serviceId
    );
  }

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).filter(
      (appointment) => appointment.date === date
    );
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values());
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const id = this.appointmentIdCounter++;
    const newAppointment: Appointment = { 
      ...appointment, 
      id, 
      status: "pending",
      summary: "" 
    };
    this.appointments.set(id, newAppointment);
    return newAppointment;
  }

  async updateAppointment(id: number, appointment: Partial<Appointment>): Promise<Appointment | undefined> {
    const existingAppointment = await this.getAppointment(id);
    if (!existingAppointment) return undefined;

    const updatedAppointment: Appointment = { ...existingAppointment, ...appointment };
    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  async deleteAppointment(id: number): Promise<boolean> {
    return this.appointments.delete(id);
  }

  // Blog Posts
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    return this.blogPosts.get(id);
  }

  async getBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values()).sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  }

  async getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter((post) => post.category.toLowerCase() === category.toLowerCase())
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async getFeaturedBlogPosts(): Promise<BlogPost[]> {
    return Array.from(this.blogPosts.values())
      .filter((post) => post.featured)
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const id = this.blogPostIdCounter++;
    const newPost: BlogPost = { 
      ...post, 
      id, 
      publishedAt: new Date()
    };
    this.blogPosts.set(id, newPost);
    return newPost;
  }

  async updateBlogPost(id: number, post: Partial<BlogPost>): Promise<BlogPost | undefined> {
    const existingPost = await this.getBlogPost(id);
    if (!existingPost) return undefined;

    const updatedPost: BlogPost = { ...existingPost, ...post };
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    return this.blogPosts.delete(id);
  }

  // Horoscopes
  async getHoroscope(id: number): Promise<Horoscope | undefined> {
    return this.horoscopes.get(id);
  }

  async getHoroscopeBySignAndDate(sign: string, date: string): Promise<Horoscope | undefined> {
    return Array.from(this.horoscopes.values()).find(
      (horoscope) => 
        horoscope.sign.toLowerCase() === sign.toLowerCase() && 
        horoscope.date === date
    );
  }

  async getHoroscopesByDate(date: string): Promise<Horoscope[]> {
    return Array.from(this.horoscopes.values()).filter(
      (horoscope) => horoscope.date === date
    );
  }

  async createHoroscope(horoscope: InsertHoroscope): Promise<Horoscope> {
    const id = this.horoscopeIdCounter++;
    const newHoroscope: Horoscope = { ...horoscope, id };
    this.horoscopes.set(id, newHoroscope);
    return newHoroscope;
  }

  async updateHoroscope(id: number, horoscope: Partial<Horoscope>): Promise<Horoscope | undefined> {
    const existingHoroscope = await this.getHoroscope(id);
    if (!existingHoroscope) return undefined;

    const updatedHoroscope: Horoscope = { ...existingHoroscope, ...horoscope };
    this.horoscopes.set(id, updatedHoroscope);
    return updatedHoroscope;
  }

  async deleteHoroscope(id: number): Promise<boolean> {
    return this.horoscopes.delete(id);
  }

  // Newsletter Subscribers
  async getSubscriber(id: number): Promise<Subscriber | undefined> {
    return this.subscribers.get(id);
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | undefined> {
    return Array.from(this.subscribers.values()).find(
      (subscriber) => subscriber.email.toLowerCase() === email.toLowerCase()
    );
  }

  async getSubscribers(): Promise<Subscriber[]> {
    return Array.from(this.subscribers.values());
  }

  async createSubscriber(subscriber: InsertSubscriber): Promise<Subscriber> {
    const id = this.subscriberIdCounter++;
    const newSubscriber: Subscriber = { 
      ...subscriber, 
      id, 
      subscribed: true,
      subscribedAt: new Date()
    };
    this.subscribers.set(id, newSubscriber);
    return newSubscriber;
  }

  async updateSubscriber(id: number, subscriber: Partial<Subscriber>): Promise<Subscriber | undefined> {
    const existingSubscriber = await this.getSubscriber(id);
    if (!existingSubscriber) return undefined;

    const updatedSubscriber: Subscriber = { ...existingSubscriber, ...subscriber };
    this.subscribers.set(id, updatedSubscriber);
    return updatedSubscriber;
  }

  async deleteSubscriber(id: number): Promise<boolean> {
    return this.subscribers.delete(id);
  }

  // Testimonials
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async getTestimonialsByService(serviceId: number): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(
      (testimonial) => testimonial.serviceId === serviceId && testimonial.approved
    );
  }

  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter(
      (testimonial) => testimonial.approved
    );
  }
  
  async getAllTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialIdCounter++;
    const newTestimonial: Testimonial = { 
      ...testimonial, 
      id, 
      approved: false 
    };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }

  async updateTestimonial(id: number, testimonial: Partial<Testimonial>): Promise<Testimonial | undefined> {
    const existingTestimonial = await this.getTestimonial(id);
    if (!existingTestimonial) return undefined;

    const updatedTestimonial: Testimonial = { ...existingTestimonial, ...testimonial };
    this.testimonials.set(id, updatedTestimonial);
    return updatedTestimonial;
  }

  async deleteTestimonial(id: number): Promise<boolean> {
    return this.testimonials.delete(id);
  }
}

export const storage = new MemStorage();
