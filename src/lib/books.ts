import { isSupabaseClientConfigured, supabase } from "@/lib/supabase";
import { getCurrentAuthContext } from "@/lib/auth";

export interface BookForm {
  images: File[];
  title: string;
  author: string;
  sellerName: string;
  isbn: string;
  category: string;
  subject: string;
  condition: string;
  sellingPrice: string;
  originalPrice: string;
  description: string;
  college: string;
  branch: string;
  semester: string;
  city: string;
  sellerPhone: string;
  whatsappNumber: string;
  email: string;
  contactPreference: string;
  seller_name?: string | null;
  seller_phone?: string | null;
  whatsapp_number?: string | null;
  contact_email?: string | null;
  contact_preference?: string | null;
}

export interface BookRecord {
  id: string;
  seller_id?: string;
  title: string;
  author: string;
  selling_price: number;
  original_price: number | null;
  status: string;
  category: string;
  subject: string;
  created_at: string;
  seller_name?: string | null;
  seller_phone?: string | null;
  whatsapp_number?: string | null;
  contact_email?: string | null;
  contact_preference?: string | null;
}

export interface BookImageRecord {
  id: string;
  image_url: string;
  display_order: number;
}

export interface SellerProfile {
  full_name: string | null;
  phone?: string | null;
  college: string | null;
  city: string | null;
}

export interface BookWithImages extends BookRecord {
  seller_id?: string;
  condition?: string;
  description?: string | null;
  college?: string | null;
  city?: string | null;
  images?: BookImageRecord[];
  seller?: SellerProfile | null;
}

export interface BookFilters {
  search?: string;
  category?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  college?: string;
  city?: string;
  sort?: "newest" | "lowest" | "highest";
}

const DEMO_BOOKS_STORAGE_KEY = "silentpsy-demo-books";

function readDemoBooks(): Array<BookRecord & { seller_id: string }> {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(DEMO_BOOKS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Array<BookRecord & { seller_id: string }>) : [];
  } catch {
    return [];
  }
}

function writeDemoBooks(books: Array<BookRecord & { seller_id: string }>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DEMO_BOOKS_STORAGE_KEY, JSON.stringify(books));
}

