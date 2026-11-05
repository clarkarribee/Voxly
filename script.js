var S={en:["Good morning everyone, thanks for joining today’s session.","Let’s start with a quick recap of what we covered last week.","The main goal is to make the process faster and easier for users.","Can you share your screen so we can walk through the results?","Sure, one moment. Okay, you should see it now.","The numbers look good, but we still need to double-check the data.","Let’s assign owners for each task and set a deadline.","I’ll send the notes right after this call. Thanks, everyone."],
fil:["Magandang umaga sa inyong lahat, salamat sa pagsali ngayon.","Simulan natin sa maikling balik-tanaw ng napag-usapan natin noong nakaraang linggo.","Ang pangunahing layunin ay gawing mas mabilis at mas madali ang proseso.","Pwede mo bang i-share ang screen para makita natin ang resulta?","Sige, sandali lang. Okay, makikita n’yo na ngayon.","Maganda ang mga numero, pero kailangan pa nating i-check ulit ang datos.","Magtakda tayo ng may-ari sa bawat gawain at ng deadline.","Ipapadala ko ang notes pagkatapos ng tawag. Salamat po sa lahat."],
tl:["Good morning guys, thanks sa pag-join today.","Start tayo sa quick recap ng napag-usapan natin last week.","Ang main goal natin is gawing mas mabilis ang process para sa users.","Pwede mo bang i-share yung screen para makita natin yung results?","Sige, wait lang. Okay, kita n’yo na ba?","Maganda yung numbers, pero kailangan pa nating i-double-check yung data.","Mag-assign tayo ng owner per task tapos set tayo ng deadline.","Ipapadala ko yung notes after this call. Salamat, guys!"]};
var $=function(i){return document.getElementById(i)};
var file=null,dur=60,segs=[],hist=[];
function fmt(s,srt){var h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=Math.floor(s%60);var p=function(n){return String(n).padStart(2,"0")};return srt?p(h)+":"+p(m)+":"+p(x)+",000":(h?h+":":"")+p(m)+":"+p(x)}
function size(b){return b>1048576?(b/1048576).toFixed(1)+" MB":Math.round(b/1024)+" KB"}
function pick(f){
 if(!f)return;
 if(!/^(audio|video)\//.test(f.type)&&!/\.(mp3|wav|m4a|mp4|mov|webm|ogg)$/i.test(f.name)){$("st").textContent="Please choose an audio or video file.";return}
 file=f;dur=60;$("out").style.display="none";$("st").textContent="";
 $("finfo").textContent=f.name+" · "+size(f.size);
 try{var el=document.createElement(/^video/.test(f.type)?"video":"audio");el.preload="metadata";el.onloadedmetadata=function(){if(isFinite(el.duration)&&el.duration>0){dur=el.duration;$("finfo").textContent=f.name+" · "+size(f.size)+" · "+fmt(dur)}URL.revokeObjectURL(el.src)};el.src=URL.createObjectURL(f)}catch(e){}
 $("go").disabled=false;
}
$("drop").onclick=function(){$("fi").click()};
$("fi").onchange=function(e){pick(e.target.files[0])};
["dragover","dragenter"].forEach(function(t){$("drop").addEventListener(t,function(e){e.preventDefault();$("drop").classList.add("on")})});
["dragleave","drop"].forEach(function(t){$("drop").addEventListener(t,function(e){e.preventDefault();$("drop").classList.remove("on")})});
$("drop").addEventListener("drop",function(e){pick(e.dataTransfer.files[0])});

$("go").onclick=function(){
 $("go").disabled=true;$("out").style.display="none";$("bar").style.display="block";
 var steps=["Uploading…","Extracting audio…","Detecting language…","Transcribing…","Adding timestamps…"],p=0,i=0;
 var t=setInterval(function(){
  p+=4+Math.random()*6;if(p>100)p=100;$("fill").style.width=p+"%";
  i=Math.min(steps.length-1,Math.floor(p/20));$("st").textContent=steps[i]+" "+Math.round(p)+"%";
  if(p>=100){clearInterval(t);finish()}
 },180);
};
function finish(){
 var lang=$("lang").value,lines=S[lang],n=Math.max(3,Math.min(14,Math.round(dur/6))),sp=$("mode").selectedIndex===0;
 segs=[];var step=dur/n;
 for(var k=0;k<n;k++)segs.push({t:k*step,s:sp?"Speaker "+(k%2+1):"",x:lines[k%lines.length]});
 if(window.__real){segs=window.__real.slice();window.__real=null}
 $("bar").style.display="none";$("fill").style.width="0";$("st").textContent="Done ✓";$("go").disabled=false;
 var box=$("segs");box.textContent="";
 segs.forEach(function(g){var r=document.createElement("div");r.className="seg";var a=document.createElement("div");a.className="ts";a.textContent=fmt(g.t);var b=document.createElement("div");if(g.s){var s=document.createElement("div");s.className="sp";s.textContent=g.s;b.appendChild(s)}var x=document.createElement("div");x.textContent=g.x;b.appendChild(x);r.appendChild(a);r.appendChild(b);box.appendChild(r)});
 var words=segs.reduce(function(a,g){return a+g.x.split(/\s+/).length},0);
 $("badges").textContent="";
 [$("lang").options[$("lang").selectedIndex].text,fmt(dur),words+" words","Confidence 96%"].forEach(function(b){var e=document.createElement("span");e.className="badge";e.textContent=b;$("badges").appendChild(e)});
 $("out").style.display="block";
 hist.unshift({n:file.name,d:fmt(dur)});hist=hist.slice(0,5);
 $("hcard").style.display="block";$("hist").textContent="";
 hist.forEach(function(h){var d=document.createElement("div");var a=document.createElement("span");a.textContent=h.n;var b=document.createElement("span");b.textContent=h.d;d.appendChild(a);d.appendChild(b);$("hist").appendChild(d)});
 $("out").scrollIntoView({behavior:"smooth",block:"start"});
}
function txt(){return segs.map(function(g){return "["+fmt(g.t)+"] "+(g.s?g.s+": ":"")+g.x}).join("\n")}
function srt(){return segs.map(function(g,i){var e=i<segs.length-1?segs[i+1].t:dur;return (i+1)+"\n"+fmt(g.t,1)+" --> "+fmt(e,1)+"\n"+(g.s?g.s+": ":"")+g.x+"\n"}).join("\n")}
function dl(name,data){window.SAVE(name,data)}
$("cp").onclick=function(){try{navigator.clipboard.writeText(txt());$("cp").textContent="Copied ✓"}catch(e){$("cp").textContent="Press Ctrl+C"}setTimeout(function(){$("cp").textContent="Copy"},1500)};
$("dt").onclick=function(){dl("transcript.txt",txt())};
$("ds").onclick=function(){dl("transcript.srt",srt())};
document.documentElement.classList.add('js');
/* waveform */
(function(){var c=$('wave'),x=c.getContext('2d'),w,h,d=window.devicePixelRatio||1,t=0,col='#b8f02a';
function rs(){w=c.clientWidth;h=c.clientHeight;c.width=w*d;c.height=h*d;x.setTransform(d,0,0,d,0,0);col=getComputedStyle(document.documentElement).getPropertyValue('--acc').trim()||col}
rs();window.addEventListener('resize',rs);
var still=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
function f(){x.clearRect(0,0,w,h);var n=Math.floor(w/9);x.fillStyle=col;for(var i=0;i<n;i++){var e=Math.sin(i*.35)*Math.sin(i*.11+t)*.5+.5,a=Math.max(4,e*h*(0.35+0.6*Math.abs(Math.sin(i*.07+t*.7))));x.globalAlpha=.35+.65*e;x.beginPath();x.roundRect?x.roundRect(i*9,(h-a)/2,5,a,3):x.rect(i*9,(h-a)/2,5,a);x.fill()}x.globalAlpha=1;t+=still?0:.04;requestAnimationFrame(f)}f()})();
/* code tabs */
var API='https://api.voxly.dev/v1/transcribe';
var CODE={
'cURL':`curl -X POST ${API} -H 'Authorization: Bearer YOUR_API_KEY' -F 'file=@meeting.mp4' -F 'language=en' -F 'speakers=true'`,
'JavaScript':`const form = new FormData();\nform.append('file', fileInput.files[0]);\nform.append('language', 'en');\nconst res = await fetch('${API}', {\n  method: 'POST',\n  headers: { Authorization: 'Bearer YOUR_API_KEY' },\n  body: form\n});\nconst { text, segments } = await res.json();`,
'Python':`import requests\n\nres = requests.post(\n    '${API}',\n    headers={'Authorization': 'Bearer YOUR_API_KEY'},\n    files={'file': open('meeting.mp4', 'rb')},\n    data={'language': 'en', 'speakers': 'true'},\n)\nprint(res.json()['text'])`,
'PHP':`$ch = curl_init('${API}');\ncurl_setopt_array($ch, [\n  CURLOPT_POST => true,\n  CURLOPT_HTTPHEADER => ['Authorization: Bearer YOUR_API_KEY'],\n  CURLOPT_POSTFIELDS => ['file' => new CURLFile('meeting.mp4'), 'language' => 'en'],\n  CURLOPT_RETURNTRANSFER => true,\n]);\n$out = json_decode(curl_exec($ch), true);\necho $out['text'];`,
'Go':`body := &bytes.Buffer{}\nw := multipart.NewWriter(body)\npart, _ := w.CreateFormFile("file", "meeting.mp4")\nio.Copy(part, f)\nw.Close()\nreq, _ := http.NewRequest("POST", "${API}", body)\nreq.Header.Set("Authorization", "Bearer YOUR_API_KEY")\nreq.Header.Set("Content-Type", w.FormDataContentType())\nres, _ := http.DefaultClient.Do(req)`};
var cur='cURL';
function showCode(k){cur=k;$('code').textContent=CODE[k];Array.prototype.forEach.call($('tabs').children,function(b){b.classList.toggle('on',b.textContent===k)})}
(function(){
var U=[
{n:'Students',h:'Never miss a lecture detail',d:'Record class and get notes you can search and study from.',f:'lecture-week-5.mp3',c:['Searchable notes','Key terms','Study summary'],t:'[00:00] Today we cover how photosynthesis turns light into chemical energy.\n[00:12] Remember: chlorophyll absorbs mostly red and blue light.\n[00:25] Exam tip: know the difference between the light and dark reactions.'},
{n:'Creators',h:'Subtitles in one click',d:'Caption your videos and reels, then export SRT for any editor.',f:'vlog-episode-12.mp4',c:['SRT subtitles','Captions','Show notes'],t:'1\n00:00:00,000 --> 00:00:03,000\nWelcome back to the channel!\n\n2\n00:00:03,000 --> 00:00:06,500\nToday we are building an app in one day.'},
{n:'Journalists',h:'Exact quotes, fast',d:'Turn interviews into text with speaker labels and timestamps.',f:'interview-mayor.m4a',c:['Speaker labels','Exact quotes','Fast turnaround'],t:'[00:03] Reporter: What is the plan for the new bridge?\n[00:08] Mayor: Construction starts in spring and finishes within a year.\n[00:19] Reporter: How will it be funded?'},
{n:'Teams',h:'Meetings that write themselves',d:'Get a summary and action items right after the call.',f:'weekly-sync.mp4',c:['Action items','Summaries','Shareable notes'],t:'Summary: Launch moved to Friday.\n\nAction items:\n- Ana: finalize the design\n- Ben: test the payment flow\n- Chris: send the announcement'}];
var still=window.matchMedia('(prefers-reduced-motion:reduce)').matches,tk=0,tab=$('utabs');
U.forEach(function(u,i){var b=document.createElement('button');b.className='tab';b.textContent=u.n;b.onclick=function(){show(i)};tab.appendChild(b)});
function show(i){var my=++tk,u=U[i];
Array.prototype.forEach.call(tab.children,function(b,j){b.classList.toggle('on',j===i)});
$('uh').textContent=u.h;$('ud').textContent=u.d;$('uf').textContent=u.f;
$('uc').textContent='';u.c.forEach(function(c){var s=document.createElement('span');s.className='chip';s.textContent=c;$('uc').appendChild(s)});
var el=$('ut'),k=0;el.textContent='';
if(still){el.textContent=u.t;return}
(function step(){if(my!==tk)return;k+=2;el.textContent=u.t.slice(0,k);if(k<u.t.length)setTimeout(step,22);else setTimeout(function(){if(my===tk)show((i+1)%U.length)},3500)})();}
show(0);
})();

/* scroll reveal */
(function(){var els=document.querySelectorAll('.rv');if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return}
var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');o.unobserve(e.target)}})},{threshold:.12});els.forEach(function(e){o.observe(e)})})();
/* live dictation */
(function(){var SR=window.SpeechRecognition||window.webkitSpeechRecognition,rec=null,on=false;
$('mic').onclick=function(){
if(!SR){$('st').textContent='Live dictation is not supported in this browser. Try Chrome or Safari.';return}
if(on){rec.stop();return}
rec=new SR();rec.continuous=true;rec.interimResults=true;rec.lang='en-US';var fin='';
rec.onstart=function(){on=true;$('mic').textContent='⏹ Stop';$('live').style.display='block';$('live').textContent='';$('st').textContent=''};
rec.onresult=function(e){var im='';for(var i=e.resultIndex;i<e.results.length;i++){var r=e.results[i];if(r.isFinal)fin+=r[0].transcript+' ';else im+=r[0].transcript}$('live').textContent=fin+im};
rec.onerror=function(e){$('st').textContent='Microphone error: '+e.error+'. Check your browser permissions.'};
rec.onend=function(){on=false;$('mic').textContent='🎤 Live dictate';if($('live').textContent.trim())$('ai2').style.display='flex'};
try{rec.start()}catch(e){}};})();
/* text to video */
(function(){
var PAL={Neon:[['#0f0c29','#302b63'],['#12c2e9','#c471ed'],['#f64f59','#302b63']],Sunset:[['#ff9966','#ff5e62'],['#614385','#516395'],['#f7971e','#ffd200']],Ocean:[['#0f2027','#2c5364'],['#00c6ff','#0072ff'],['#134e5e','#71b280']],Mono:[['#111','#333'],['#222','#555'],['#000','#444']]};
var SZ={'16:9':[640,360],'9:16':[360,640],'1:1':[480,480]},busy=false,url=null;
function scenes(p){var w=p.split(' ').filter(Boolean),n=Math.max(1,Math.min(5,Math.ceil(w.length/4))),per=Math.ceil(w.length/n),o=[];for(var i=0;i<n;i++){var s=w.slice(i*per,(i+1)*per).join(' ');if(s)o.push(s)}return o}
function frame(x,W,H,t,dur,sc,pal){
var n=sc.length,seg=dur/n,i=Math.min(n-1,Math.floor(t/seg)),u=(t-i*seg)/seg,c=pal[i%pal.length];
var g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,c[0]);g.addColorStop(1,c[1]);x.fillStyle=g;x.fillRect(0,0,W,H);
for(var k=0;k<7;k++){var bx=(Math.sin(t*.6+k*1.7+i)*.5+.5)*W,by=(Math.cos(t*.5+k*2.3)*.5+.5)*H,r=Math.min(W,H)*(.18+.1*Math.sin(k+t));var rg=x.createRadialGradient(bx,by,0,bx,by,r);rg.addColorStop(0,'rgba(255,255,255,.28)');rg.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=rg;x.beginPath();x.arc(bx,by,r,0,6.2832);x.fill()}
var a=Math.min(1,u*5)*Math.min(1,(1-u)*5),e=1-Math.pow(1-Math.min(1,u*3),3),fs=Math.round(Math.min(W,H)*.1);
x.font='800 '+fs+'px system-ui,sans-serif';x.textAlign='center';x.textBaseline='middle';
var words=sc[i].split(' '),lines=[],ln='';
words.forEach(function(w){var tt=ln?ln+' '+w:w;if(x.measureText(tt).width>W*.8&&ln){lines.push(ln);ln=w}else ln=tt});lines.push(ln);
x.save();x.translate(W/2,H/2);var s=.88+.12*e;x.scale(s,s);x.globalAlpha=a;x.fillStyle='#fff';x.shadowColor='rgba(0,0,0,.4)';x.shadowBlur=18;
lines.forEach(function(l,j){x.fillText(l,0,(j-(lines.length-1)/2)*fs*1.2)});x.restore();
x.globalAlpha=1;x.fillStyle='rgba(255,255,255,.85)';x.fillRect(0,H-5,W*(t/dur),5);
x.font='600 '+Math.round(fs*.3)+'px system-ui,sans-serif';x.textAlign='right';x.fillText('Voxly',W-12,H-18)}
function finish(blob,mt){
busy=false;$('tgo').disabled=false;$('tfill').style.width='100%';
if(blob){if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(blob);var v=$('tvid');v.src=url;v.style.display='block';$('tcv').style.display='none';try{v.play()}catch(e){}
var d=$('tdl');d.href=url;d.download=window.__vn='voxly-video.'+(mt.indexOf('mp4')>-1?'mp4':'webm');window.__vb=blob;d.style.display='inline-flex';$('tst').textContent='Done ✓ Your video is ready.'}
else $('tst').textContent='Preview only: this browser cannot save the video file.'}
function gen(p){var d=+$('tdur').value,n=d<=5?3:d<=8?4:5;$('tst').textContent='Writing the script with AI…';
AI('Write '+n+' short scene captions (4 to 9 words each) for a '+d+' second video about: '+p+'. Reply with only a JSON array of '+n+' strings, nothing else.').then(function(t){var a=JSON.parse(t.slice(t.indexOf('['),t.lastIndexOf(']')+1));a=a.filter(function(s){return typeof s==='string'&&s.trim()}).slice(0,5);return a.length?a:null}).catch(function(){return null}).then(function(a){render(p,a)})}
function render(p,sc0){
var sz=SZ[$('tasp').value],W=sz[0],H=sz[1],dur=+$('tdur').value,pal=PAL[$('tsty').value],sc=(sc0&&sc0.length?sc0:scenes(p)),cv=$('tcv'),x=cv.getContext('2d');
cv.width=W;cv.height=H;$('tvid').style.display='none';cv.style.display='block';$('tdl').style.display='none';$('tout').style.display='block';$('tst').textContent='Rendering video…';
var rec=null,parts=[],mt='';
try{if(window.MediaRecorder&&cv.captureStream){['video/webm;codecs=vp9','video/webm','video/mp4'].some(function(m){if(MediaRecorder.isTypeSupported(m)){mt=m;return true}return false});
if(mt){rec=new MediaRecorder(cv.captureStream(30),{mimeType:mt});rec.ondataavailable=function(e){if(e.data&&e.data.size)parts.push(e.data)};rec.start()}}}catch(e){rec=null}
var t0=performance.now();
function loop(){var t=(performance.now()-t0)/1000;
if(t>=dur){frame(x,W,H,dur-.001,dur,sc,pal);if(rec){rec.onstop=function(){finish(new Blob(parts,{type:mt}),mt)};try{rec.stop()}catch(e){finish(null)}}else finish(null);return}
frame(x,W,H,t,dur,sc,pal);$('tfill').style.width=(35+65*t/dur)+'%';requestAnimationFrame(loop)}
loop()}
$('tgo').onclick=function(){
var p=$('tp').value.split('\n').join(' ').trim();
if(!p){$('tst').textContent='Describe your video first.';return}
if(busy)return;busy=true;$('tgo').disabled=true;$('tout').style.display='none';$('tbar').style.display='block';$('tfill').style.width='0';
var steps=['Understanding your prompt…','Writing the storyboard…','Generating scenes…'],k=0;
(function next(){if(k<steps.length){$('tst').textContent=steps[k];$('tfill').style.width=(k+1)*10+'%';k++;setTimeout(next,700)}else gen(p)})();
};
})();
/* youtube lecture translator */
(function(){
var ORI=['Welcome to today’s lecture on machine learning.','Machine learning is a way for computers to learn patterns from data.','There are two main types: supervised and unsupervised learning.','In supervised learning, we train a model using labeled examples.','For homework, try training a simple model on the sample dataset.'],
TS=['00:04','00:15','00:31','00:48','01:05'],
T={fil:{n:'Filipino',s:'Panimula sa machine learning: kung paano natututo ang mga computer mula sa datos, supervised vs. unsupervised, at takdang-aralin.',l:['Maligayang pagdating sa lektura natin ngayon tungkol sa machine learning.','Ang machine learning ay paraan para matuto ang mga computer ng mga pattern mula sa datos.','May dalawang pangunahing uri: supervised at unsupervised learning.','Sa supervised learning, sinasanay natin ang isang modelo gamit ang mga halimbawang may label.','Bilang takdang-aralin, subukang magsanay ng simpleng modelo gamit ang sample na dataset.']},
es:{n:'Spanish',s:'Introducción al aprendizaje automático: cómo aprenden las computadoras de los datos, supervisado vs. no supervisado y una tarea.',l:['Bienvenidos a la clase de hoy sobre aprendizaje automático.','El aprendizaje automático es una forma de que las computadoras aprendan patrones a partir de datos.','Hay dos tipos principales: aprendizaje supervisado y no supervisado.','En el aprendizaje supervisado, entrenamos un modelo con ejemplos etiquetados.','Como tarea, intenten entrenar un modelo sencillo con el conjunto de datos de ejemplo.']},
fr:{n:'French',s:'Introduction à l’apprentissage automatique : comment les ordinateurs apprennent des données, supervisé vs non supervisé, et un devoir.',l:['Bienvenue au cours d’aujourd’hui sur l’apprentissage automatique.','L’apprentissage automatique permet aux ordinateurs d’apprendre des motifs à partir des données.','Il existe deux grands types : l’apprentissage supervisé et non supervisé.','Dans l’apprentissage supervisé, on entraîne un modèle avec des exemples étiquetés.','Pour les devoirs, essayez d’entraîner un modèle simple sur le jeu de données d’exemple.']},
ja:{n:'Japanese',s:'機械学習入門：コンピュータがデータから学ぶ仕組み、教師あり学習と教師なし学習、そして宿題。',l:['今日の機械学習の講義へようこそ。','機械学習とは、コンピュータがデータからパターンを学ぶ方法です。','主な種類は、教師あり学習と教師なし学習の二つです。','教師あり学習では、ラベル付きの例を使ってモデルを訓練します。','宿題として、サンプルデータセットで簡単なモデルを訓練してみてください。']},
ko:{n:'Korean',s:'머신러닝 입문: 컴퓨터가 데이터에서 배우는 방식, 지도 학습과 비지도 학습, 그리고 숙제.',l:['오늘의 머신러닝 강의에 오신 것을 환영합니다.','머신러닝은 컴퓨터가 데이터에서 패턴을 배우는 방법입니다.','크게 지도 학습과 비지도 학습, 두 가지 유형이 있습니다.','지도 학습에서는 레이블이 있는 예제로 모델을 훈련합니다.','숙제로 샘플 데이터셋으로 간단한 모델을 훈련해 보세요.']}},
busy=false,out='',fname='';
function vid(s){var u;try{u=new URL(s.trim())}catch(e){return ''}
var h=u.hostname.split('www.').join(''),id='';
if(h==='youtu.be')id=u.pathname.slice(1).split('/')[0];
else if(h==='youtube.com'||h==='m.youtube.com'||h==='music.youtube.com'){id=u.searchParams.get('v')||'';if(!id){var p=u.pathname.split('/');if(['shorts','embed','live'].indexOf(p[1])>-1)id=p[2]||''}}
if(id.length!==11)return '';
for(var i=0;i<11;i++){if('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-'.indexOf(id[i])<0)return ''}
return id}
T.zh={n:'Chinese',s:'机器学习入门：计算机如何从数据中学习、监督学习与无监督学习，以及一项作业。',l:['欢迎来到今天的机器学习课程。','机器学习是让计算机从数据中学习规律的一种方法。','主要有两种类型：监督学习和无监督学习。','在监督学习中，我们使用带标签的示例来训练模型。','作业：请尝试用示例数据集训练一个简单的模型。']};
T.de={n:'German',s:'Einführung in maschinelles Lernen: wie Computer aus Daten lernen, überwachtes vs. unüberwachtes Lernen und eine Hausaufgabe.',l:['Willkommen zur heutigen Vorlesung über maschinelles Lernen.','Maschinelles Lernen ist eine Methode, mit der Computer Muster aus Daten lernen.','Es gibt zwei Haupttypen: überwachtes und unüberwachtes Lernen.','Beim überwachten Lernen trainieren wir ein Modell mit beschrifteten Beispielen.','Als Hausaufgabe trainiert bitte ein einfaches Modell mit dem Beispieldatensatz.']};
T.pt={n:'Portuguese',s:'Introdução ao aprendizado de máquina: como os computadores aprendem com dados, supervisionado vs. não supervisionado e uma tarefa de casa.',l:['Bem-vindos à aula de hoje sobre aprendizado de máquina.','Aprendizado de máquina é uma forma de os computadores aprenderem padrões a partir de dados.','Existem dois tipos principais: aprendizado supervisionado e não supervisionado.','No aprendizado supervisionado, treinamos um modelo com exemplos rotulados.','Como tarefa de casa, tentem treinar um modelo simples com o conjunto de dados de exemplo.']};
T.it={n:'Italian',s:'Introduzione all’apprendimento automatico: come i computer imparano dai dati, supervisionato vs. non supervisionato e un compito a casa.',l:['Benvenuti alla lezione di oggi sull’apprendimento automatico.','L’apprendimento automatico è un modo per far imparare ai computer schemi dai dati.','Ci sono due tipi principali: apprendimento supervisionato e non supervisionato.','Nell’apprendimento supervisionato, addestriamo un modello con esempi etichettati.','Per compito a casa, provate ad addestrare un modello semplice con il dataset di esempio.']};
function real(tx,k){var L=T[k];if(busy)return;busy=true;$('yg').disabled=true;$('yo').style.display='none';$('yb').style.display='block';$('yf').style.width='45%';$('ys').textContent='Translating to '+L.n+'…';
AI('Translate the following text into '+L.n+'. Reply with the translation only, no notes or quotes.\n\n'+tx).then(function(a){a=a.trim();$('yrows').textContent='';row('','Original',L.n,'yh');row('',tx,a);$('ysm').textContent='Translated live by AI';$('yba').textContent='';['Text','Auto-detect → '+L.n].forEach(function(b){var e=document.createElement('span');e.className='badge';e.textContent=b;$('yba').appendChild(e)});out=L.n+' translation\n\n'+a;fname='translation-'+k+'.txt';$('yb').style.display='none';$('yo').style.display='block';$('ys').textContent='Done ✓'},function(){$('yb').style.display='none';$('ys').textContent='Live translation needs AI access. Open this page in Claude and allow it when asked.'}).then(function(){busy=false;$('yg').disabled=false})}
function src(s){var u;s=s.trim();if(s&&s.indexOf('://')<0)s='https://'+s;try{u=new URL(s)}catch(e){return ''}
if((u.protocol!=='http:'&&u.protocol!=='https:')||u.hostname.indexOf('.')<0)return '';
var h=u.hostname.split('www.').join(''),p=u.pathname.toLowerCase(),M=[['youtu','YouTube'],['tiktok','TikTok'],['facebook','Facebook'],['fb.watch','Facebook'],['instagram','Instagram'],['vimeo','Vimeo'],['twitter','X'],['drive.google','Google Drive'],['dropbox','Dropbox'],['spotify','Spotify'],['soundcloud','SoundCloud'],['zoom','Zoom']],i;
for(i=0;i<M.length;i++){if(h.indexOf(M[i][0])>-1)return M[i][1]}
var ext=p.split('.').pop();
if(['mp3','wav','m4a','ogg','aac','flac'].indexOf(ext)>-1)return 'Audio file';
if(['mp4','mov','webm','mkv','avi'].indexOf(ext)>-1)return 'Video file';
return 'Web page'}
function row(a,b,c,cls){var r=document.createElement('div');r.className='yr '+(cls||'');[a,b,c].forEach(function(t,i){var d=document.createElement('div');if(i===2)d.className='tr';d.textContent=t;r.appendChild(d)});$('yrows').appendChild(r)}
function show(id,k){
var L=T[k];$('yrows').textContent='';row('','Original (English)',L.n,'yh');
ORI.forEach(function(o,i){row(TS[i],o,L.l[i])});
$('ysm').textContent='Summary: '+L.s;$('yba').textContent='';
['Source: '+id,'English → '+L.n,ORI.length+' segments'].forEach(function(b){var e=document.createElement('span');e.className='badge';e.textContent=b;$('yba').appendChild(e)});
out=L.n+' translation\n'+L.s+'\n\n'+L.l.map(function(l,i){return '['+TS[i]+'] '+l}).join('\n');fname='transcript-'+k+'.txt';
$('yb').style.display='none';$('yo').style.display='block';$('ys').textContent='Done ✓';busy=false;$('yg').disabled=false}
$('yg').onclick=function(){
var raw=$('yl').value.trim(),id=src(raw),k=$('yt').value;if(!id&&raw.split(' ').length>2){real(raw,k);return}
if(!id){$('ys').textContent='That does not look like a valid link. Paste a full address, like https://example.com/lecture';return}
if(busy)return;busy=true;$('yg').disabled=true;$('yo').style.display='none';$('yb').style.display='block';$('yf').style.width='0';
var steps=['Opening the link…','Extracting the audio and text…','Transcribing…','Translating to '+T[k].n+'…'],i=0;
(function next(){if(i<steps.length){$('ys').textContent=steps[i];i++;$('yf').style.width=(i*24)+'%';setTimeout(next,650)}else{$('yf').style.width='100%';show(id,k)}})();
};
$('ycp').onclick=function(){try{navigator.clipboard.writeText(out);$('ycp').textContent='Copied ✓'}catch(e){$('ycp').textContent='Press Ctrl+C'}setTimeout(function(){$('ycp').textContent='Copy translation'},1500)};
$('ydl').onclick=function(){dl(fname,out)};
})();
/* theme, AI tools, pricing toggle */
(function(){
var r=document.documentElement;
var A={s:'Summary: the team recapped last week, reviewed the latest results, and agreed to assign owners and set deadlines for each task.',a:'Action items:\n• Double-check the data\n• Assign an owner for each task\n• Set a deadline\n• Send the notes after the call',p:'Key points:\n• Goal: make the process faster and easier for users\n• Results look good but still need verification\n• Every task needs an owner and a deadline'};
Array.prototype.forEach.call($('ai').children,function(b){b.onclick=function(){Array.prototype.forEach.call($('ai').children,function(x){x.classList.toggle('on',x===b)});var e=$('aib');e.style.display='block';e.textContent=A[b.dataset.k]}});
function price(y){$('pm').classList.toggle('on',!y);$('py').classList.toggle('on',y);Array.prototype.forEach.call(document.querySelectorAll('[data-m]'),function(s){s.textContent='$'+(y?s.dataset.y:s.dataset.m)})}
$('pm').onclick=function(){price(false)};$('py').onclick=function(){price(true)};
})();
/* real transcription (Whisper in the browser) with an honest fallback */
(function(){
var asr=null,fin0=finish,orig=$('go').onclick;
function banner(msg){var b=$('smp');if(!b){b=document.createElement('div');b.id='smp';b.className='ysum';$('out').insertBefore(b,$('badges'))}b.style.display=msg?'block':'none';b.textContent=msg||''}
function after(real){var bs=$('badges').children;if(bs.length)bs[bs.length-1].textContent=real?'Whisper · on-device':'Sample only';
$('st').textContent=real?'Done ✓ Transcribed on your device':'Sample result (demo)';
$('ai').style.display=real?'flex':'none';$('aib').style.display='none';
banner(real?'':('SAMPLE ONLY: this is placeholder text that shows the layout. It is NOT what is said in your file. '+(window.__why||'')+' Real transcription runs in the downloaded version (internet needed the first time).'))}
finish=function(){var r=!!window.__real;fin0();after(r)};
$('go').onclick=async function(){
if(!file)return;
$('go').disabled=true;$('out').style.display='none';$('bar').style.display='block';$('fill').style.width='3%';window.__why='';window.__real=null;
var stage='model';
try{
$('st').textContent='Loading the speech model (first time only)…';
if(!asr){var m=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.2');
asr=await m.pipeline('automatic-speech-recognition','Xenova/whisper-tiny.en',{progress_callback:function(p){if(p&&p.status==='progress'&&p.progress!=null){$('fill').style.width=(5+p.progress*.5)+'%';$('st').textContent='Downloading the speech model… '+Math.round(p.progress)+'%'}}})}
stage='audio';$('st').textContent='Reading your audio…';$('fill').style.width='60%';
var buf=await file.arrayBuffer(),ctx=new (window.AudioContext||window.webkitAudioContext)({sampleRate:16000}),ab=await ctx.decodeAudioData(buf),d0=ab.getChannelData(0),data=d0;
if(ab.numberOfChannels>1){var d1=ab.getChannelData(1);data=new Float32Array(d0.length);for(var i=0;i<d0.length;i++)data[i]=(d0[i]+d1[i])/2}
stage='asr';$('st').textContent='Transcribing… this can take a few minutes';$('fill').style.width='75%';
var r=await asr(data,{chunk_length_s:30,stride_length_s:5,return_timestamps:true});
var ch=(r.chunks||[]).filter(function(c){return c.text&&c.text.trim()});
if(!ch.length)throw new Error('empty');
window.__real=ch.map(function(c){return{t:(c.timestamp&&c.timestamp[0]!=null)?c.timestamp[0]:0,s:'',x:c.text.trim()}});
$('go').disabled=false;finish();
}catch(e){
window.__why=stage==='model'?'The speech model could not load here (it needs the downloaded version and internet).':stage==='audio'?'This audio format could not be read by the browser.':'Transcription failed.';
orig();
}
};
})();
/* saving files on any device */
(function(){
var OK=['gif','png','jpg','jpeg','webp','mp4','webm','mov','txt','json','md','docx','pptx','epub','csv','ttf','html','svg','pdf','xlsx','zip','fig'];
function local(name,data){var u=URL.createObjectURL(data instanceof Blob?data:new Blob([data],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(u)},1000)}
window.SAVE=function(name,data){var c=window.claude;
if(!c||!c.use){local(name,data);return}
c.use('downloads').then(function(d){if(!d){local(name,data);return}
var ext=name.split('.').pop().toLowerCase();
return d.save({filename:OK.indexOf(ext)>-1?name:name+'.txt',data:data}).catch(function(e){if(!e||e.code!=='declined')local(name,data)})}).catch(function(){local(name,data)})};
$('tdl').onclick=function(e){e.preventDefault();if(window.__vb)window.SAVE(window.__vn,window.__vb)};
})();
/* ai */
(function(){
window.AI=function(q){var c=window.claude;if(!c||!c.use)return Promise.reject(new Error('na'));return c.use('sample').then(function(s){if(!s)throw new Error('na');return s(q)}).then(function(r){return r.text})};
var I={s:'Summarize this transcript in 2 or 3 sentences.',a:'List the action items from this transcript as short bullet lines starting with the • character. If there are none, say so.',p:'List the 3 to 5 key points of this transcript as short bullet lines starting with the • character.'};
function basic(k,t){var P=t.split('\n').map(function(x){x=x.trim();var i=x.indexOf('] ');if(x.charAt(0)==='['&&i>-1)x=x.slice(i+2);return x}).filter(Boolean);
if(P.length<3)P=t.split('. ').map(function(x){return x.trim()}).filter(Boolean);
var note='\n\n(Basic mode: no AI connected.)';
if(k==='s')return 'Summary: '+P.slice(0,2).join(' ')+' ... '+P[P.length-1]+note;
if(k==='p')return 'Key points:\n'+P.slice().sort(function(a,b){return b.length-a.length}).slice(0,4).map(function(x){return '• '+x}).join('\n')+note;
var W=['need','should','must','will','send','check','assign','deadline','follow up','remember','todo','to-do'],A=P.filter(function(x){var l=x.toLowerCase();return W.some(function(w){return l.indexOf(w)>-1})});
return 'Action items:\n'+(A.length?A.map(function(x){return '• '+x}).join('\n'):'None found.')+note}
function wire(row,box,get){Array.prototype.forEach.call(row.children,function(b){b.onclick=function(){var t=get();box.style.display='block';
if(!t){box.textContent='Nothing to analyze yet.';return}
Array.prototype.forEach.call(row.children,function(x){x.classList.toggle('on',x===b)});box.textContent='Thinking…';
AI(I[b.dataset.k]+' Reply in plain text only, no markdown, no preamble.\n\nTranscript:\n'+t).then(function(x){box.textContent=x.trim()},function(){box.textContent=basic(b.dataset.k,t)})}})}
wire($('ai'),$('aib'),function(){return segs.length?txt():''});
wire($('ai2'),$('aib2'),function(){return $('live').textContent.trim()});
})();
/* extra polish */
(function(){
var still=window.matchMedia('(prefers-reduced-motion:reduce)').matches;
var F=['MP3','MP4','WAV','M4A','MOV','WEBM','SRT','TXT','YouTube','TikTok','Vimeo','Zoom','Filipino','Spanish','French','Japanese','Korean','Chinese','German','Portuguese','Italian'],m=$('mqt');
for(var r=0;r<2;r++)F.forEach(function(f){var s=document.createElement('span');s.textContent=f;m.appendChild(s)});
document.addEventListener('pointermove',function(e){var c=e.target.closest?e.target.closest('.card'):null;if(c){var b=c.getBoundingClientRect();c.style.setProperty('--mx',(e.clientX-b.left)+'px');c.style.setProperty('--my',(e.clientY-b.top)+'px')}});
var sp=$('sp');function pg(){var h=document.documentElement.scrollHeight-window.innerHeight;sp.style.width=(h>0?window.scrollY/h*100:0)+'%'}
window.addEventListener('scroll',pg,{passive:true});pg();
if(!still){var W=['text','subtitles','notes','captions','scripts'],wi=0,hs=document.querySelector('h1 span');setInterval(function(){hs.style.opacity=0;hs.style.transform='translateY(8px)';setTimeout(function(){wi=(wi+1)%W.length;hs.textContent=W[wi];hs.style.opacity=1;hs.style.transform='none'},250)},2400)}
function cu(b){var t=b.textContent,n=parseFloat(t),d=(String(n).split('.')[1]||'').length,sx=t.slice(String(n).length),t0=performance.now();(function st(now){var p=Math.min(1,(now-t0)/1200),e=1-Math.pow(1-p,3);b.textContent=(n*e).toFixed(d)+sx;if(p<1)requestAnimationFrame(st)})(t0)}
if(!still&&'IntersectionObserver' in window){var o=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){cu(e.target);o.unobserve(e.target)}})},{threshold:.6});document.querySelectorAll('.stats b').forEach(function(b){o.observe(b)})}
})();
