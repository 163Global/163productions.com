(function(){
  // header menu (phones)
  var btn=document.querySelector('.menu-btn'), nav=document.getElementById('nav');
  if(btn&&nav){
    btn.addEventListener('click',function(){var o=nav.classList.toggle('open');btn.setAttribute('aria-expanded',o?'true':'false');});
    nav.addEventListener('click',function(e){if(e.target.tagName==='A'){nav.classList.remove('open');btn.setAttribute('aria-expanded','false');}});
  }
  // quote form: posts JSON to the form endpoint (see web/quote-form in the planning repo)
  var f=document.getElementById('quote'); if(!f) return;
  var EMAIL='support@163productions.com';
  var KEY='sb_publishable_iJNkRKqNCZn1qyu_6_Yk4Q_8muRuww9'; // public by design: can only call submit_163_inquiry
  document.getElementById('q-started').value=String(Date.now());
  var msg=document.getElementById('q-msg'), send=document.getElementById('q-send');
  function val(n){return (f.elements[n].value||'').trim();}
  function fail(t){msg.className='form-msg err';msg.textContent=t;send.disabled=false;send.textContent='Send';}
  f.addEventListener('submit',function(e){
    e.preventDefault();
    var need=['race_org','name','email'];
    for(var i=0;i<need.length;i++){ if(!val(need[i])){ f.elements[need[i]].focus(); return fail('Please fill in your race organization, name and email.'); } }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val('email'))){ f.elements.email.focus(); return fail('That email address doesn\'t look right.'); }
    var url=f.getAttribute('data-endpoint');
    if(!url) return fail('Something went wrong sending this. Please email us at '+EMAIL+'.');
    var data={race_org:val('race_org'),name:val('name'),email:val('email'),phone:val('phone')};
    var bot=val('website')!==''||(Date.now()-Number(val('started')||0))<3000;
    send.disabled=true; send.textContent='Sending…'; msg.className='form-msg'; msg.textContent='';
    (bot?Promise.resolve({json:function(){return {ok:true};}}):
    fetch(url,{method:'POST',headers:{'Content-Type':'application/json','apikey':KEY},
      body:JSON.stringify({p_race_org:data.race_org,p_name:data.name,p_email:data.email,p_phone:data.phone,p_page:location.href})}))
      .then(function(r){return r.json();})
      .then(function(j){
        if(!j||!j.ok) throw new Error(j&&j.error||'failed');
        var done=document.createElement('p'); done.className='quote-done'; done.setAttribute('role','status');
        done.textContent='Thanks, '+data.name+'. We\'ve got your details and will be in touch.';
        document.getElementById('quote-wrap').replaceChildren(done);
        if(window.plausible) window.plausible('Quote request');
      })
      .catch(function(){ fail('Something went wrong sending this. Please email us at '+EMAIL+'.'); });
  });
})();
(function(){
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // live bug clock (sample race time)
  var clock = document.getElementById('clock'), s = 2*3600+14*60+7;
  function pad(n){return (n<10?'0':'')+n}
  if(clock && !reduced) setInterval(function(){ s++; clock.textContent = pad(Math.floor(s/3600))+':'+pad(Math.floor(s/60)%60)+':'+pad(s%60); }, 1000);

  // Seen Report blocks: 180 minutes, logo on screen ~41 of them, in runs
  var b = document.getElementById('blocks');
  if(b){
    var on = [3,4,5,11,12,19,20,21,22,30,31,38,44,45,46,52,60,61,67,68,69,75,83,84,90,91,98,104,105,112,119,120,126,133,134,141,147,155,162,170,176];
    var html = '';
    for(var i=0;i<180;i++){ html += '<i class="'+(i===105?'peak':(on.indexOf(i)>-1?'on':''))+'"></i>'; }
    b.innerHTML = html;
  }

  // course map, from the brand book's pixel system
  var cv = document.getElementById('course'); if(!cv) return;
  var ctx = cv.getContext('2d'), W = cv.width, H = cv.height, P = 12, S = 8;
  var pts = [[60,430],[170,400],[230,330],[330,320],[400,250],[380,170],[470,110],[590,130],[640,210],[720,250],[800,200],[880,120],[990,110],[1060,190],[1040,290],[1110,360],[1080,440],[960,460],[860,420],[760,460],[640,450],[520,400],[420,440],[300,470],[160,470],[60,430]];
  var cells = [], seen = {};
  for(var i=0;i<pts.length-1;i++){
    var x0=pts[i][0],y0=pts[i][1],x1=pts[i+1][0],y1=pts[i+1][1], n=Math.ceil(Math.hypot(x1-x0,y1-y0)/3);
    for(var k=0;k<=n;k++){ var cx=Math.round((x0+(x1-x0)*k/n)/P), cy=Math.round((y0+(y1-y0)*k/n)/P), key=cx+','+cy; if(!seen[key]){seen[key]=1; cells.push([cx,cy]);} }
  }
  var MILES = 480, marks = [0,100,212,300,400], t = Math.round(cells.length*212/MILES), read = document.getElementById('rmread');
  function draw(){
    ctx.fillStyle='#0B0D10'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle='#171b21'; for(var x=0;x<W;x+=P*4) for(var y=0;y<H;y+=P*4) ctx.fillRect(x+2,y+2,2,2);
    ctx.fillStyle='#3a4048'; cells.forEach(function(c){ctx.fillRect(c[0]*P-S/2,c[1]*P-S/2,S,S)});
    for(var k=1;k<=10;k++){ var c=cells[(t-k+cells.length)%cells.length]; ctx.fillStyle='rgba(255,176,0,'+(0.5-k*0.045)+')'; ctx.fillRect(c[0]*P-S/2,c[1]*P-S/2,S,S); }
    ctx.font='500 18px "IBM Plex Mono", monospace';
    marks.forEach(function(m){ var c=cells[Math.min(cells.length-1,Math.round(cells.length*m/MILES))]; ctx.fillStyle='#ECEDE9'; ctx.fillRect(c[0]*P-S/2,c[1]*P-S/2,S,S); ctx.fillStyle='#B5A182'; ctx.fillText('RM '+m, c[0]*P+12, c[1]*P-12); });
    var c=cells[t]; ctx.fillStyle='#FFB000'; ctx.fillRect(c[0]*P-S,c[1]*P-S,S*2,S*2);
    if(read) read.textContent='RM '+(t/cells.length*MILES).toFixed(1);
  }
  draw();
  if(!reduced) setInterval(function(){ t=(t+1)%cells.length; draw(); }, 140);
})();

(function(){
  // "Show more" sections are always open above phone width
  if(matchMedia('(min-width:901px)').matches) document.querySelectorAll('details.more').forEach(function(d){d.open=true;});
  // YouTube: load the player only when tapped
  document.querySelectorAll('.yt').forEach(function(y){
    var b=y.querySelector('button'); if(!b) return;
    b.addEventListener('click',function(){
      var f=document.createElement('iframe');
      f.src='https://www.youtube-nocookie.com/embed/'+y.dataset.yt+'?autoplay=1&start='+(y.dataset.start||0);
      f.title='Baja Nevada 2026 day 2 broadcast'; f.allow='autoplay; encrypted-media; picture-in-picture; fullscreen'; f.allowFullscreen=true;
      y.replaceChildren(f);
    });
  });
})();
