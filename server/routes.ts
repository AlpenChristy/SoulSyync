import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./pgStorage";
import { 
  apiResponseSchema, loginUserSchema, insertUserSchema, insertAppointmentSchema, 
  insertBlogPostSchema, insertHoroscopeSchema, insertSubscriberSchema, 
  insertTestimonialSchema, Testimonial
} from "@shared/schema";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

export async function registerRoutes(app: Express): Promise<Server> {
  // Session setup
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "SoulSyync-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 24 * 60 * 60 * 1000 },
    })
  );

  // Passport setup
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        console.log("Authentication attempt for username:", username);
        const user = await storage.getUserByUsername(username);
        
        if (!user) {
          console.log("User not found:", username);
          return done(null, false, { message: "Incorrect username." });
        }

        console.log("User found, comparing passwords:", username);
        
        // For admin testing, log the first few characters of stored hash
        if (username === "admin") {
          console.log("Admin login attempt. Password hash (first 10 chars):", user.password.substring(0, 10));
        }
        
        const isValid = await bcrypt.compare(password, user.password);
        
        if (!isValid) {
          console.log("Password comparison failed for:", username);
          return done(null, false, { message: "Incorrect password." });
        }

        console.log("Password valid, authentication successful for:", username);
        return done(null, user);
      } catch (error) {
        console.error("Authentication error:", error);
        return done(error);
      }
    })
  );

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });

  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ success: false, message: "Unauthorized" });
  };

  // Middleware to check if user is admin
  const isAdmin = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated() && (req.user as any).role === "admin") {
      return next();
    }
    res.status(403).json({ success: false, message: "Forbidden" });
  };

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: "Username already exists" 
        });
      }

      // Check if email already exists
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({ 
          success: false, 
          message: "Email already exists" 
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword
      });

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({ 
        success: true, 
        message: "User registered successfully", 
        data: userWithoutPassword 
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to register user" 
      });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    try {
      console.log("Login attempt:", req.body.username);
      const validatedData = loginUserSchema.parse(req.body);
      
      passport.authenticate("local", (err: Error, user: any, info: any) => {
        if (err) {
          console.error("Login error:", err);
          return next(err);
        }
        if (!user) {
          console.log("Login failed:", info?.message || "Invalid credentials");
          return res.status(401).json({ 
            success: false, 
            message: info?.message || "Invalid credentials" 
          });
        }
        
        req.logIn(user, (err) => {
          if (err) {
            console.error("Login session error:", err);
            return next(err);
          }
          
          // Remove password from response
          const { password, ...userWithoutPassword } = user;
          
          console.log("Login successful:", userWithoutPassword.username, "Role:", userWithoutPassword.role);
          
          return res.json({ 
            success: true, 
            message: "Login successful", 
            data: userWithoutPassword 
          });
        });
      })(req, res, next);
    } catch (error) {
      console.error("Login validation error:", error);
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to login" 
      });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ 
          success: false, 
          message: "Failed to logout" 
        });
      }
      res.json({ success: true, message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/user", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authenticated" 
      });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = req.user as any;
    
    res.json({ 
      success: true, 
      data: userWithoutPassword 
    });
  });

  // Services routes
  app.get("/api/services", async (req, res) => {
    try {
      const services = await storage.getServices();
      res.json({ success: true, data: services });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to get services" 
      });
    }
  });

  app.get("/api/services/:id", async (req, res) => {
    try {
      const service = await storage.getService(parseInt(req.params.id));
      if (!service) {
        return res.status(404).json({ 
          success: false, 
          message: "Service not found" 
        });
      }
      res.json({ success: true, data: service });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to get service" 
      });
    }
  });

  // Appointments routes
  app.post("/api/appointments", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse({
        ...req.body,
        userId: (req.user as any).id
      });
      
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json({ 
        success: true, 
        message: "Appointment created successfully", 
        data: appointment 
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create appointment" 
      });
    }
  });

  app.get("/api/appointments", isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const isUserAdmin = (req.user as any).role === "admin";
      
      const appointments = isUserAdmin
        ? await storage.getAllAppointments()
        : await storage.getAppointmentsByUser(userId);
      
      res.json({ success: true, data: appointments });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to get appointments" 
      });
    }
  });

  app.get("/api/appointments/:id", isAuthenticated, async (req, res) => {
    try {
      const appointment = await storage.getAppointment(parseInt(req.params.id));
      
      if (!appointment) {
        return res.status(404).json({ 
          success: false, 
          message: "Appointment not found" 
        });
      }
      
      const userId = (req.user as any).id;
      const isUserAdmin = (req.user as any).role === "admin";
      
      if (!isUserAdmin && appointment.userId !== userId) {
        return res.status(403).json({ 
          success: false, 
          message: "Forbidden" 
        });
      }
      
      res.json({ success: true, data: appointment });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to get appointment" 
      });
    }
  });

  app.put("/api/appointments/:id", isAuthenticated, async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const appointment = await storage.getAppointment(appointmentId);
      
      if (!appointment) {
        return res.status(404).json({ 
          success: false, 
          message: "Appointment not found" 
        });
      }
      
      const userId = (req.user as any).id;
      const isUserAdmin = (req.user as any).role === "admin";
      
      if (!isUserAdmin && appointment.userId !== userId) {
        return res.status(403).json({ 
          success: false, 
          message: "Forbidden" 
        });
      }
      
      const updatedAppointment = await storage.updateAppointment(
        appointmentId,
        isUserAdmin ? req.body : { notes: req.body.notes }
      );
      
      res.json({ 
        success: true, 
        message: "Appointment updated successfully", 
        data: updatedAppointment 
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to update appointment" 
      });
    }
  });

  app.delete("/api/appointments/:id", isAuthenticated, async (req, res) => {
    try {
      const appointmentId = parseInt(req.params.id);
      const appointment = await storage.getAppointment(appointmentId);
      
      if (!appointment) {
        return res.status(404).json({ 
          success: false, 
          message: "Appointment not found" 
        });
      }
      
      const userId = (req.user as any).id;
      const isUserAdmin = (req.user as any).role === "admin";
      
      if (!isUserAdmin && appointment.userId !== userId) {
        return res.status(403).json({ 
          success: false, 
          message: "Forbidden" 
        });
      }
      
      await storage.deleteAppointment(appointmentId);
      
      res.json({ 
        success: true, 
        message: "Appointment deleted successfully" 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to delete appointment" 
      });
    }
  });

  // Blog posts routes
  app.get("/api/blog-posts", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const featured = req.query.featured === "true";
      
      let posts;
      if (category) {
        posts = await storage.getBlogPostsByCategory(category);
      } else if (featured) {
        posts = await storage.getFeaturedBlogPosts();
      } else {
        posts = await storage.getBlogPosts();
      }
      
      res.json({ success: true, data: posts });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to get blog posts" 
      });
    }
  });

  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const post = await storage.getBlogPost(parseInt(req.params.id));
      
      if (!post) {
        return res.status(404).json({ 
          success: false, 
          message: "Blog post not found" 
        });
      }
      
      res.json({ success: true, data: post });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to get blog post" 
      });
    }
  });

  app.post("/api/blog-posts", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertBlogPostSchema.parse({
        ...req.body,
        authorId: (req.user as any).id
      });
      
      const post = await storage.createBlogPost(validatedData);
      
      res.status(201).json({ 
        success: true, 
        message: "Blog post created successfully", 
        data: post 
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create blog post" 
      });
    }
  });

  app.put("/api/blog-posts/:id", isAdmin, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getBlogPost(postId);
      
      if (!post) {
        return res.status(404).json({ 
          success: false, 
          message: "Blog post not found" 
        });
      }
      
      const updatedPost = await storage.updateBlogPost(postId, req.body);
      
      res.json({ 
        success: true, 
        message: "Blog post updated successfully", 
        data: updatedPost 
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to update blog post" 
      });
    }
  });

  app.delete("/api/blog-posts/:id", isAdmin, async (req, res) => {
    try {
      const postId = parseInt(req.params.id);
      const post = await storage.getBlogPost(postId);
      
      if (!post) {
        return res.status(404).json({ 
          success: false, 
          message: "Blog post not found" 
        });
      }
      
      await storage.deleteBlogPost(postId);
      
      res.json({ 
        success: true, 
        message: "Blog post deleted successfully" 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to delete blog post" 
      });
    }
  });

  // Horoscope routes
  app.get("/api/horoscopes", async (req, res) => {
    try {
      const date = req.query.date as string || new Date().toISOString().split('T')[0];
      const sign = req.query.sign as string | undefined;
      
      if (sign) {
        const horoscope = await storage.getHoroscopeBySignAndDate(sign, date);
        
        if (!horoscope) {
          return res.status(404).json({ 
            success: false, 
            message: "Horoscope not found" 
          });
        }
        
        return res.json({ success: true, data: horoscope });
      }
      
      const horoscopes = await storage.getHoroscopesByDate(date);
      res.json({ success: true, data: horoscopes });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to get horoscopes" 
      });
    }
  });

  app.post("/api/horoscopes", isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertHoroscopeSchema.parse({
        ...req.body,
        authorId: (req.user as any).id
      });
      
      // Check if a horoscope for this sign and date already exists
      const existingHoroscope = await storage.getHoroscopeBySignAndDate(
        validatedData.sign,
        validatedData.date
      );
      
      if (existingHoroscope) {
        return res.status(400).json({ 
          success: false, 
          message: "A horoscope for this sign and date already exists" 
        });
      }
      
      const horoscope = await storage.createHoroscope(validatedData);
      
      res.status(201).json({ 
        success: true, 
        message: "Horoscope created successfully", 
        data: horoscope 
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to create horoscope" 
      });
    }
  });

  app.put("/api/horoscopes/:id", isAdmin, async (req, res) => {
    try {
      const horoscopeId = parseInt(req.params.id);
      const horoscope = await storage.getHoroscope(horoscopeId);
      
      if (!horoscope) {
        return res.status(404).json({ 
          success: false, 
          message: "Horoscope not found" 
        });
      }
      
      const updatedHoroscope = await storage.updateHoroscope(horoscopeId, req.body);
      
      res.json({ 
        success: true, 
        message: "Horoscope updated successfully", 
        data: updatedHoroscope 
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to update horoscope" 
      });
    }
  });

  // Newsletter subscribers routes
  app.post("/api/subscribers", async (req, res) => {
    try {
      const validatedData = insertSubscriberSchema.parse(req.body);
      
      // Check if email already exists
      const existingSubscriber = await storage.getSubscriberByEmail(validatedData.email);
      
      if (existingSubscriber) {
        if (existingSubscriber.subscribed) {
          return res.status(400).json({ 
            success: false, 
            message: "Email already subscribed" 
          });
        } else {
          // Reactivate subscription
          const updatedSubscriber = await storage.updateSubscriber(
            existingSubscriber.id,
            { subscribed: true }
          );
          
          return res.json({ 
            success: true, 
            message: "Subscription reactivated", 
            data: updatedSubscriber 
          });
        }
      }
      
      const subscriber = await storage.createSubscriber(validatedData);
      
      res.status(201).json({ 
        success: true, 
        message: "Subscribed successfully", 
        data: subscriber 
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to subscribe" 
      });
    }
  });

  app.get("/api/subscribers", isAdmin, async (req, res) => {
    try {
      const subscribers = await storage.getSubscribers();
      res.json({ success: true, data: subscribers });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to get subscribers" 
      });
    }
  });

  // Testimonials routes
  app.get("/api/testimonials", async (req, res) => {
    try {
      const serviceId = req.query.serviceId ? parseInt(req.query.serviceId as string) : undefined;
      
      const testimonials = serviceId
        ? await storage.getTestimonialsByService(serviceId)
        : await storage.getApprovedTestimonials();
      
      res.json({ success: true, data: testimonials });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to get testimonials" 
      });
    }
  });

  app.post("/api/testimonials", async (req, res) => {
    try {
      const userId = req.isAuthenticated() ? (req.user as any).id : null;
      
      const validatedData = insertTestimonialSchema.parse({
        ...req.body,
        userId
      });
      
      const testimonial = await storage.createTestimonial(validatedData);
      
      res.status(201).json({ 
        success: true, 
        message: "Testimonial submitted for review", 
        data: testimonial 
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to submit testimonial" 
      });
    }
  });

  app.get("/api/testimonials/all", isAdmin, async (req, res) => {
    try {
      // Get ALL testimonials for admin, not just approved ones
      const testimonials: Testimonial[] = await storage.getAllTestimonials();
      
      // Log for debugging
      console.log("Retrieved testimonials for admin:", testimonials.length);
      
      res.json({ success: true, data: testimonials });
    } catch (error) {
      console.error("Failed to get all testimonials:", error);
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to get all testimonials" 
      });
    }
  });

  app.patch("/api/testimonials/:id/approve", isAdmin, async (req, res) => {
    try {
      const testimonialId = parseInt(req.params.id);
      const testimonial = await storage.getTestimonial(testimonialId);
      
      if (!testimonial) {
        return res.status(404).json({ 
          success: false, 
          message: "Testimonial not found" 
        });
      }
      
      const updatedTestimonial = await storage.updateTestimonial(
        testimonialId,
        { approved: true }
      );
      
      res.json({ 
        success: true, 
        message: "Testimonial approved successfully", 
        data: updatedTestimonial 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to approve testimonial" 
      });
    }
  });
  
  app.delete("/api/testimonials/:id", isAdmin, async (req, res) => {
    try {
      const testimonialId = parseInt(req.params.id);
      const deleted = await storage.deleteTestimonial(testimonialId);
      
      if (!deleted) {
        return res.status(404).json({ 
          success: false, 
          message: "Testimonial not found" 
        });
      }
      
      res.json({ 
        success: true, 
        message: "Testimonial deleted successfully" 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to delete testimonial" 
      });
    }
  });
  
  app.post("/api/testimonials/bulk-approve", isAdmin, async (req, res) => {
    try {
      const { ids } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid testimonial IDs" 
        });
      }
      
      const results = await Promise.all(
        ids.map(id => storage.updateTestimonial(id, { approved: true }))
      );
      
      res.json({ 
        success: true, 
        message: `${results.filter(Boolean).length} testimonials approved successfully` 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to approve testimonials" 
      });
    }
  });
  
  app.post("/api/testimonials/bulk-delete", isAdmin, async (req, res) => {
    try {
      const { ids } = req.body;
      
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid testimonial IDs" 
        });
      }
      
      const results = await Promise.all(
        ids.map(id => storage.deleteTestimonial(id))
      );
      
      res.json({ 
        success: true, 
        message: `${results.filter(Boolean).length} testimonials deleted successfully` 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to delete testimonials" 
      });
    }
  });

  // User management routes (admin only)
  app.get("/api/users", isAdmin, async (req, res) => {
    try {
      const users = await storage.getUsers();
      
      // Remove passwords from response
      const usersWithoutPassword = users.map(({ password, ...user }) => user);
      
      res.json({ success: true, data: usersWithoutPassword });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to get users" 
      });
    }
  });

  app.put("/api/users/:id", isAuthenticated, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }
      
      const currentUserId = (req.user as any).id;
      const isUserAdmin = (req.user as any).role === "admin";
      
      // Only allow users to update their own profile, unless they are admin
      if (!isUserAdmin && userId !== currentUserId) {
        return res.status(403).json({ 
          success: false, 
          message: "Forbidden" 
        });
      }
      
      // Handle password update separately
      let updateData: Partial<typeof user> = { ...req.body };
      
      if (req.body.password) {
        updateData.password = await bcrypt.hash(req.body.password, 10);
      }
      
      // Only admins can change user roles
      if (!isUserAdmin) {
        delete updateData.role;
      }
      
      const updatedUser = await storage.updateUser(userId, updateData);
      
      if (!updatedUser) {
        return res.status(404).json({ 
          success: false, 
          message: "User not found" 
        });
      }
      
      // Remove password from response
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json({ 
        success: true, 
        message: "User updated successfully", 
        data: userWithoutPassword 
      });
    } catch (error) {
      res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to update user" 
      });
    }
  });

  // Admin dashboard analytics route
  app.get("/api/analytics", isAdmin, async (req, res) => {
    try {
      // Get counts for various entities
      const users = await storage.getUsers();
      const appointments = await storage.getAllAppointments();
      const blogPosts = await storage.getBlogPosts();
      const subscribers = await storage.getSubscribers();
      const testimonials = await storage.getApprovedTestimonials();
      
      // Calculate stats
      const analytics = {
        userCount: users.length,
        appointmentStats: {
          total: appointments.length,
          pending: appointments.filter(a => a.status === "pending").length,
          confirmed: appointments.filter(a => a.status === "confirmed").length,
          completed: appointments.filter(a => a.status === "completed").length,
          canceled: appointments.filter(a => a.status === "canceled").length,
        },
        blogPostCount: blogPosts.length,
        subscriberCount: subscribers.length,
        testimonialCount: testimonials.length,
      };
      
      res.json({ success: true, data: analytics });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to get analytics" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
