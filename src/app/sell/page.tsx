"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles } from "lucide-react";
import Button from "@/components/ui/button";
import Dropzone from "@/components/ui/dropzone";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import { publishBook, updateBook, fetchBookById, type BookImageRecord } from "@/lib/books";
import { supabase } from "@/lib/supabase";
import { getCurrentAuthContext } from "@/lib/auth";

const categories = [
  "Engineering",
  "Medical",
  "UPSC",
  "JEE",
  "NEET",
  "School",
  "Novels",
];

const conditions = ["New", "Like New", "Good", "Fair"];
const contactPreferences = ["Email", "WhatsApp", "Phone", "In-app Chat"];

const initialState = {
  images: [] as File[],
  title: "",
  author: "",
  sellerName: "",
  isbn: "",
  category: "Engineering",
  subject: "",
  condition: "Good",
  sellingPrice: "",
  originalPrice: "",
  description: "",
  college: "",
  branch: "",
  semester: "",
  city: "",
  sellerPhone: "",
  whatsappNumber: "",
  email: "",
  contactPreference: "Email",
};

function SellPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams?.get("id") ?? null;

  useEffect(() => {
    document.title = "Sell a Book | Silent Psycode";
  }, []);
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [existingImages, setExistingImages] = useState<BookImageRecord[]>([]);
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

  useEffect(() => {
    if (!editId) return;
    fetchBookById(editId).then((res) => {
      if (res.book) {
        const b = res.book;
        setForm({
          images: [],
          title: b.title,
          author: b.author,
          sellerName: b.seller_name ?? "",
          isbn: b.isbn ?? "",
          category: b.category,
          subject: b.subject,
          condition: b.condition ?? "Good",
          sellingPrice: b.selling_price.toString(),
          originalPrice: b.original_price?.toString() ?? "",
          description: b.description ?? "",
          college: b.college ?? "",
          branch: b.branch ?? "",
          semester: b.semester ?? "",
          city: b.city ?? "",
          sellerPhone: b.seller_phone ?? "",
          whatsappNumber: b.whatsapp_number ?? "",
          email: b.contact_email ?? "",
          contactPreference: b.contact_preference ?? "Email",
        });
        const images = (b.images ?? []).slice().sort((a, b) => a.display_order - b.display_order);
        setExistingImages(images);
      }
    });
  }, [editId]);

  const previewImage = useMemo(
    () => (form.images[0] ? URL.createObjectURL(form.images[0]) : undefined),
    [form.images[0]]
  );

  useEffect(() => {
    return () => {
      if (previewImage) URL.revokeObjectURL(previewImage);
    };
  }, [previewImage]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const removeExistingImage = (imageId: string) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    setRemovedImageIds((prev) => [...prev, imageId]);
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!editId && form.images.length === 0) nextErrors.images = "Add at least one book image.";
    if (editId && existingImages.length === 0 && form.images.length === 0) nextErrors.images = "Add at least one book image.";
    if (!form.title.trim()) nextErrors.title = "Enter a book title.";
    if (!form.author.trim()) nextErrors.author = "Enter the author name.";
    if (!form.sellerName.trim()) nextErrors.sellerName = "Enter your name.";
    if (!form.category) nextErrors.category = "Choose a category.";
    if (!form.subject.trim()) nextErrors.subject = "Specify the subject or course.";
    if (!form.condition) nextErrors.condition = "Select the book condition.";
    if (!form.sellingPrice.trim()) nextErrors.sellingPrice = "Enter the selling price.";
    else if (isNaN(Number(form.sellingPrice)) || Number(form.sellingPrice) <= 0) nextErrors.sellingPrice = "Enter a valid price.";
    if (!form.college.trim()) nextErrors.college = "Enter your college.";
    if (!form.branch.trim()) nextErrors.branch = "Enter your course or branch.";
    if (!form.semester.trim()) nextErrors.semester = "Enter the semester.";
    if (!form.city.trim()) nextErrors.city = "Enter your city.";
    if (!form.sellerPhone.trim()) nextErrors.sellerPhone = "Enter your phone number.";
    if (!form.whatsappNumber.trim()) nextErrors.whatsappNumber = "Enter your WhatsApp number.";
    if (!form.email.trim()) {
      nextErrors.email = "Enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!form.contactPreference) nextErrors.contactPreference = "Select how buyers can contact you.";

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);
    setStatusMessage(null);
    setPublishSuccess(false);

    if (Object.keys(nextErrors).length === 0) {
      setIsPublishing(true);
      try {
        const result = editId ? await updateBook(editId, form) : await publishBook(form);
        setStatusMessage(result.message);
        setPublishSuccess(result.success);

        if (result.success && editId) {
          for (const imgId of removedImageIds) {
            const img = (await supabase.from("book_images").select("image_url").eq("id", imgId).single()).data;
            if (img?.image_url) {
              try {
                const url = new URL(img.image_url);
                const path = url.pathname.split("/storage/v1/object/public/book-images/")[1];
                if (path) await supabase.storage.from("book-images").remove([path]).catch(() => {});
              } catch { /* ignore */ }
            }
            await supabase.from("book_images").delete().eq("id", imgId);
          }

          if (form.images.length > 0) {
            const authContext = await getCurrentAuthContext();
            const userId = authContext.userId;
            if (userId) {
              for (let i = 0; i < form.images.length; i++) {
                const file = form.images[i];
                const safeFileName = `${crypto.randomUUID()}-${file.name}`;
                const path = `books/${userId}/${editId}/${safeFileName}`;
                const { error: uploadError } = await supabase.storage
                  .from("book-images")
                  .upload(path, file, { cacheControl: "3600", upsert: false });
                if (!uploadError) {
                  const { data: publicUrlData } = supabase.storage.from("book-images").getPublicUrl(path);
                  await supabase.from("book_images").insert({
                    book_id: editId,
                    image_url: publicUrlData.publicUrl,
                    display_order: existingImages.length + i + 1,
                  });
                }
              }
            }
          }
        }

        if (result.success) {
          router.push("/dashboard");
        }
      } catch {
        setStatusMessage("An unexpected error occurred.");
        setPublishSuccess(false);
      }
      setIsPublishing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-10 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mx-auto max-w-7xl"
      >
        <div className="rounded-[2.5rem] border border-white/10 bg-slate-950/95 p-6 shadow-[0_60px_160px_-90px_rgba(15,23,42,0.94)] sm:p-12">
          <div className="grid gap-6 lg:grid-cols-[1.55fr_0.95fr] lg:items-start">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-sky-300/80">
                  <ShieldCheck className="h-4 w-4 text-sky-300" />
                  Sell a Book
                </p>
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl text-balance">
                  {editId ? "Update your listing." : "List your second-hand book in minutes."}
                </h1>
                <p className="max-w-3xl text-base leading-8 text-slate-400 sm:text-lg">
                  {editId
                    ? "Edit your listing details, update images, and adjust pricing."
                    : "Upload photos, set a student-friendly price, and reach buyers across campus and beyond with a premium listing experience."}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-200">Book images</label>
                  {existingImages.length > 0 && (
                    <div className="mb-4 grid gap-3 sm:grid-cols-3">
                      {existingImages.map((img) => (
                        <div key={img.id} className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/90">
                          <img src={img.image_url} alt={`Existing image ${img.display_order}`} className="h-32 w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(img.id)}
                            className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-950/80 text-white transition hover:bg-rose-500/90"
                          >
                            <span className="sr-only">Remove image</span>
                            <span className="text-base">×</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <Dropzone
                    files={form.images}
                    onFilesChange={(files) => setForm((prev) => ({ ...prev, images: files }))}
                    error={errors.images}
                  />
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="title">
                      Book title
                    </label>
                    <Input
                      id="title"
                      value={form.title}
                      onChange={(event) => handleChange("title", event.target.value)}
                      placeholder="Enter the book title"
                    />
                    {errors.title ? <p className="mt-2 text-sm text-rose-400">{errors.title}</p> : null}
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="author">
                      Author
                    </label>
                    <Input
                      id="author"
                      value={form.author}
                      onChange={(event) => handleChange("author", event.target.value)}
                      placeholder="Enter author name"
                    />
                    {errors.author ? <p className="mt-2 text-sm text-rose-400">{errors.author}</p> : null}
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="isbn">
                      ISBN (optional)
                    </label>
                    <Input
                      id="isbn"
                      value={form.isbn}
                      onChange={(event) => handleChange("isbn", event.target.value)}
                      placeholder="e.g. 978-0143127550"
                    />
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="category">
                      Category
                    </label>
                    <Select
                      id="category"
                      value={form.category}
                      onChange={(event) => handleChange("category", event.target.value)}
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Select>
                    {errors.category ? <p className="mt-2 text-sm text-rose-400">{errors.category}</p> : null}
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="subject">
                      Subject
                    </label>
                    <Input
                      id="subject"
                      value={form.subject}
                      onChange={(event) => handleChange("subject", event.target.value)}
                      placeholder="e.g. Thermodynamics"
                    />
                    {errors.subject ? <p className="mt-2 text-sm text-rose-400">{errors.subject}</p> : null}
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="condition">
                      Condition
                    </label>
                    <Select
                      id="condition"
                      value={form.condition}
                      onChange={(event) => handleChange("condition", event.target.value)}
                    >
                      {conditions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                    {errors.condition ? <p className="mt-2 text-sm text-rose-400">{errors.condition}</p> : null}
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="sellingPrice">
                      Selling price
                    </label>
                    <Input
                      id="sellingPrice"
                      value={form.sellingPrice}
                      onChange={(event) => handleChange("sellingPrice", event.target.value)}
                      placeholder="₹ price you want to sell for"
                    />
                    {errors.sellingPrice ? <p className="mt-2 text-sm text-rose-400">{errors.sellingPrice}</p> : null}
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="originalPrice">
                      Original price (optional)
                    </label>
                    <Input
                      id="originalPrice"
                      value={form.originalPrice}
                      onChange={(event) => handleChange("originalPrice", event.target.value)}
                      placeholder="₹ original price"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="description">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(event) => handleChange("description", event.target.value)}
                    placeholder="Describe the condition, edition, and any extra details."
                  />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="college">
                      College
                    </label>
                    <Input
                      id="college"
                      value={form.college}
                      onChange={(event) => handleChange("college", event.target.value)}
                      placeholder="Your college"
                    />
                    {errors.college ? <p className="mt-2 text-sm text-rose-400">{errors.college}</p> : null}
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="branch">
                      Course / Branch
                    </label>
                    <Input
                      id="branch"
                      value={form.branch}
                      onChange={(event) => handleChange("branch", event.target.value)}
                      placeholder="e.g. Computer Science"
                    />
                    {errors.branch ? <p className="mt-2 text-sm text-rose-400">{errors.branch}</p> : null}
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="semester">
                      Semester
                    </label>
                    <Input
                      id="semester"
                      value={form.semester}
                      onChange={(event) => handleChange("semester", event.target.value)}
                      placeholder="e.g. 5th semester"
                    />
                    {errors.semester ? <p className="mt-2 text-sm text-rose-400">{errors.semester}</p> : null}
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="city">
                      City
                    </label>
                    <Input
                      id="city"
                      value={form.city}
                      onChange={(event) => handleChange("city", event.target.value)}
                      placeholder="City where book is available"
                    />
                    {errors.city ? <p className="mt-2 text-sm text-rose-400">{errors.city}</p> : null}
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="sellerName">
                      Seller name
                    </label>
                    <Input
                      id="sellerName"
                      value={form.sellerName}
                      onChange={(event) => handleChange("sellerName", event.target.value)}
                      placeholder="Your full name"
                    />
                    {errors.sellerName ? <p className="mt-2 text-sm text-rose-400">{errors.sellerName}</p> : null}
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="sellerPhone">
                      Seller phone
                    </label>
                    <Input
                      id="sellerPhone"
                      type="tel"
                      value={form.sellerPhone}
                      onChange={(event) => handleChange("sellerPhone", event.target.value)}
                      placeholder="Enter phone number"
                    />
                    {errors.sellerPhone ? <p className="mt-2 text-sm text-rose-400">{errors.sellerPhone}</p> : null}
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="whatsappNumber">
                      WhatsApp number
                    </label>
                    <Input
                      id="whatsappNumber"
                      type="tel"
                      value={form.whatsappNumber}
                      onChange={(event) => handleChange("whatsappNumber", event.target.value)}
                      placeholder="Enter WhatsApp number"
                    />
                    {errors.whatsappNumber ? <p className="mt-2 text-sm text-rose-400">{errors.whatsappNumber}</p> : null}
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-slate-200" htmlFor="email">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(event) => handleChange("email", event.target.value)}
                      placeholder="you@example.com"
                    />
                    {errors.email ? <p className="mt-2 text-sm text-rose-400">{errors.email}</p> : null}
                  </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                  <div>
                    <p className="mb-3 block text-sm font-medium text-slate-200">Contact preference</p>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {contactPreferences.map((option) => (
                        <label
                          key={option}
                          className={`flex cursor-pointer items-center gap-3 rounded-3xl border px-4 py-3 text-sm transition ${
                            form.contactPreference === option
                              ? "border-sky-400 bg-sky-500/10 text-white"
                              : "border-white/10 bg-slate-950/80 text-slate-300 hover:border-slate-400"
                          }`}
                        >
                          <input
                            type="radio"
                            name="contactPreference"
                            value={option}
                            checked={form.contactPreference === option}
                            onChange={(event) => handleChange("contactPreference", event.target.value)}
                            className="hidden"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                    {errors.contactPreference ? <p className="mt-2 text-sm text-rose-400">{errors.contactPreference}</p> : null}
                  </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      {editId ? "Review your changes before updating the listing." : "Ready to publish? Review the preview before posting your listing."}
                    </p>
                  </div>
                  <Button type="submit" disabled={isPublishing} className="w-full sm:w-auto px-8 py-4">
                    {isPublishing ? (editId ? "Updating..." : "Publishing...") : (editId ? "Update Book" : "Publish Book")}
                  </Button>
                </div>

                {statusMessage ? (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-[1.75rem] border px-5 py-5 text-sm ${publishSuccess ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-200" : "border-rose-500/25 bg-rose-500/10 text-rose-200"}`}
                  >
                    {statusMessage}
                  </motion.div>
                ) : null}
              </form>
            </div>

            <aside className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.7)]"
              >
                <div className="overflow-hidden rounded-[1.75rem] bg-slate-900/95">
                  {previewImage ? (
                    <img src={previewImage} alt="Primary preview" className="h-64 w-full object-cover" />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-slate-900/80 text-slate-500">
                      No preview image selected
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Listing preview</p>
                    <h2 className="text-2xl font-semibold text-white">{form.title || "Your book title"}</h2>
                    <p className="text-sm text-slate-400">{form.author ? `by ${form.author}` : "Author name"}</p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[1.75rem] bg-slate-900/90 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Category</p>
                      <p className="mt-2 text-sm font-semibold text-white">{form.category}</p>
                    </div>
                    <div className="rounded-[1.75rem] bg-slate-900/90 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Condition</p>
                      <p className="mt-2 text-sm font-semibold text-white">{form.condition}</p>
                    </div>
                    <div className="rounded-[1.75rem] bg-slate-900/90 p-4">
                      <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Price</p>
                      <p className="mt-2 text-sm font-semibold text-white">
                        {form.sellingPrice ? `₹${form.sellingPrice}` : "₹0"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-[1.75rem] bg-slate-900/90 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Location</p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {form.college || "College"}, {form.city || "City"}
                    </p>
                  </div>

                  <div className="rounded-[1.75rem] bg-slate-900/90 p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Subject</p>
                    <p className="mt-2 text-sm font-semibold text-white">{form.subject || "Subject"}</p>
                  </div>
                </div>

                <div className="rounded-[1.75rem] bg-slate-900/90 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Seller</p>
                  <p className="mt-2 text-sm font-semibold text-white">{form.sellerName || "Seller name"}</p>
                </div>

                <div className="rounded-[1.75rem] bg-slate-900/90 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Contact</p>
                  <p className="mt-2 text-sm font-semibold text-white">{form.contactPreference}</p>
                  <p className="mt-2 text-sm text-slate-400">{form.email || "Email"}</p>
                  <p className="mt-1 text-sm text-slate-400">{form.sellerPhone || "Phone"}</p>
                  <p className="mt-1 text-sm text-slate-400">{form.whatsappNumber || "WhatsApp"}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.08, ease: "easeOut" }}
                className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.7)]"
              >
                <div className="flex items-center gap-3 text-slate-300">
                  <Sparkles className="h-5 w-5 text-sky-300" />
                  <p className="text-sm font-semibold text-white">Why sell here?</p>
                </div>
                <ul className="mt-4 space-y-3 text-sm leading-7 text-slate-400">
                  <li>• Reach buyers across student communities.</li>
                  <li>• List with transparent pricing and clear condition tags.</li>
                  <li>• Keep your experience premium and easy.</li>
                </ul>
              </motion.div>
            </aside>
          </div>
        </div>
      </motion.div>
    </main>
  );
}

export default function SellPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#050816] flex items-center justify-center"><p className="text-slate-400 text-sm">Loading...</p></main>}>
      <SellPageContent />
    </Suspense>
  );
}
