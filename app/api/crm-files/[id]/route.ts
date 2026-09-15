import {NextRequest,NextResponse} from "next/server";
import {neon} from "@neondatabase/serverless";

export const runtime="nodejs";

function db(){
  const url=process.env.DATABASE_URL;
  if(!url) return null;
  return neon(url);
}

export async function GET(_req:NextRequest,{params}:{params:Promise<{id:string}>}){
  const sql=db();
  if(!sql) return new NextResponse("Database unavailable",{status:503});
  const token=process.env.BLOB_READ_WRITE_TOKEN;
  if(!token) return new NextResponse("Blob storage unavailable",{status:503});
  const {id}=await params;
  const rows=await sql`SELECT file_name,content_type,blob_url FROM crm_files WHERE id=${id} LIMIT 1`;
  if(!rows.length) return new NextResponse("Not found",{status:404});
  const row=rows[0] as any;
  const blobRes=await fetch(String(row.blob_url),{headers:{Authorization:`Bearer ${token}`},cache:"no-store"});
  if(!blobRes.ok||!blobRes.body) return new NextResponse("File not found",{status:404});
  const fallback=String(row.file_name||"evrak").replace(/[\r\n\"]/g,"_");
  return new NextResponse(blobRes.body,{headers:{
    "Content-Type":String(row.content_type||blobRes.headers.get("content-type")||"application/octet-stream"),
    "Content-Disposition":`inline; filename*=UTF-8''${encodeURIComponent(fallback)}`,
    "X-Content-Type-Options":"nosniff",
    "Cache-Control":"private, no-store"
  }});
}
