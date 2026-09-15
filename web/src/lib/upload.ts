import { put } from "@vercel/blob";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const OK = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);
const MAX = 8 * 1024 * 1024;
const WIDTH: Record<string, number> = { shot: 1440, logo: 512, avatar: 512 };

/* Blob in production. In development without a token, files land in public/uploads so the
   whole upload flow can be exercised locally; that folder is git-ignored. */
const local = () => !process.env.BLOB_READ_WRITE_TOKEN && process.env.NODE_ENV === "development";
export const uploadsEnabled = () => !!process.env.BLOB_READ_WRITE_TOKEN || local();

async function store(key: string, body: Buffer | File, contentType: string) {
  if (local()) {
    const rel = `uploads/${key}`;
    const abs = join(process.cwd(), "public", rel);
    await mkdir(join(abs, ".."), { recursive: true });
    await writeFile(abs, body instanceof File ? Buffer.from(await body.arrayBuffer()) : body);
    return `/${rel}`;
  }
  const blob = await put(key, body, { access: "public", addRandomSuffix: false, contentType });
  return blob.url;
}

/** Stores one image and returns its public URL. Throws a Korean message on failure.
    Images are resized to the folder's width cap and re-encoded as webp (gifs are kept as they are). */
export async function uploadImage(file: File, folder: string) {
  if (!uploadsEnabled()) throw new Error("이미지 저장소가 아직 연결되지 않았어요. BLOB_READ_WRITE_TOKEN을 설정하세요.");
  if (!OK.has(file.type)) throw new Error("png, jpg, webp, gif 이미지만 올릴 수 있어요.");
  if (file.size > MAX) throw new Error("이미지는 8MB 이하여야 해요.");
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  if (file.type === "image/gif") return store(`${folder}/${stamp}.gif`, file, "image/gif");
  const width = WIDTH[folder] ?? 1440;
  const out = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 82 })
    .toBuffer();
  return store(`${folder}/${stamp}.webp`, out, "image/webp");
}
