export type AccountTarget='shared'|'teyit';
export type PasswordAccount={target:AccountTarget;id:string;email:string};
export type PasswordResult={updated:PasswordAccount[];failed:{account:PasswordAccount;error:string}[]};
export const accountLabel=(target:AccountTarget)=>target==='shared'?'Trafo / SCADA':'Görüntülü Teyit';

// Password changes are separate from role updates and never create an account.
export async function updateAccountPasswords(accounts:PasswordAccount[],password:string,tokens:Record<AccountTarget,string>):Promise<PasswordResult>{
 if(password.length<8)throw Error('Yeni şifre en az 8 karakter olmalı.');
 const result:PasswordResult={updated:[],failed:[]};
 for(const account of accounts){
  try{
   if(!tokens[account.target])throw Error('Yönetici bağlantısı yok. Bağlan / Yenile ile tekrar giriş yapın.');
   const response=await fetch('/api/merkezi-kullanicilar?target='+account.target,{
    method:'POST',cache:'no-store',redirect:'error',
    headers:{Authorization:'Bearer '+tokens[account.target],'Content-Type':'application/json'},
    body:JSON.stringify({action:'change-password',id:account.id,email:account.email,password})
   });
   const data=await response.json().catch(()=>null);
   if(!response.ok||!data?.ok)throw Error(data?.error||'Şifre güncellenemedi.');
   result.updated.push(account);
  }catch(error){
   const message=error instanceof Error?error.message:'Bağlantı kurulamadı.';
   result.failed.push({account,error:message.split(password).join('[gizli]')});
  }
 }
 return result;
}
