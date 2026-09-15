import {NextResponse} from "next/server";
import {neon} from "@neondatabase/serverless";
import {put,del} from "@vercel/blob";

export const runtime="nodejs";

function db(){
  const url=process.env.DATABASE_URL;
  if(!url) return null;
  return neon(url);
}

async function ensure(sql:ReturnType<typeof neon>){
  await sql`CREATE TABLE IF NOT EXISTS crm_files (
    id text PRIMARY KEY,
    document_id text NOT NULL,
    crm_no text NOT NULL,
    file_name text NOT NULL,
    content_type text NOT NULL,
    file_size bigint NOT NULL DEFAULT 0,
    blob_url text NOT NULL,
    blob_pathname text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql`CREATE INDEX IF NOT EXISTS crm_files_document_idx ON crm_files (document_id,created_at DESC)`;
}

function safeName(name:string){
  return name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]+/g,"-").replace(/-+/g,"-").slice(0,120)||"dosya";
}

export async function GET(req:Request){
  const sql=db();
  if(!sql) return NextResponse.json({ok:false,error:"DATABASE_URL missing"},{status:503});
  await ensure(sql);
  const {searchParams}=new URL(req.url);
  const documentId=searchParams.get("documentId");
  const rows=documentId
    ? await sql`SELECT id,document_id,crm_no,file_name,content_type,file_size,created_at FROM crm_files WHERE document_id=${documentId} ORDER BY created_at DESC`
    : await sql`SELECT id,document_id,crm_no,file_name,content_type,file_size,created_at FROM crm_files ORDER BY created_at DESC LIMIT 250`;
  return NextResponse.json({ok:true,files:rows.map((r:any)=>({
    id:r.id,documentId:r.document_id,crmNo:r.crm_no,fileName:r.file_name,contentType:r.content_type,
    size:Number(r.file_size||0),createdAt:r.created_at?.toISOString?.()||String(r.created_at||"")
  }))});
}

export async function POST(req:Request){
  const sql=db();
  if(!sql) return NextResponse.json({ok:false,error:"DATABASE_URL missing"},{status:503});
  if(!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ok:false,error:"BLOB_READ_WRITE_TOKEN missing"},{status:503});
  await ensure(sql);
  const form=await req.formData();
  const documentId=String(form.get("documentId")||"").trim();
  const crmNo=String(form.get("crmNo")||"").trim();
  const file=form.get("file");
  if(!documentId||!crmNo||!(file instanceof File)) return NextResponse.json({ok:false,error:"documentId, crmNo and file required"},{status:400});
  const allowed=new Set(["application/pdf","image/jpeg","image/png"]);
  if(!allowed.has(file.type)) return NextResponse.json({ok:false,error:"Sadece PDF, JPG/JPEG ve PNG yüklenebilir."},{status:400});
  if(file.size>15*1024*1024) return NextResponse.json({ok:false,error:"Dosya boyutu en fazla 15 MB olabilir."},{status:400});
  const exists=await sql`SELECT id FROM crm_documents WHERE id=${documentId} LIMIT 1`;
  if(!exists.length) return NextResponse.json({ok:false,error:"CRM kaydı bulunamadı."},{status:404});
  const id=crypto.randomUUID();
  const pathname=`crm/${documentId}/${Date.now()}-${safeName(file.name)}`;
  const blob=await put(pathname,file,{access:"private",addRandomSuffix:true,contentType:file.type});
  await sql`INSERT INTO crm_files (id,document_id,crm_no,file_name,content_type,file_size,blob_url,blob_pathname)
    VALUES (${id},${documentId},${crmNo},${file.name},${file.type},${file.size},${blob.url},${blob.pathname})`;
  return NextResponse.json({ok:true,file:{id,documentId,crmNo,fileName:file.name,contentType:file.type,size:file.size,createdAt:new Date().toISOString()}});
}

export async function DELETE(req:Request){
  const sql=db();
  if(!sql) return NextResponse.json({ok:false,error:"DATABASE_URL missing"},{status:503});
  if(!process.env.BLOB_READ_WRITE_TOKEN) return NextResponse.json({ok:false,error:"BLOB_READ_WRITE_TOKEN missing"},{status:503});
  await ensure(sql);
  const {id}=await req.json() as {id?:string};
  if(!id) return NextResponse.json({ok:false,error:"id required"},{status:400});
  const rows=await sql`SELECT blob_url FROM crm_files WHERE id=${id} LIMIT 1`;
  if(!rows.length) return NextResponse.json({ok:false,error:"not found"},{status:404});
  await del(String((rows[0] as any).blob_url));
  await sql`DELETE FROM crm_files WHERE id=${id}`;
  return NextResponse.json({ok:true});
}
