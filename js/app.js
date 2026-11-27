const $=s=>document.querySelector(s);
const money=v=>v.toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const odd=v=>v.toFixed(2).replace(".",",");
const MARKET={title:"QUEM SERÁ QUE VOLTA PARA A EX?",desc:"O amor pode até acabar, mas será que a saudade fala mais alto?",
 opts:[{k:"j",n:"João",o:1.20,e:"🧔"},{k:"p",n:"Pompeu",o:1.60,e:"🕺"},{k:"n",n:"Nenhum dos dois (Empate)",o:1.02,e:"🤝"}]};
const NAMES={j:"João venceu",p:"Pompeu venceu",n:"Nenhum dos dois venceu"};
const DEMO_HIST=[
 {t:"Quem chega atrasado no forró de Campina?",r:"Chico venceu",d:"12/11"},
 {t:"Vai chover no São João da Paraíba?",r:"Sim venceu",d:"24/06"},
 {t:"Quem come mais coxinhas na festa?",r:"Zé venceu",d:"03/05"}];
let S={balance:1000,bets:[],history:[],closed:null,user:null};
try{const x=JSON.parse(localStorage.getItem("cxb")||"null");if(x&&typeof x.balance==="number")S=x}catch(e){}
const save=()=>{try{localStorage.setItem("cxb",JSON.stringify(S))}catch(e){}};
let pick=null,stake=10,filter="all";

// Componentes reutilizáveis
const Coxinha=(w)=>`<svg width="${w}" height="${w}" viewBox="0 0 64 64"><defs><linearGradient id="cg${w}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffe24a"/><stop offset="1" stop-color="#f29a1a"/></linearGradient></defs><path d="M32 4C20 4 8 30 8 44c0 10 10 16 24 16s24-6 24-16C56 30 44 4 32 4z" fill="url(#cg${w})" stroke="#a85d00" stroke-width="2"/><circle cx="32" cy="42" r="12" fill="#050a18"/><circle cx="32" cy="42" r="12" fill="none" stroke="#b6ff2e" stroke-width="2"/><text x="32" y="47" text-anchor="middle" font-size="14" font-weight="900" fill="#b6ff2e" font-family="Arial">$</text><circle cx="25" cy="18" r="3" fill="#fff" opacity=".5"/></svg>`;
const Logo=()=>`${Coxinha(34)}<span>COXINHA<b>BET</b></span>`;
const Toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(Toast.h);Toast.h=setTimeout(()=>t.classList.remove("show"),2600)};
const OptionBtn=(o,sel,closed)=>`<button class="opt ${sel?"sel":""} ${closed===o.k?"win":""}" data-k="${o.k}" ${closed?"disabled":""}><span style="font-size:30px">${o.e}</span><span class="n">${o.n}</span><span class="o">${odd(o.o)}</span><small>${sel?"✔ Selecionada":closed?"Encerrada":"Clique para apostar"}</small></button>`;
const BetRow=b=>{const o=MARKET.opts.find(x=>x.k===b.pick);const lb={open:"Aberta",won:"Ganha ✔",lost:"Perdida ✖"}[b.status];
 return `<div class="bet"><div><b>${MARKET.title}</b><small>Seleção: ${o.n}</small></div><div><small>Apostado</small><b>${money(b.stake)}</b></div><div><small>Odd</small><b>${odd(b.odd)}</b></div><div><small>${b.status==="lost"?"Retorno":"Retorno potencial"}</small><b>${b.status==="lost"?money(0):money(b.stake*b.odd)}</b></div><span class="st ${b.status}">${lb}</span></div>`};