const fallbackBooks: BookWithImages[] = [
  {
    id: "demo-physics",
    title: "Engineering Physics",
    author: "Dr. Ananya Rao",
    selling_price: 420,
    original_price: 650,
    status: "active",
    category: "Engineering",
    subject: "Physics",
    description: "A well-kept engineering physics handbook with solved problems and clear diagrams for semester prep.",
    college: "IIT Delhi",
    city: "Delhi",
    created_at: new Date("2025-06-22T10:00:00.000Z").toISOString(),
    seller_name: "Ananya Rao",
    seller_phone: "+91 9876543210",
    contact_email: "ananya@example.com",
    contact_preference: "WhatsApp",
    images: [{ id: "demo-physics-1", image_url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'%3E%3Crect width='800' height='1000' fill='%230f172a'/%3E%3Crect x='120' y='110' width='560' height='780' rx='32' fill='%231e293b'/%3E%3Ctext x='400' y='420' font-size='54' text-anchor='middle' fill='%23f8fafc' font-family='Arial'%3EEngineering%3C/text%3E%3Ctext x='400' y='500' font-size='54' text-anchor='middle' fill='%23f8fafc' font-family='Arial'%3EPhysics%3C/text%3E%3Ctext x='400' y='600' font-size='36' text-anchor='middle' fill='%2383c5ff' font-family='Arial'%3EDemo Listing%3C/text%3E%3C/svg%3E", display_order: 1 }],
  },
  {
    id: "demo-algebra",
    title: "Linear Algebra for Beginners",
    author: "Ravi Menon",
    selling_price: 310,
    original_price: 499,
    status: "active",
    category: "Math",
    subject: "Algebra",
    description: "Clean notes and practice sets that help students build confidence before exams.",
    college: "IIT Madras",
    city: "Chennai",
    created_at: new Date("2025-06-24T12:00:00.000Z").toISOString(),
    seller_name: "Ravi Menon",
    seller_phone: "+91 9123456789",
    contact_email: "ravi@example.com",
    contact_preference: "Phone",
    images: [{ id: "demo-algebra-1", image_url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'%3E%3Crect width='800' height='1000' fill='%230f172a'/%3E%3Crect x='120' y='110' width='560' height='780' rx='32' fill='%231e293b'/%3E%3Ctext x='400' y='420' font-size='54' text-anchor='middle' fill='%23f8fafc' font-family='Arial'%3ELinear%3C/text%3E%3Ctext x='400' y='500' font-size='54' text-anchor='middle' fill='%23f8fafc' font-family='Arial'%3EAlgebra%3C/text%3E%3Ctext x='400' y='600' font-size='36' text-anchor='middle' fill='%2383c5ff' font-family='Arial'%3EDemo Listing%3C/text%3E%3C/svg%3E", display_order: 1 }],
  },
  {
    id: "demo-chem",
    title: "Organic Chemistry Concepts",
    author: "Megha Patel",
    selling_price: 360,
    original_price: 580,
    status: "active",
    category: "Medical",
    subject: "Chemistry",
    description: "A concise study companion with exam-focused chapter summaries and reaction maps.",
    college: "AIIMS Delhi",
    city: "Delhi",
    created_at: new Date("2025-06-26T08:30:00.000Z").toISOString(),
    seller_name: "Megha Patel",
    seller_phone: "+91 9988776655",
    contact_email: "megha@example.com",
    contact_preference: "Email",
    images: [{ id: "demo-chem-1", image_url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'%3E%3Crect width='800' height='1000' fill='%230f172a'/%3E%3Crect x='120' y='110' width='560' height='780' rx='32' fill='%231e293b'/%3E%3Ctext x='400' y='420' font-size='54' text-anchor='middle' fill='%23f8fafc' font-family='Arial'%3EOrganic%3C/text%3E%3Ctext x='400' y='500' font-size='54' text-anchor='middle' fill='%23f8fafc' font-family='Arial'%3EChemistry%3C/text%3E%3Ctext x='400' y='600' font-size='36' text-anchor='middle' fill='%2383c5ff' font-family='Arial'%3EDemo Listing%3C/text%3E%3C/svg%3E", display_order: 1 }],
  },
];

function buildBookDescription(form: BookForm) {
  const details = [
    form.description?.trim(),
    form.subject ? `Subject: ${form.subject.trim()}` : undefined,
    form.college ? `College: ${form.college.trim()}` : undefined,
    form.branch ? `Branch: ${form.branch.trim()}` : undefined,
    form.semester ? `Semester: ${form.semester.trim()}` : undefined,
    form.city ? `City: ${form.city.trim()}` : undefined,
    form.sellerName ? `Seller: ${form.sellerName}` : undefined,
    form.sellerPhone ? `Phone: ${form.sellerPhone}` : undefined,
    form.email ? `Email: ${form.email}` : undefined,
    form.contactPreference ? `Contact preference: ${form.contactPreference}` : undefined,
  ].filter((detail): detail is string => Boolean(detail));

  return details.join("\n\n");
}

export async function publishBook(form: BookForm) {
  const authContext = await getCurrentAuthContext();
  const userId = authContext.userId;
  if (!userId) {
    return { success: false, message: "Please sign in before publishing a book." };
  }

  if (authContext.isDemo) {
    const demoBooks = readDemoBooks();
    const demoBook = {
      id: crypto.randomUUID(),
      seller_id: userId,
      title: form.title.trim(),
      author: form.author.trim(),
      isbn: form.isbn?.trim() || null,
      category: form.category,
      subject: form.subject.trim(),
      condition: form.condition,
      selling_price: Number(form.sellingPrice) || 0,
      original_price: form.originalPrice ? Number(form.originalPrice) : null,
      description: buildBookDescription(form),
      seller_name: form.sellerName.trim() || null,
      seller_phone: form.sellerPhone.trim() || null,
      whatsapp_number: form.whatsappNumber.trim() || null,
      contact_email: form.email.trim() || null,
      contact_preference: form.contactPreference.trim() || null,
      college: form.college.trim(),
      branch: form.branch.trim(),
      semester: form.semester.trim(),
      city: form.city.trim(),
      status: "active",
      created_at: new Date().toISOString(),
    } as BookRecord & { seller_id: string };

    writeDemoBooks([demoBook, ...demoBooks]);
    return { success: true, message: "Book published successfully." };
  }

  if (!isSupabaseClientConfigured) {
    return {
      success: false,
      message: "Supabase is not configured yet. Add your environment variables first.",
    };
  }

  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  if (sessionError) {
    return { success: false, message: sessionError.message };
  }

  const bookPayload = {
    seller_id: userId,
    title: form.title.trim(),
    author: form.author.trim(),
    isbn: form.isbn?.trim() || null,
    category: form.category,
    subject: form.subject.trim(),
    condition: form.condition,
    selling_price: Number(form.sellingPrice) || 0,
    original_price: form.originalPrice ? Number(form.originalPrice) : null,
    description: buildBookDescription(form),
    seller_name: form.sellerName.trim() || null,
    seller_phone: form.sellerPhone.trim() || null,
    whatsapp_number: form.whatsappNumber.trim() || null,
    contact_email: form.email.trim() || null,
    contact_preference: form.contactPreference.trim() || null,
    college: form.college.trim(),
    branch: form.branch.trim(),
    semester: form.semester.trim(),
    city: form.city.trim(),
    status: "active",
  };

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    full_name: form.sellerName.trim() || "Student Seller",
    phone: form.sellerPhone.trim() || null,
    college: form.college.trim() || null,
    city: form.city.trim() || null,
  });

  if (profileError) {
    return { success: false, message: profileError.message ?? "Failed to update seller profile." };
  }
  const { data: bookData, error: bookError } = await supabase
    .from("books")
    .insert(bookPayload)
    .select("id")
    .single();

  if (bookError || !bookData?.id) {
    return { success: false, message: bookError?.message ?? "Failed to create book." };
  }

  const bookId = bookData.id;

  try {
    const imageUploads = await Promise.all(
      form.images.map(async (file, index) => {
        const safeFileName = `${crypto.randomUUID()}-${file.name}`;
        const path = `books/${userId}/${bookId}/${safeFileName}`;

        const { error: uploadError } = await supabase.storage
          .from("book-images")
          .upload(path, file, { cacheControl: "3600", upsert: false });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage.from("book-images").getPublicUrl(path);

        return {
          book_id: bookId,
          image_url: publicUrlData.publicUrl,
          display_order: index + 1,
        };
      })
    );

    const { error: imagesInsertError } = await supabase.from("book_images").insert(imageUploads);
    if (imagesInsertError) {
      return { success: false, message: imagesInsertError.message };
    }

    return { success: true, message: "Book published successfully." };
  } catch (error) {
    return { success: false, message: (error as Error).message ?? "Failed to upload images." };
  }
}

export async function getMyBooks() {
  const authContext = await getCurrentAuthContext();
  const userId = authContext.userId;

  if (!userId) {
    return { books: [] as BookRecord[], counts: { total: 0, active: 0, drafts: 0, sold: 0 } };
  }

  if (authContext.isDemo) {
    const demoBooks = readDemoBooks()
      .filter((book) => book.seller_id === userId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const counts = {
      total: demoBooks.length,
      drafts: demoBooks.filter((book) => book.status === "draft").length,
      sold: demoBooks.filter((book) => book.status === "sold").length,
      active: demoBooks.filter((book) => book.status === "active").length,
    };

    return { books: demoBooks, counts };
  }

  if (!isSupabaseClientConfigured) {
    return { books: [] as BookRecord[], counts: { total: 0, active: 0, drafts: 0, sold: 0 } };
  }

  const { data, error } = await supabase
    .from("books")
    .select("id,title,author,selling_price,original_price,status,category,subject,created_at")
    .eq("seller_id", userId)
    .order("created_at", { ascending: false });

  const books = (data ?? []) as BookRecord[];
  const counts = {
    total: books.length,
    drafts: books.filter((book) => book.status === "draft").length,
    sold: books.filter((book) => book.status === "sold").length,
    active: books.filter((book) => book.status === "active").length,
  };

  return { books, counts, error };
}

function applyFallbackFilters(books: BookWithImages[], filters: BookFilters) {
  const search = filters.search?.trim().toLowerCase();
  const filtered = books.filter((book) => {
    const matchesSearch = !search || [book.title, book.author, book.category, book.subject].some((field) => field?.toLowerCase().includes(search));
    const matchesCategory = !filters.category || book.category === filters.category;
    const matchesCondition = !filters.condition || book.condition === filters.condition;
    const matchesCollege = !filters.college || book.college?.toLowerCase().includes(filters.college.toLowerCase());
    const matchesCity = !filters.city || book.city?.toLowerCase().includes(filters.city.toLowerCase());
    const matchesMinPrice = filters.minPrice === undefined || book.selling_price >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice === undefined || book.selling_price <= filters.maxPrice;

    return matchesSearch && matchesCategory && matchesCondition && matchesCollege && matchesCity && matchesMinPrice && matchesMaxPrice;
  });

  return filtered.sort((a, b) => {
    if (filters.sort === "lowest") {
      return a.selling_price - b.selling_price;
    }

    if (filters.sort === "highest") {
      return b.selling_price - a.selling_price;
    }

    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });
}

export async function fetchBooks(filters: BookFilters = {}) {
  if (!isSupabaseClientConfigured) {
    return { books: applyFallbackFilters(fallbackBooks, filters), error: null };
  }

  let query = supabase
    .from("books")
    .select(
      `id,title,author,selling_price,original_price,condition,category,subject,description,college,city,created_at,seller_id,images:book_images(image_url,display_order),seller:profiles(full_name,phone,college,city)`
    )
    .eq("status", "active");

  if (filters.search) {
    const search = filters.search.trim();
    query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%,category.ilike.%${search}%`);
  }

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  if (filters.condition) {
    query = query.eq("condition", filters.condition);
  }

  if (filters.college) {
    query = query.ilike("college", `%${filters.college}%`);
  }

  if (filters.city) {
    query = query.ilike("city", `%${filters.city}%`);
  }

  if (filters.minPrice !== undefined) {
    query = query.gte("selling_price", filters.minPrice);
  }

  if (filters.maxPrice !== undefined) {
    query = query.lte("selling_price", filters.maxPrice);
  }

  if (filters.sort === "lowest") {
    query = query.order("selling_price", { ascending: true });
  } else if (filters.sort === "highest") {
    query = query.order("selling_price", { ascending: false });
  } else {
    query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  const books = ((data ?? []) as unknown) as BookWithImages[];

  if (error) {
    return { books: applyFallbackFilters(fallbackBooks, filters), error };
  }

  if (!books.length) {
    return { books: applyFallbackFilters(fallbackBooks, filters), error: null };
  }

  return { books, error };
}

export async function fetchBookById(bookId: string) {
  if (!isSupabaseClientConfigured) {
    return { book: null as BookWithImages | null, error: null };
  }

  const { data, error } = await supabase
    .from("books")
    .select(
      `id,title,author,selling_price,original_price,condition,category,subject,description,college,city,created_at,status,seller_id,images:book_images(image_url,display_order),seller:profiles(full_name,phone,college,city)`
    )
    .eq("id", bookId)
    .single();

  if (error) {
    const fallbackBook = fallbackBooks.find((book) => book.id === bookId);
    return { book: fallbackBook ?? null, error: null };
  }

  return { book: (data as unknown) as BookWithImages | null, error };
}
