import autocannon from 'autocannon';
const base='http://127.0.0.1:'+(process.env.PORT||3100);
const paths=['/','/app.js','/styles.css','/hero-480.webp','/logo-80.webp','/ghana-locations.js','/listing-pricing.js'];
const stages=[100,500,1000,2000,3000];
const out=[];
for(const c of stages){
  const r=await autocannon({url:base,connections:c,duration:c===3000?30:10,timeout:30,requests:paths.map(p=>({method:'GET',path:p,headers:{'accept-encoding':'gzip'}}))});
  const non2=r.non2xx, errs=r.errors+r.timeouts;
  const total=r['2xx']+non2+errs;
  const row={connections:c,rps:Math.round(r.requests.average),avg:r.latency.average,p95:r.latency.p97_5,p99:r.latency.p99,max:r.latency.max,total:r.requests.total,'2xx':r['2xx'],non2xx:non2,errors:r.errors,timeouts:r.timeouts,errPct:+(100*(non2+errs)/Math.max(1,r.requests.total+errs)).toFixed(2),mbps:+(r.throughput.average/1e6).toFixed(1)};
  console.log(JSON.stringify(row));out.push(row);
}
import fs from 'fs';fs.writeFileSync('docs/lighthouse/load-'+(process.argv[2]||'run')+'.json',JSON.stringify(out,null,1));


