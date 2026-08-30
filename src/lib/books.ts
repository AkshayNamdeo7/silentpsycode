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
  city: string;
  sellerPhone: string;
  whatsappNumber: string;
  email: string;
  contactPreference: string;
}

export interface BookRecord {
  id: string;
  seller_id?: string;
  title: string;
  author: string;
  isbn?: string | null;
  selling_price: number;
  original_price: number | null;
  status: string;
  category: string;
  subject: string;
  condition?: string;
  description?: string | null;
  college?: string | null;
  branch?: string | null;
  semester?: string | null;
  city?: string | null;
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
  images?: BookImageRecord[];
  seller?: SellerProfile | null;
}

export interface BookFilters {
  search?: string;
  category?: string;
  subject?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  college?: string;
  city?: string;
  sort?: "newest" | "lowest" | "highest";
}

function buildBookDescription(form: BookForm) {
  const details = [
    form.description?.trim(),
    form.subject ? `Subject: ${form.subject.trim()}` : undefined,
    form.city ? `City: ${form.city.trim()}` : undefined,
  ].filter((detail): detail is string => Boolean(detail));

  return details.join("\n\n");
}

export async function publishBook(form: BookForm) {
  const authContext = await getCurrentAuthContext();
  const userId = authContext.userId;
  if (!userId) {
    return { success: false, message: "Please sign in before publishing a book." };
  }

  if (!isSupabaseClientConfigured) {
    return {
      success: false,
      message: "Supabase is not configured yet. Add your environment variables first.",
    };
  }

  const { error: sessionError } = await supabase.auth.getSession();

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
    city: form.city.trim(),
    status: "active",
  };

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: userId,
    full_name: form.sellerName.trim() || "Student Seller",
    phone: form.sellerPhone.trim() || null,
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

  const uploadedPaths: string[] = [];
  const imageUploads: Array<{ book_id: string; image_url: string; display_order: number }> = [];

  for (let i = 0; i < form.images.length; i++) {
    const file = form.images[i];
    const safeFileName = `${crypto.randomUUID()}-${file.name}`;
    const path = `books/${userId}/${bookId}/${safeFileName}`;

    const { error: uploadError } = await supabase.storage
      .from("book-images")
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (uploadError) {
      for (const p of uploadedPaths) {
        await supabase.storage.from("book-images").remove([p]).catch(() => {});
      }
      return { success: false, message: uploadError.message };
    }

    uploadedPaths.push(path);

    const { data: publicUrlData } = supabase.storage.from("book-images").getPublicUrl(path);
    imageUploads.push({
      book_id: bookId,
      image_url: publicUrlData.publicUrl,
      display_order: i + 1,
    });
  }

  const { error: imagesInsertError } = await supabase.from("book_images").insert(imageUploads);
  if (imagesInsertError) {
    for (const p of uploadedPaths) {
      await supabase.storage.from("book-images").remove([p]).catch(() => {});
    }
    return { success: false, message: imagesInsertError.message };
  }

  return { success: true, message: "Book published successfully." };
}

export async function updateBook(bookId: string, form: BookForm) {
  const authContext = await getCurrentAuthContext();
  const userId = authContext.userId;
  if (!userId) {
    return { success: false, message: "Please sign in." };
  }

  if (!isSupabaseClientConfigured) {
    return { success: false, message: "Supabase is not configured." };
  }

  const bookPayload = {
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
    city: form.city.trim(),
  };

  const { error } = await supabase.from("books").update(bookPayload).eq("id", bookId).eq("seller_id", userId);
  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Book updated." };
}

export async function deleteBook(bookId: string) {
  const authContext = await getCurrentAuthContext();
  const userId = authContext.userId;
  if (!userId) {
    return { success: false, message: "Please sign in." };
  }

  if (!isSupabaseClientConfigured) {
    return { success: false, message: "Supabase is not configured." };
  }

  const { data: images } = await supabase
    .from("book_images")
    .select("id,image_url")
    .eq("book_id", bookId);

  if (images && images.length > 0) {
    for (const img of images) {
      try {
        const url = new URL(img.image_url);
        const path = url.pathname.split("/storage/v1/object/public/book-images/")[1];
        if (path) await supabase.storage.from("book-images").remove([decodeURIComponent(path)]).catch(() => {});
      } catch { /* ignore */ }
    }
    await supabase.from("book_images").delete().eq("book_id", bookId);
  }

  const { error } = await supabase.from("books").delete().eq("id", bookId).eq("seller_id", userId);
  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: "Book deleted." };
}

export async function getMyBooks() {
  const authContext = await getCurrentAuthContext();
  const userId = authContext.userId;

  if (!userId) {
    return { books: [] as BookRecord[], counts: { total: 0, active: 0, drafts: 0, sold: 0 } };
  }

  if (!isSupabaseClientConfigured) {
    return { books: [] as BookRecord[], counts: { total: 0, active: 0, drafts: 0, sold: 0 } };
  }

  const { data, error } = await supabase
    .from("books")
    .select("id,title,author,isbn,selling_price,original_price,status,category,subject,created_at")
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

function applyFilters(books: BookWithImages[], filters: BookFilters) {
  const search = filters.search?.trim().toLowerCase();
  const filtered = books.filter((book) => {
    const matchesSearch = !search || [book.title, book.author, book.category, book.subject].some((field) => field?.toLowerCase().includes(search));
    const matchesCategory = !filters.category || book.category === filters.category;
    const matchesSubject = !filters.subject || book.subject === filters.subject;
    const matchesCondition = !filters.condition || book.condition === filters.condition;
    const matchesCollege = !filters.college || book.college?.toLowerCase().includes(filters.college.toLowerCase());
    const matchesCity = !filters.city || book.city?.toLowerCase().includes(filters.city.toLowerCase());
    const matchesMinPrice = filters.minPrice === undefined || book.selling_price >= filters.minPrice;
    const matchesMaxPrice = filters.maxPrice === undefined || book.selling_price <= filters.maxPrice;

    return matchesSearch && matchesCategory && matchesSubject && matchesCondition && matchesCollege && matchesCity && matchesMinPrice && matchesMaxPrice;
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
    return { books: [] as BookWithImages[], error: null };
  }

  let query = supabase
    .from("books")
    .select(
      `id,title,author,isbn,selling_price,original_price,condition,category,subject,description,college,city,created_at,seller_id,images:book_images(image_url,display_order),seller:profiles(full_name,phone,college,city)`
    )
    .eq("status", "active");

  if (filters.search) {
    const sanitized = filters.search.trim().replace(/[%_]/g, (ch) => `\\${ch}`);
    query = query.or(`title.ilike.%${sanitized}%,author.ilike.%${sanitized}%,category.ilike.%${sanitized}%,subject.ilike.%${sanitized}%`);
  }

  if (filters.category) {
    query = query.eq("category", filters.category);
  }

  if (filters.subject) {
    query = query.eq("subject", filters.subject);
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
    return { books: [] as BookWithImages[], error };
  }

  return { books, error };
}

export async function fetchBookById(bookId: string) {
  if (!isSupabaseClientConfigured) {
    return { book: null, error: null };
  }

  const { data, error } = await supabase
    .from("books")
    .select(`
      *,
      images:book_images(*),
      seller:profiles(*)
    `)
    .eq("id", bookId)
    .single();

  if (error) {
    return { book: null, error };
  }

  return { book: data as BookWithImages, error: null };
}
