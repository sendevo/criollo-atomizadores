import{W as P}from"./index.ba109a04.js";function m(y){const r=y.split("/").filter(t=>t!=="."),e=[];return r.forEach(t=>{t===".."&&e.length>0&&e[e.length-1]!==".."?e.pop():e.push(t)}),e.join("/")}function x(y,r){y=m(y),r=m(r);const e=y.split("/"),t=r.split("/");return y!==r&&e.every((i,s)=>i===t[s])}class g extends P{constructor(){super(...arguments),this.DB_VERSION=1,this.DB_NAME="Disc",this._writeCmds=["add","put","delete"]}async initDb(){if(this._db!==void 0)return this._db;if(!("indexedDB"in window))throw this.unavailable("This browser doesn't support IndexedDB");return new Promise((r,e)=>{const t=indexedDB.open(this.DB_NAME,this.DB_VERSION);t.onupgradeneeded=g.doUpgrade,t.onsuccess=()=>{this._db=t.result,r(t.result)},t.onerror=()=>e(t.error),t.onblocked=()=>{console.warn("db blocked")}})}static doUpgrade(r){const t=r.target.result;switch(r.oldVersion){case 0:case 1:default:t.objectStoreNames.contains("FileStorage")&&t.deleteObjectStore("FileStorage"),t.createObjectStore("FileStorage",{keyPath:"path"}).createIndex("by_folder","folder")}}async dbRequest(r,e){const t=this._writeCmds.indexOf(r)!==-1?"readwrite":"readonly";return this.initDb().then(i=>new Promise((s,a)=>{const o=i.transaction(["FileStorage"],t).objectStore("FileStorage")[r](...e);o.onsuccess=()=>s(o.result),o.onerror=()=>a(o.error)}))}async dbIndexRequest(r,e,t){const i=this._writeCmds.indexOf(e)!==-1?"readwrite":"readonly";return this.initDb().then(s=>new Promise((a,n)=>{const d=s.transaction(["FileStorage"],i).objectStore("FileStorage").index(r)[e](...t);d.onsuccess=()=>a(d.result),d.onerror=()=>n(d.error)}))}getPath(r,e){const t=e!==void 0?e.replace(/^[/]+|[/]+$/g,""):"";let i="";return r!==void 0&&(i+="/"+r),e!==""&&(i+="/"+t),i}async clear(){(await this.initDb()).transaction(["FileStorage"],"readwrite").objectStore("FileStorage").clear()}async readFile(r){const e=this.getPath(r.directory,r.path),t=await this.dbRequest("get",[e]);if(t===void 0)throw Error("File does not exist.");return{data:t.content?t.content:""}}async writeFile(r){const e=this.getPath(r.directory,r.path),t=r.data,i=r.recursive,s=await this.dbRequest("get",[e]);if(s&&s.type==="directory")throw Error("The supplied path is a directory.");const a=r.encoding,n=e.substr(0,e.lastIndexOf("/"));if(await this.dbRequest("get",[n])===void 0){const d=n.indexOf("/",1);if(d!==-1){const f=n.substr(d);await this.mkdir({path:f,directory:r.directory,recursive:i})}}const o=Date.now(),c={path:e,folder:n,type:"file",size:t.length,ctime:o,mtime:o,content:!a&&t.indexOf(",")>=0?t.split(",")[1]:t};return await this.dbRequest("put",[c]),{uri:c.path}}async appendFile(r){const e=this.getPath(r.directory,r.path);let t=r.data;const i=e.substr(0,e.lastIndexOf("/")),s=Date.now();let a=s;const n=await this.dbRequest("get",[e]);if(n&&n.type==="directory")throw Error("The supplied path is a directory.");if(await this.dbRequest("get",[i])===void 0){const c=i.indexOf("/",1);if(c!==-1){const d=i.substr(c);await this.mkdir({path:d,directory:r.directory,recursive:!0})}}n!==void 0&&(t=n.content+t,a=n.ctime);const o={path:e,folder:i,type:"file",size:t.length,ctime:a,mtime:s,content:t};await this.dbRequest("put",[o])}async deleteFile(r){const e=this.getPath(r.directory,r.path);if(await this.dbRequest("get",[e])===void 0)throw Error("File does not exist.");if((await this.dbIndexRequest("by_folder","getAllKeys",[IDBKeyRange.only(e)])).length!==0)throw Error("Folder is not empty.");await this.dbRequest("delete",[e])}async mkdir(r){const e=this.getPath(r.directory,r.path),t=r.recursive,i=e.substr(0,e.lastIndexOf("/")),s=(e.match(/\//g)||[]).length,a=await this.dbRequest("get",[i]),n=await this.dbRequest("get",[e]);if(s===1)throw Error("Cannot create Root directory");if(n!==void 0)throw Error("Current directory does already exist.");if(!t&&s!==2&&a===void 0)throw Error("Parent directory must exist");if(t&&s!==2&&a===void 0){const c=i.substr(i.indexOf("/",1));await this.mkdir({path:c,directory:r.directory,recursive:t})}const h=Date.now(),o={path:e,folder:i,type:"directory",size:0,ctime:h,mtime:h};await this.dbRequest("put",[o])}async rmdir(r){const{path:e,directory:t,recursive:i}=r,s=this.getPath(t,e),a=await this.dbRequest("get",[s]);if(a===void 0)throw Error("Folder does not exist.");if(a.type!=="directory")throw Error("Requested path is not a directory");const n=await this.readdir({path:e,directory:t});if(n.files.length!==0&&!i)throw Error("Folder is not empty");for(const h of n.files){const o=`${e}/${h}`;(await this.stat({path:o,directory:t})).type==="file"?await this.deleteFile({path:o,directory:t}):await this.rmdir({path:o,directory:t,recursive:i})}await this.dbRequest("delete",[s])}async readdir(r){const e=this.getPath(r.directory,r.path),t=await this.dbRequest("get",[e]);if(r.path!==""&&t===void 0)throw Error("Folder does not exist.");return{files:(await this.dbIndexRequest("by_folder","getAllKeys",[IDBKeyRange.only(e)])).map(a=>a.substring(e.length+1))}}async getUri(r){const e=this.getPath(r.directory,r.path);let t=await this.dbRequest("get",[e]);return t===void 0&&(t=await this.dbRequest("get",[e+"/"])),{uri:(t==null?void 0:t.path)||e}}async stat(r){const e=this.getPath(r.directory,r.path);let t=await this.dbRequest("get",[e]);if(t===void 0&&(t=await this.dbRequest("get",[e+"/"])),t===void 0)throw Error("Entry does not exist.");return{type:t.type,size:t.size,ctime:t.ctime,mtime:t.mtime,uri:t.path}}async rename(r){return this._copy(r,!0)}async copy(r){return this._copy(r,!1)}async requestPermissions(){return{publicStorage:"granted"}}async checkPermissions(){return{publicStorage:"granted"}}async _copy(r,e=!1){let{toDirectory:t}=r;const{to:i,from:s,directory:a}=r;if(!i||!s)throw Error("Both to and from must be provided");t||(t=a);const n=this.getPath(a,s),h=this.getPath(t,i);if(n===h)return;if(x(n,h))throw Error("To path cannot contain the from path");let o;try{o=await this.stat({path:i,directory:t})}catch{const u=i.split("/");u.pop();const p=u.join("/");if(u.length>0&&(await this.stat({path:p,directory:t})).type!=="directory")throw new Error("Parent directory of the to path is a file")}if(o&&o.type==="directory")throw new Error("Cannot overwrite a directory with a file");const c=await this.stat({path:s,directory:a}),d=async(l,u,p)=>{const b=this.getPath(t,l),w=await this.dbRequest("get",[b]);w.ctime=u,w.mtime=p,await this.dbRequest("put",[w])},f=c.ctime?c.ctime:Date.now();switch(c.type){case"file":{const l=await this.readFile({path:s,directory:a});e&&await this.deleteFile({path:s,directory:a}),await this.writeFile({path:i,directory:t,data:l.data}),e&&await d(i,f,c.mtime);return}case"directory":{if(o)throw Error("Cannot move a directory over an existing object");try{await this.mkdir({path:i,directory:t,recursive:!1}),e&&await d(i,f,c.mtime)}catch{}const l=(await this.readdir({path:s,directory:a})).files;for(const u of l)await this._copy({from:`${s}/${u}`,to:`${i}/${u}`,directory:a,toDirectory:t},e);e&&await this.rmdir({path:s,directory:a})}}}}g._debug=!0;export{g as FilesystemWeb};
