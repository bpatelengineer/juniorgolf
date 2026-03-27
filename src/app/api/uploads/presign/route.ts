import { auth } from "@/server/auth";
import { NextResponse } from "next/server";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { contentType, fileSize, folder = "general" } = await req.json();

  if (!ALLOWED_TYPES.includes(contentType)) {
    return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
  }
  if (fileSize > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large (max 10 MB)" }, { status: 400 });
  }

  // If S3 is not configured, return a placeholder for local dev
  if (!process.env.AWS_ACCESS_KEY_ID) {
    const key = `${folder}/${Date.now()}-placeholder`;
    return NextResponse.json({
      uploadUrl: null,
      key,
      publicUrl: `https://placehold.co/800x600?text=Photo`,
    });
  }

  const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  const { getSignedUrl } = await import("@aws-sdk/s3-request-presigner");

  const s3 = new S3Client({ region: process.env.AWS_REGION });
  const key = `${folder}/${session.user.id}/${Date.now()}`;
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
  const publicUrl = `${process.env.CDN_URL}/${key}`;

  return NextResponse.json({ uploadUrl, key, publicUrl });
}
