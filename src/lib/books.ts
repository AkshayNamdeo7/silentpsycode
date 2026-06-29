import { isSupabaseClientConfigured, supabase } from "@/lib/supabase";

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
}

export interface BookRecord {
  id: string;
  title: string;
  author: string;
  selling_price: number;
  original_price: number | null;
  status: string;
  category: string;
  subject: string;
  created_at: string;
  is_draft?: boolean;
}

function buildBookDescription(form: BookForm) {
  const details = [
    form.description?.trim(),
    form.sellerName ? `Seller: ${form.sellerName}` : undefined,
    form.sellerPhone ? `Phone: ${form.sellerPhone}` : undefined,
    form.email ? `Email: ${form.email}` : undefined,
    form.contactPreference ? `Contact preference: ${form.contactPreference}` : undefined,
  ].filter(Boolean);

  return details.join("\n\n");
}

export async function publishBook(form: BookForm) {
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

  const userId = session?.user?.id;
  if (!userId) {
    return { success: false, message: "Please sign in before publishing a book." };
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
    college: form.college.trim(),
    branch: form.branch.trim(),
    semester: form.semester.trim(),
    city: form.city.trim(),
    status: "active",
  };

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
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  if (!userId) {
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