function renderMarket(){
 $("#market").innerHTML=`<span class="live">${S.closed?"ENCERRADA":"<i></i> AO VIVO · PRIMEIRA APOSTA OFICIAL"}</span><h3>${MARKET.title}</h3><p style="color:var(--mut);margin:0">${MARKET.desc}</p><div class="opts">${MARKET.opts.map(o=>OptionBtn(o,pick===o.k&&!S.closed,S.closed)).join("")}</div>`;
 document.querySelectorAll(".opt").forEach(b=>b.onclick=()=>{pick=b.dataset.k;renderMarket();renderSlip()});
}
function renderSlip(){
 const o=MARKET.opts.find(x=>x.k===pick);
 if(!o||S.closed){$("#slip").innerHTML=`<h3>🎟️ MINHA APOSTA</h3><div class="empty">${S.closed?"Aposta encerrada. Aguarde a próxima rodada!":"Selecione uma odd para montar seu cupom."}</div>`;return}
 const ret=stake*o.o,lucro=ret-stake,ok=stake>0&&stake<=S.balance;
 $("#slip").innerHTML=`<h3>🎟️ MINHA APOSTA <span class="st open">1 seleção</span></h3>
 <div class="row"><span>Seleção</span><b>${o.n}</b></div><div class="row"><span>Odd</span><b style="color:var(--yel)">${odd(o.o)}</b></div>
 <label class="row" for="v">Valor da aposta (fictício)</label>
 <input id="v" class="inp" type="number" min="1" step="1" inputmode="decimal" value="${stake||""}">
 <div class="chips">${[10,50,100,500].map(v=>`<button data-v="${v}">R$ ${v}</button>`).join("")}</div>
 <div class="row"><span>Retorno potencial</span><b id="r1">${money(ret||0)}</b></div>
 <div class="row"><span>Lucro potencial</span><b class="g" id="r2">${money(lucro||0)}</b></div>
 <button class="btn" id="conf" style="width:100%;margin-top:10px" ${ok?"":"disabled"}>CONFIRMAR APOSTA</button>
 <small id="warn" style="color:var(--red);display:block;margin-top:8px">${stake>S.balance?"Saldo insuficiente.":""}</small>`;
 const upd=()=>{const r=stake*o.o,ok=stake>0&&stake<=S.balance;$("#r1").textContent=money(r||0);$("#r2").textContent=money((r-stake)||0);$("#conf").disabled=!ok;$("#warn").textContent=stake>S.balance?"Saldo insuficiente.":""};
 $("#v").oninput=e=>{stake=parseFloat(e.target.value)||0;upd()};
 document.querySelectorAll(".chips button").forEach(b=>b.onclick=()=>{stake=+b.dataset.v;$("#v").value=stake;upd()});
 $("#conf").onclick=()=>{S.balance-=stake;S.bets.unshift({id:Date.now(),pick:o.k,odd:o.o,stake,status:"open"});save();Toast(`Aposta de ${money(stake)} confirmada! 🍀`);pick=null;renderAll()};
}
function renderBets(){
 const T=[["all","Todas"],["open","Abertas"],["won","Ganhas"],["lost","Perdidas"]];
 $("#tabs").innerHTML=T.map(([k,l])=>`<button class="${filter===k?"on":""}" data-f="${k}">${l} (${k==="all"?S.bets.length:S.bets.filter(b=>b.status===k).length})</button>`).join("");
 document.querySelectorAll("#tabs button").forEach(b=>b.onclick=()=>{filter=b.dataset.f;renderBets()});
 const l=S.bets.filter(b=>filter==="all"||b.status===filter);
 $("#mybets").innerHTML=l.length?l.map(BetRow).join(""):`<div class="card empty">Nenhuma aposta por aqui ainda. Bora apostar? 🥟</div>`;
}
function renderResults(){
 const open=S.bets.filter(b=>b.status==="open").length;
 $("#admin").innerHTML=`<b>🛠️ Painel do administrador</b><p style="margin:4px 0;color:var(--mut);font-size:14px">${S.closed?`Resultado definido: <b style="color:var(--lime)">${NAMES[S.closed]}</b>.`:`Defina o resultado de “${MARKET.title}” (${open} cupom(ns) aberto(s)).`}</p><div class="bt">${S.closed?`<button class="btn y" id="reopen">🔄 Nova rodada</button>`:Object.entries(NAMES).map(([k,n])=>`<button class="btn" data-r="${k}">${n}</button>`).join("")}<button class="ghost" id="reset">Reiniciar demo</button></div>`;
 document.querySelectorAll("[data-r]").forEach(b=>b.onclick=()=>{const k=b.dataset.r;S.closed=k;let w=0;S.bets.forEach(x=>{if(x.status==="open"){if(x.pick===k){x.status="won";S.balance+=x.stake*x.odd;w+=x.stake*x.odd}else x.status="lost"}});S.history.unshift({t:MARKET.title,r:NAMES[k],d:new Date().toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"})});save();Toast(w?`${NAMES[k]}! Você recebeu ${money(w)} 🎉`:`${NAMES[k]}. Cupons atualizados.`);pick=null;renderAll()});
 if(S.closed)$("#reopen").onclick=()=>{S.closed=null;save();renderAll();Toast("Nova rodada aberta!")};
 $("#reset").onclick=()=>{S={balance:1000,bets:[],history:[],closed:null,user:S.user};pick=null;save();renderAll();Toast("Demo reiniciada: R$ 1.000,00")};
 const h=[...S.history,...DEMO_HIST];
 $("#history").innerHTML=h.map(x=>`<div class="bet" style="grid-template-columns:1fr auto auto"><b>${x.t}</b><span class="st won">${x.r}</span><small>${x.d}</small></div>`).join("");
}
function renderHead(){$("#saldo").textContent=money(S.balance);$("#login").textContent=S.user?"Sair":"Entrar"}
function renderAll(){renderHead();renderMarket();renderSlip();renderBets();renderResults()}
$("#login").onclick=()=>{S.user=S.user?null:"Apostador";save();renderHead();Toast(S.user?"Bem-vindo, apostador! Saldo: R$ 1.000,00 🥟":"Você saiu. Até logo!")};
$("#logo").innerHTML=Logo();$("#logo2").innerHTML=Logo();$("#mascot").innerHTML=Coxinha(260);
renderAll();
