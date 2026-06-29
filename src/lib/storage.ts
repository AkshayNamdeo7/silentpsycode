import { supabase } from "@/lib/supabase";

export async function uploadBookImage(file: File, destinationPath: string) {
  const { error } = await supabase.storage.from("book-images").upload(destinationPath, file, {
    cacheControl: "3600",
    upsert: false,
  });

  return { success: !error, error };
}

export async function deleteBookImage(storagePath: string) {
  const { error } = await supabase.storage.from("book-images").remove([storagePath]);
  return { success: !error, error };
}

export function getBookImageUrl(storagePath: string) {
  const { data } = supabase.storage.from("book-images").getPublicUrl(storagePath);
  return data.publicUrl;
}
