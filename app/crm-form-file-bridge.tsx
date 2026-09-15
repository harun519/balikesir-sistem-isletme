"use client";

import {useEffect} from "react";

function toast(text:string,ok=true){
  const el=document.createElement("div");
  el.textContent=text;
  Object.assign(el.style,{position:"fixed",right:"18px",bottom:"78px",zIndex:"120",background:ok?"#0b7a4b":"#b42318",color:"#fff",padding:"12px 16px",borderRadius:"12px",fontWeight:"800",fontSize:"13px",boxShadow:"0 12px 30px #0003",maxWidth:"340px"});
  document.body.appendChild(el);
  setTimeout(()=>el.remove(),4500);
}

export default function CrmFormFileBridge(){
  useEffect(()=>{
    if(!window.location.pathname.startsWith("/crm-evrak")) return;

    async function onSubmit(ev:SubmitEvent){
      const form=ev.target as HTMLFormElement|null;
      if(!form?.classList.contains("entry")) return;

      const fileInput=form.querySelector('input[type="file"]') as HTMLInputElement|null;
      const selectedFiles=fileInput?.files ? Array.from(fileInput.files) : [];
      if(!selectedFiles.length) return;

      const crmInput=form.querySelector('input[required]') as HTMLInputElement|null;
      const crmNo=(crmInput?.value||"").trim();
      if(!crmNo) return;

      const started=Date.now();
      let doc:any=null;
      for(let i=0;i<15;i++){
        await new Promise(r=>setTimeout(r,i===0?700:350));
        try{
          const res=await fetch("/api/crm-evrak",{cache:"no-store"});
          if(res.ok){
            const json=await res.json();
            const matches=(json.documents||[]).filter((d:any)=>d.crmNo===crmNo);
            doc=matches.sort((a:any,b:any)=>new Date(b.createdAt||0).getTime()-new Date(a.createdAt||0).getTime())[0]||null;
            if(doc && new Date(doc.createdAt||0).getTime()>=started-10000) break;
          }
        }catch{}
      }

      if(!doc){toast("CRM kaydı oluştu ancak dosya bağlantısı kurulamadı. Evrak Dosyaları panelinden tekrar yükleyebilirsin.",false);return;}

      try{
        for(const file of selectedFiles){
          const fd=new FormData();
          fd.append("documentId",doc.id);
          fd.append("crmNo",doc.crmNo);
          fd.append("file",file);
          const res=await fetch("/api/crm-files",{method:"POST",body:fd});
          const json=await res.json().catch(()=>({}));
          if(!res.ok) throw new Error(json.error||"Dosya yüklenemedi");
        }
        toast(`✓ ${selectedFiles.length} dosya CRM ${crmNo} kaydına yüklendi.`);
      }catch(err:any){
        toast(err?.message||"Dosya yüklenemedi.",false);
      }
    }

    document.addEventListener("submit",onSubmit,true);
    return()=>document.removeEventListener("submit",onSubmit,true);
  },[]);
  return null;
}
