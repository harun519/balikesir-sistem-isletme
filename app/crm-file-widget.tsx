"use client";

import {useEffect,useMemo,useState} from "react";

type Doc={id:string;crmNo:string;district?:string;customer?:string};
type CrmFile={id:string;documentId:string;crmNo:string;fileName:string;contentType:string;size:number;createdAt:string};

function fmtSize(n:number){if(!n)return "0 KB";if(n<1024*1024)return `${(n/1024).toFixed(0)} KB`;return `${(n/1024/1024).toFixed(1)} MB`}

export default function CrmFileWidget(){
 const [enabled,setEnabled]=useState(false),[open,setOpen]=useState(false),[docs,setDocs]=useState<Doc[]>([]),[docId,setDocId]=useState(""),[files,setFiles]=useState<CrmFile[]>([]),[busy,setBusy]=useState(false),[msg,setMsg]=useState("");
 useEffect(()=>{setEnabled(window.location.pathname.startsWith("/crm-evrak"))},[]);
 useEffect(()=>{if(!open)return;loadDocs()},[open]);
 useEffect(()=>{if(docId)loadFiles(docId);else setFiles([])},[docId]);
 const selected=useMemo(()=>docs.find(d=>d.id===docId),[docs,docId]);
 async function loadDocs(){try{const r=await fetch("/api/crm-evrak",{cache:"no-store"}),j=await r.json();if(j.ok){setDocs(j.documents||[]);if(!docId&&j.documents?.[0]?.id)setDocId(j.documents[0].id)}}catch{}}
 async function loadFiles(id:string){try{const r=await fetch(`/api/crm-files?documentId=${encodeURIComponent(id)}`,{cache:"no-store"}),j=await r.json();if(j.ok)setFiles(j.files||[])}catch{}}
 async function upload(e:React.FormEvent<HTMLFormElement>){e.preventDefault();if(!selected)return setMsg("Önce CRM kaydı seç.");const input=e.currentTarget.elements.namedItem("files") as HTMLInputElement;if(!input.files?.length)return setMsg("Dosya seç.");setBusy(true);setMsg("");try{for(const file of Array.from(input.files)){const fd=new FormData();fd.append("documentId",selected.id);fd.append("crmNo",selected.crmNo);fd.append("file",file);const r=await fetch("/api/crm-files",{method:"POST",body:fd});const j=await r.json();if(!r.ok)throw new Error(j.error||"Yükleme başarısız")}input.value="";await loadFiles(selected.id);setMsg("✓ Dosya yüklendi.")}catch(err:any){setMsg(err?.message||"Yükleme başarısız")}finally{setBusy(false)}}
 async function remove(id:string){if(!confirm("Bu dosya silinsin mi?"))return;setBusy(true);try{const r=await fetch("/api/crm-files",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});const j=await r.json();if(!r.ok)throw new Error(j.error||"Silinemedi");if(selected)await loadFiles(selected.id)}catch(err:any){setMsg(err?.message||"Silinemedi")}finally{setBusy(false)}}
 if(!enabled)return null;
 return <>
  <button className="crmFileFab" onClick={()=>setOpen(true)}>📎 Evrak Dosyaları</button>
  {open&&<div className="crmFileBack" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}}><div className="crmFileModal">
   <button className="crmFileClose" onClick={()=>setOpen(false)}>×</button><h2>CRM Evrak Dosyaları</h2><p>PDF, JPG/JPEG ve PNG dosyalarını CRM kaydına bağla.</p>
   <label>CRM Kaydı<select value={docId} onChange={e=>setDocId(e.target.value)}><option value="">Seç...</option>{docs.map(d=><option key={d.id} value={d.id}>{d.crmNo} · {d.district||""} {d.customer?`· ${d.customer}`:""}</option>)}</select></label>
   <form onSubmit={upload}><label className="crmDrop">📎 Dosya seç<input name="files" type="file" accept="application/pdf,image/jpeg,image/png" multiple/></label><button disabled={busy||!docId}>{busy?"İşleniyor...":"Dosyaları Yükle"}</button></form>
   {msg&&<div className={msg.startsWith("✓")?"crmMsg ok":"crmMsg"}>{msg}</div>}
   <div className="crmFiles"><h3>Bağlı Dosyalar <span>{files.length}</span></h3>{files.length===0?<div className="crmEmpty">Bu CRM kaydında dosya yok.</div>:files.map(f=><div className="crmFileRow" key={f.id}><div><b>{f.fileName}</b><small>{fmtSize(f.size)} · {new Date(f.createdAt).toLocaleString("tr-TR")}</small></div><a href={`/api/crm-files/${f.id}`} target="_blank" rel="noreferrer">Aç</a><button onClick={()=>remove(f.id)} disabled={busy}>Sil</button></div>)}</div>
  </div></div>}
  <style jsx>{`
   .crmFileFab{position:fixed;right:20px;bottom:20px;z-index:45;border:0;border-radius:999px;background:#0f7be5;color:#fff;padding:13px 18px;font-weight:900;box-shadow:0 12px 28px #0f172a38;cursor:pointer}.crmFileBack{position:fixed;inset:0;z-index:80;background:#0611209a;display:grid;place-items:center;padding:18px}.crmFileModal{width:min(680px,100%);max-height:88dvh;overflow:auto;background:#fff;border-radius:20px;padding:22px;color:#172033;box-shadow:0 28px 80px #0005;position:relative}.crmFileClose{position:absolute;right:14px;top:12px;border:0;background:#eef2f7;width:38px;height:38px;border-radius:10px;font-size:24px}.crmFileModal h2{margin:0 45px 5px 0}.crmFileModal>p{margin:0 0 18px;color:#718096;font-size:12px}.crmFileModal label{display:block;font-size:12px;font-weight:800}.crmFileModal select{width:100%;margin-top:6px;border:1px solid #d8e0ea;border-radius:10px;padding:11px;background:#fff}.crmDrop{margin-top:14px!important;border:2px dashed #bfd0e3;border-radius:14px;padding:20px;text-align:center;background:#f8fbff;cursor:pointer}.crmDrop input{display:block;margin:10px auto 0;max-width:100%}.crmFileModal form>button{width:100%;margin-top:10px;border:0;border-radius:10px;padding:12px;background:#0f7be5;color:#fff;font-weight:900;cursor:pointer}.crmFileModal form>button:disabled{opacity:.55}.crmMsg{margin-top:10px;padding:10px;border-radius:10px;background:#fff4e5;color:#a14a00;font-size:12px}.crmMsg.ok{background:#eafbf3;color:#087443}.crmFiles{margin-top:18px}.crmFiles h3{font-size:14px;margin:0 0 8px}.crmFiles h3 span{display:inline-grid;place-items:center;min-width:24px;height:24px;border-radius:20px;background:#edf2f7;margin-left:5px}.crmEmpty{padding:22px;text-align:center;color:#94a3b8;background:#f8fafc;border-radius:12px;font-size:12px}.crmFileRow{display:grid;grid-template-columns:1fr auto auto;gap:8px;align-items:center;padding:11px 0;border-bottom:1px solid #edf2f7}.crmFileRow b{display:block;font-size:12px;word-break:break-word}.crmFileRow small{display:block;color:#8290a3;margin-top:4px;font-size:10px}.crmFileRow a,.crmFileRow button{border:0;border-radius:8px;padding:8px 10px;font-size:11px;font-weight:800;text-decoration:none;cursor:pointer}.crmFileRow a{background:#e8f2ff;color:#0d63bd}.crmFileRow button{background:#feecec;color:#c62828}@media(max-width:700px){.crmFileFab{right:12px;bottom:12px;padding:11px 14px;font-size:12px}.crmFileBack{padding:8px}.crmFileModal{border-radius:16px;padding:17px;max-height:94dvh}.crmFileRow{grid-template-columns:1fr auto}.crmFileRow button{grid-column:2}}
  `}</style>
 </>
}
