export const ZODIAC_SIGNS = [
  { name: "Aries", emoji: "♈", dates: "Mar 21 - Apr 19" },
  { name: "Taurus", emoji: "♉", dates: "Apr 20 - May 20" },
  { name: "Gemini", emoji: "♊", dates: "May 21 - Jun 20" },
  { name: "Cancer", emoji: "♋", dates: "Jun 21 - Jul 22" },
  { name: "Leo", emoji: "♌", dates: "Jul 23 - Aug 22" },
  { name: "Virgo", emoji: "♍", dates: "Aug 23 - Sep 22" },
  { name: "Libra", emoji: "♎", dates: "Sep 23 - Oct 22" },
  { name: "Scorpio", emoji: "♏", dates: "Oct 23 - Nov 21" },
  { name: "Sagittarius", emoji: "♐", dates: "Nov 22 - Dec 21" },
  { name: "Capricorn", emoji: "♑", dates: "Dec 22 - Jan 19" },
  { name: "Aquarius", emoji: "♒", dates: "Jan 20 - Feb 18" },
  { name: "Pisces", emoji: "♓", dates: "Feb 19 - Mar 20" }
];

export const BLOG_CATEGORIES = [
  "Meditation",
  "Spiritual Growth",
  "Chakra Healing",
  "Crystal Healing",
  "Astrology",
  "Energy Work",
  "Mindfulness",
  "Yoga"
];

export const APPOINTMENT_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELED: "canceled"
};

export const APPOINTMENT_STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-blue-100 text-blue-800",
  canceled: "bg-red-100 text-red-800"
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp"
];

export const USER_ROLES = {
  USER: "user",
  ADMIN: "admin"
};

export const DASHBOARD_TABS = [
  { 
    id: "overview", 
    label: "Overview",
    adminOnly: false
  },
  { 
    id: "appointments", 
    label: "Appointments",
    adminOnly: false
  },
  { 
    id: "blog", 
    label: "Blog Posts",
    adminOnly: true
  },
  { 
    id: "horoscopes", 
    label: "Horoscopes",
    adminOnly: true
  },
  { 
    id: "users", 
    label: "Users",
    adminOnly: true
  },
  { 
    id: "testimonials", 
    label: "Testimonials",
    adminOnly: true
  }
];
