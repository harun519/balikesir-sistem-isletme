import {NextResponse} from "next/server";
import {neon} from "@neondatabase/serverless";

export const runtime="nodejs";

type CrmDoc={
  id:string;crmNo:string;date:string;district:string;neighborhood:string;street:string;
  customer:string;installationNo:string;voltage:string;subject:string;detail:string;
  status:string;priority:string;archived:boolean;createdAt:string;updatedAt?:string;
};

function db(){
  const url=process.env.DATABASE_URL;
  if(!url) return null;
  return neon(url);
}

async function ensure(sql:ReturnType<typeof neon>){
  await sql`CREATE TABLE IF NOT EXISTS crm_documents (
    id text PRIMARY KEY,
    payload jsonb NOT NULL,
    archived boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now(),
    updated_at timestamptz NOT NULL DEFAULT now()
  )`;
  await sql`CREATE INDEX IF NOT EXISTS crm_documents_archived_idx ON crm_documents (archived)`;
  await sql`CREATE INDEX IF NOT EXISTS crm_documents_updated_idx ON crm_documents (updated_at DESC)`;
}

export async function GET(){
  const sql=db();
  if(!sql) return NextResponse.json({ok:false,mode:"local",error:"DATABASE_URL missing"},{status:503});
  await ensure(sql);
  const rows=await sql`SELECT id,payload,archived,created_at,updated_at FROM crm_documents ORDER BY updated_at DESC`;
  const documents=rows.map((r:any)=>({
    ...(r.payload||{}),id:r.id,archived:!!r.archived,
    createdAt:r.payload?.createdAt||r.created_at?.toISOString?.()||String(r.created_at||""),
    updatedAt:r.updated_at?.toISOString?.()||String(r.updated_at||"")
  }));
  return NextResponse.json({ok:true,mode:"neon",documents});
}

export async function POST(req:Request){
  const sql=db();
  if(!sql) return NextResponse.json({ok:false,error:"DATABASE_URL missing"},{status:503});
  await ensure(sql);
  const body=await req.json() as CrmDoc;
  if(!body?.id||!body?.crmNo) return NextResponse.json({ok:false,error:"id and crmNo required"},{status:400});
  const stamp=new Date().toISOString();
  const payload={...body,updatedAt:stamp};
  await sql`INSERT INTO crm_documents (id,payload,archived,created_at,updated_at)
    VALUES (${body.id},${JSON.stringify(payload)}::jsonb,${!!body.archived},${body.createdAt||stamp}::timestamptz,${stamp}::timestamptz)
    ON CONFLICT (id) DO UPDATE SET payload=EXCLUDED.payload,archived=EXCLUDED.archived,updated_at=EXCLUDED.updated_at`;
  return NextResponse.json({ok:true,document:payload});
}

export async function PATCH(req:Request){
  const sql=db();
  if(!sql) return NextResponse.json({ok:false,error:"DATABASE_URL missing"},{status:503});
  await ensure(sql);
  const body=await req.json() as Partial<CrmDoc>&{id:string};
  if(!body?.id) return NextResponse.json({ok:false,error:"id required"},{status:400});
  const rows=await sql`SELECT payload,archived FROM crm_documents WHERE id=${body.id} LIMIT 1`;
  if(!rows.length) return NextResponse.json({ok:false,error:"not found"},{status:404});
  const stamp=new Date().toISOString();
  const current=rows[0] as any;
  const merged={...(current.payload||{}),...body,id:body.id,updatedAt:stamp};
  const archived=body.archived??!!current.archived;
  await sql`UPDATE crm_documents SET payload=${JSON.stringify(merged)}::jsonb,archived=${archived},updated_at=${stamp}::timestamptz WHERE id=${body.id}`;
  return NextResponse.json({ok:true,document:{...merged,archived}});
}

export async function DELETE(req:Request){
  const sql=db();
  if(!sql) return NextResponse.json({ok:false,error:"DATABASE_URL missing"},{status:503});
  await ensure(sql);
  const {id}=await req.json() as {id?:string};
  if(!id) return NextResponse.json({ok:false,error:"id required"},{status:400});
  await sql`DELETE FROM crm_documents WHERE id=${id}`;
  return NextResponse.json({ok:true});
}
