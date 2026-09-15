import {NextRequest,NextResponse} from "next/server";
import {neon} from "@neondatabase/serverless";
import {get} from "@vercel/blob";

export const runtime="nodejs";

function db(){
  const url=process.env.DATABASE_URL;
  if(!url) return null;
  return neon(url);
}

export async function GET(_req:NextRequest,{params}:{params:Promise<{id:string}>}){
  const sql=db();
  if(!sql) return new NextResponse("Database unavailable",{status:503});
  const {id}=await params;
  const rows=await sql`SELECT file_name,content_type,blob_pathname FROM crm_files WHERE id=${id} LIMIT 1`;
  if(!rows.length) return new NextResponse("Not found",{status:404});
  const row=rows[0] as any;
  const result=await get(String(row.blob_pathname),{access:"private",useCache:false});
  if(!result||result.statusCode!==200) return new NextResponse("File not found",{status:404});
  const fallback=String(row.file_name||"evrak").replace(/[\r\n\"]/g,"_");
  return new NextResponse(result.stream,{headers:{
    "Content-Type":String(row.content_type||result.blob.contentType||"application/octet-stream"),
    "Content-Disposition":`inline; filename*=UTF-8''${encodeURIComponent(fallback)}`,
    "X-Content-Type-Options":"nosniff",
    "Cache-Control":"private, no-store"
  }});
}
