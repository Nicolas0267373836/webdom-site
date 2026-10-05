(function(){
  "use strict";
  var doc=document.documentElement;
  doc.classList.add("js");
  var reduce=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var WA="https://wa.me/18299782833?text=";
  var PLANS={
    basico:{name:"Básico",cuota:5500,cuotas:16500,unico:15000},
    estandar:{name:"Estándar",cuota:8800,cuotas:26400,unico:24000},
    premium:{name:"Premium",cuota:11000,cuotas:33000,unico:30000}
  };
  var mode="cuotas";
  function money(n){return "RD$"+String(n).replace(/\B(?=(\d{3})+(?!\d))/g,",");}
  var MSG={
    general:"Hola WebDom, quiero conversar sobre una página web para mi negocio.",
    proyectos:"Hola WebDom, vi sus proyectos y quiero una web para mi negocio.",
    especial:"Hola WebDom, tengo requerimientos especiales para mi web y quiero una propuesta.",
    duda:"Hola WebDom, tengo una pregunta sobre sus páginas web.",
    catalogo:"Hola WebDom, quiero cotizar un catálogo para mi negocio.",
    tienda:"Hola WebDom, quiero cotizar una tienda online para mi negocio.",
    sistema:"Hola WebDom, quiero cotizar un sistema web para mi negocio.",
    web:"Hola WebDom, quiero una página web para mi negocio.",
    precios:"Hola WebDom, vi sus precios y quiero una web para mi negocio."
  };
  function planMsg(key){
    var p=PLANS[key];
    return mode==="unico"
      ? "Hola WebDom, me gustaría iniciar el Plan "+p.name+" con pago único de "+money(p.unico)+"."
      : "Hola WebDom, me gustaría iniciar el Plan "+p.name+" en 3 pagos de "+money(p.cuota)+" (total "+money(p.cuotas)+").";
  }
  /* Referencias: dominio donde viven los enlaces que se generan (cámbialo si la web se publica en otro dominio) */
  var SITE="https://www.webdom.tech/";
  function noAccents(s){s=String(s);return s.normalize?s.normalize("NFD").replace(/[̀-ͯ]/g,""):s;}
  function cleanCode(s){return noAccents(s).toUpperCase().trim().replace(/\s+/g,"-").replace(/[^A-Z0-9_-]/g,"").replace(/-{2,}/g,"-").replace(/^[-_]+|[-_]+$/g,"").slice(0,20);}
  /* Si la visita llega con ?ref=CODIGO, el código viaja en todos los mensajes de WhatsApp */
  var REF=(function(){try{var m=/[?&]ref=([^&#]+)/i.exec(window.location.search);return m?cleanCode(decodeURIComponent(m[1].replace(/\+/g," "))):"";}catch(e){return "";}})();
  function withRef(t){return REF?t+" (Código de referencia: "+REF+")":t;}
  function setWaLinks(){
    document.querySelectorAll("[data-wa]").forEach(function(a){
      var k=a.getAttribute("data-wa"), text;
      if(k==="plan"){text=planMsg(a.closest("[data-plan]").getAttribute("data-plan"));}
      else{text=MSG[k]||MSG.general;}
      a.href=WA+encodeURIComponent(withRef(text));
    });
  }
  setWaLinks();

  /* Enlaces internos: en local (file://) apuntan a index.html y, si hay ?ref, el código pasa de página en página */
  (function(){
    var isFile=window.location.protocol==="file:";
    if(!isFile&&!REF)return;
    document.querySelectorAll("a[href]").forEach(function(a){
      var h=a.getAttribute("href"),hash="",q="",i;
      if(!h||/^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i.test(h))return;
      i=h.indexOf("#");if(i>-1){hash=h.slice(i);h=h.slice(0,i);}
      i=h.indexOf("?");if(i>-1){q=h.slice(i);h=h.slice(0,i);}
      if(isFile&&(h===""||h.charAt(h.length-1)==="/"))h+="index.html";
      if(REF&&!/[?&]ref=/.test(q))q+=(q?"&":"?")+"ref="+encodeURIComponent(REF);
      a.setAttribute("href",h+q+hash);
    });
  })();

  /* Estado de éxito en botones que abren WhatsApp */
  document.addEventListener("click",function(e){
    var b=e.target.closest(".btn[href*='wa.me']");
    if(!b||b.getAttribute("aria-disabled")==="true")return;
    b.classList.add("is-loading");
    setTimeout(function(){b.classList.remove("is-loading");b.classList.add("is-success");},reduce?0:450);
    setTimeout(function(){b.classList.remove("is-success");},2400);
  });

  /* Encabezado */
  var header=document.getElementById("header"), lastY=0;
  function onScrollHeader(){
    var y=window.scrollY;
    header.classList.toggle("is-scrolled",y>8);
    if(Math.abs(y-lastY)<5)return;
    if(y>lastY&&y>420&&!menu.classList.contains("is-open"))header.classList.add("is-hidden");
    else header.classList.remove("is-hidden");
    lastY=y;
  }

  /* Menú */
  var menu=document.getElementById("menu"), openBtn=document.getElementById("menuOpen"), closeBtn=document.getElementById("menuClose");
  function openMenu(){menu.classList.add("is-open");openBtn.setAttribute("aria-expanded","true");document.body.style.overflow="hidden";setTimeout(function(){closeBtn.focus();},60);}
  function closeMenu(focus){menu.classList.remove("is-open");openBtn.setAttribute("aria-expanded","false");document.body.style.overflow="";if(focus!==false)openBtn.focus();}
  openBtn.addEventListener("click",openMenu);
  closeBtn.addEventListener("click",function(){closeMenu();});
  menu.querySelectorAll("[data-close]").forEach(function(a){a.addEventListener("click",function(){closeMenu(false);});});
  document.addEventListener("keydown",function(e){
    if(!menu.classList.contains("is-open"))return;
    if(e.key==="Escape"){closeMenu();}
    if(e.key==="Tab"){
      var f=menu.querySelectorAll("a,button"), first=f[0], last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });

  /* Cinta de luz generativa */
  function Ribbon(canvas,opt){
    this.c=canvas;this.ctx=canvas.getContext("2d");this.o=opt;this.t=opt.seed||0;this.running=false;this.visible=true;
    var self=this;
    this.resize();
    if("ResizeObserver" in window){new ResizeObserver(function(){self.resize();}).observe(canvas);}
    else window.addEventListener("resize",function(){self.resize();});
    if("IntersectionObserver" in window){
      new IntersectionObserver(function(en){self.visible=en[0].isIntersecting;if(self.visible)self.start();}).observe(canvas);
    }
    this.draw();
    this.start();
  }
  Ribbon.prototype.resize=function(){
    var r=this.c.getBoundingClientRect(), d=Math.min(window.devicePixelRatio||1,2);
    this.d=d;this.w=Math.max(1,Math.round(r.width*d));this.h=Math.max(1,Math.round(r.height*d));
    this.c.width=this.w;this.c.height=this.h;this.draw();
  };
  Ribbon.prototype.start=function(){
    if(reduce||this.running)return;this.running=true;var self=this,prev=performance.now();
    function loop(now){
      if(!self.visible||document.hidden){self.running=false;return;}
      self.t+=Math.min(64,now-prev)*0.00022*self.o.speed;prev=now;self.draw();requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  };
  Ribbon.prototype.draw=function(){
    var ctx=this.ctx,w=this.w,h=this.h,o=this.o,t=this.t,n=o.lines,i,x,step=Math.max(4,6*this.d);
    ctx.globalCompositeOperation="source-over";
    var g=ctx.createLinearGradient(0,0,w,h);g.addColorStop(0,"#1E0D2C");g.addColorStop(1,"#0F0716");
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);
    ctx.globalCompositeOperation="lighter";ctx.lineWidth=Math.max(1,this.d*0.9);
    for(i=0;i<n;i++){
      var k=i/(n-1),r,gg,b,a;
      if(k<.55){var m=k/.55;r=110+(255-110)*m;gg=40+(105-40)*m;b=170+(76-170)*m;}
      else{var m2=(k-.55)/.45;r=255;gg=105+(225-105)*m2;b=76+(205-76)*m2;}
      a=o.alpha*(0.25+0.75*Math.sin(Math.PI*k));
      ctx.strokeStyle="rgba("+(r|0)+","+(gg|0)+","+(b|0)+","+a.toFixed(3)+")";
      ctx.beginPath();
      for(x=-w*.05;x<=w*1.05;x+=step){
        var nx=x/w;
        var spread=(k-.5)*o.spread*Math.cos(nx*2.3+t*1.1+1.1);
        var wave=o.amp*Math.sin(nx*3.0+t*1.6+k*2.4)*(0.6+0.4*Math.sin(nx*1.6-t*0.8+k*1.3));
        var y=h*(o.center+spread+wave+o.tilt*(nx-.5));
        if(x<=-w*.05)ctx.moveTo(x,y);else ctx.lineTo(x,y);
      }
      ctx.stroke();
    }
    ctx.globalCompositeOperation="source-over";
  };
  var RIB={hero:{lines:46,alpha:.62,amp:.2,spread:.62,center:.52,tilt:-.18,speed:1,seed:1.3},
           panel:{lines:40,alpha:.42,amp:.16,spread:.7,center:.42,tilt:.12,speed:.8,seed:4.2},
           cta:{lines:48,alpha:.5,amp:.14,spread:.55,center:.38,tilt:-.1,speed:.7,seed:7.7}};
  document.querySelectorAll("canvas[data-ribbon]").forEach(function(c){new Ribbon(c,RIB[c.getAttribute("data-ribbon")]||RIB.hero);});

  /* Revelado al hacer scroll: solo se oculta lo que está fuera de pantalla al cargar */
  var revealEls=[].slice.call(document.querySelectorAll("[data-reveal]"));
  if(!reduce&&"IntersectionObserver" in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          var el=en.target;el.classList.add("reveal-in");el.classList.remove("reveal-pending");io.unobserve(el);
          setTimeout(function(){el.classList.remove("reveal-in");},1400);
        }
      });
    },{rootMargin:"0px 0px -8% 0px",threshold:.08});
    revealEls.forEach(function(el){
      if(el.getBoundingClientRect().top>window.innerHeight*.98){el.classList.add("reveal-pending");io.observe(el);}
    });
  }

  /* Contadores */
  function countUp(el){
    var to=+el.getAttribute("data-count"),t0=null,dur=1300;
    if(reduce||!to){el.textContent=to;return;}
    function step(ts){if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=Math.round(to*e);if(p<1)requestAnimationFrame(step);}
    el.textContent="0";requestAnimationFrame(step);
  }
  if("IntersectionObserver" in window){
    var cio=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){countUp(e.target);cio.unobserve(e.target);}});},{threshold:.6});
    document.querySelectorAll("[data-count]").forEach(function(el){cio.observe(el);});
  }

  /* Acordeones: uno abierto a la vez */
  document.querySelectorAll("[data-accordion]").forEach(function(acc){
    acc.addEventListener("click",function(e){
      var btn=e.target.closest(".acc__btn");if(!btn||!acc.contains(btn))return;
      var item=btn.closest(".acc__item"),open=!item.classList.contains("is-open");
      acc.querySelectorAll(".acc__item.is-open").forEach(function(it){it.classList.remove("is-open");it.querySelector(".acc__btn").setAttribute("aria-expanded","false");});
      if(open){item.classList.add("is-open");btn.setAttribute("aria-expanded","true");}
    });
  });

  /* Tarjetas apiladas del proceso */
  var cards=[].slice.call(document.querySelectorAll(".stack__card"));
  function onScrollStack(){
    if(reduce)return;
    for(var i=0;i<cards.length-1;i++){
      var r=cards[i].getBoundingClientRect(),rn=cards[i+1].getBoundingClientRect();
      var ov=Math.max(0,Math.min(1,(r.bottom-rn.top)/r.height));
      cards[i].style.transform="scale("+(1-ov*.05).toFixed(4)+")";
      cards[i].style.filter="brightness("+(1-ov*.45).toFixed(3)+")";
    }
  }

  /* Relleno de palabras al leer */
  var fillEls=[].slice.call(document.querySelectorAll("[data-fill]")),fillWords=[];
  fillEls.forEach(function(el){
    if(reduce||el.getBoundingClientRect().top<window.innerHeight*.9)return;
    var words=el.textContent.trim().split(/\s+/);
    el.textContent="";
    var spans=words.map(function(w,i){var s=document.createElement("span");s.className="fill-word";s.textContent=w+(i<words.length-1?" ":"");el.appendChild(s);return s;});
    fillWords.push({el:el,spans:spans});
  });
  function onScrollFill(){
    fillWords.forEach(function(f){
      var r=f.el.getBoundingClientRect(),vh=window.innerHeight;
      var p=Math.max(0,Math.min(1,(vh*.85-r.top)/(r.height+vh*.35)));
      var lit=Math.round(p*f.spans.length);
      f.spans.forEach(function(s,i){s.style.color=i<lit?"var(--ink)":"#BDB3C3";});
    });
  }

  /* Planes: 3 pagos o pago único */
  var sw=document.getElementById("billing");
  function setMode(m){
    if(!sw||m===mode)return;mode=m;
    sw.setAttribute("aria-checked",m==="unico"?"true":"false");
    document.querySelectorAll(".toggle__opt").forEach(function(b){b.classList.toggle("is-active",b.getAttribute("data-mode")===m);});
    document.querySelectorAll(".plan[data-plan]").forEach(function(card){
      var p=PLANS[card.getAttribute("data-plan")],price=card.querySelector(".price");if(!price)return;
      price.classList.add("is-swapping");
      setTimeout(function(){
        var n=price.querySelector(".price__n"),sub=price.querySelector(".price__sub"),old=price.querySelector(".price__old");
        if(m==="unico"){n.textContent=money(p.unico);old.textContent=money(p.cuotas);old.hidden=false;sub.textContent="Ahorras "+money(p.cuotas-p.unico)+" al pagar completo";sub.classList.add("is-save");}
        else{n.textContent=money(p.cuotas);old.hidden=true;sub.textContent="3 pagos de "+money(p.cuota);sub.classList.remove("is-save");}
        price.classList.remove("is-swapping");
      },reduce?0:220);
    });
    setWaLinks();
  }
  if(sw)sw.addEventListener("click",function(){setMode(mode==="unico"?"cuotas":"unico");});
  document.querySelectorAll(".toggle__opt").forEach(function(b){b.addEventListener("click",function(){setMode(b.getAttribute("data-mode"));});});

  /* Carrusel de clientes */
  (function(){
    var root=document.getElementById("carousel");if(!root)return;
    var track=root.querySelector(".carousel__track"),slides=root.querySelectorAll(".slide"),dotsBox=root.querySelector(".dots"),count=root.querySelector(".carousel__count");
    var idx=0,timer=null,paused=false,N=slides.length;
    for(var i=0;i<N;i++){var d=document.createElement("button");d.type="button";d.className="dot";d.setAttribute("aria-label","Ver historia "+(i+1));d.dataset.i=i;dotsBox.appendChild(d);}
    var dots=dotsBox.querySelectorAll(".dot");
    function go(n,user){
      idx=(n+N)%N;track.style.transform="translateX("+(-idx*100)+"%)";
      dots.forEach(function(d,j){d.setAttribute("aria-current",j===idx?"true":"false");});
      slides.forEach(function(s,j){s.setAttribute("aria-hidden",j===idx?"false":"true");s.querySelectorAll("a").forEach(function(a){a.tabIndex=j===idx?0:-1;});});
      count.textContent=String(idx+1).padStart(2,"0")+" / "+String(N).padStart(2,"0");
      if(user){paused=true;stop();}
    }
    function play(){if(reduce||paused)return;stop();timer=setInterval(function(){go(idx+1);},7000);}
    function stop(){if(timer){clearInterval(timer);timer=null;}}
    root.querySelectorAll(".arrow-btn").forEach(function(b){b.addEventListener("click",function(){go(idx+(+b.dataset.dir),true);});});
    dots.forEach(function(d){d.addEventListener("click",function(){go(+d.dataset.i,true);});});
    root.addEventListener("mouseenter",stop);root.addEventListener("mouseleave",play);
    root.addEventListener("focusin",stop);
    root.addEventListener("keydown",function(e){if(e.key==="ArrowRight"){go(idx+1,true);}if(e.key==="ArrowLeft"){go(idx-1,true);}});
    var vp=root.querySelector(".carousel__viewport"),sx=0,dx=0,drag=false,justDragged=false;
    vp.addEventListener("pointerdown",function(e){if(e.pointerType==="mouse"&&e.button!==0)return;drag=true;sx=e.clientX;dx=0;track.classList.add("is-dragging");});
    vp.addEventListener("dragstart",function(e){e.preventDefault();});
    window.addEventListener("pointermove",function(e){if(!drag)return;dx=e.clientX-sx;track.style.transform="translateX(calc("+(-idx*100)+"% + "+dx+"px))";});
    function endDrag(cancel){
      if(!drag)return;drag=false;track.classList.remove("is-dragging");
      if(Math.abs(dx)>6){justDragged=true;setTimeout(function(){justDragged=false;},60);}
      if(!cancel&&Math.abs(dx)>60){go(idx+(dx<0?1:-1),true);}else{go(idx);}
    }
    window.addEventListener("pointerup",function(){endDrag(false);});
    window.addEventListener("pointercancel",function(){endDrag(true);});
    vp.addEventListener("click",function(e){if(justDragged){e.preventDefault();e.stopPropagation();}},true);
    go(0);play();
  })();

  /* Mensaje directo por WhatsApp */
  var msg=document.getElementById("msg"),send=document.getElementById("msgSend"),hint=document.getElementById("msgHint"),form=document.getElementById("composer");
  if(msg&&send&&form){
  function validate(show){
    var v=msg.value.trim(),ok=v.length>=10;
    send.setAttribute("aria-disabled",ok?"false":"true");
    send.href=WA+encodeURIComponent(withRef(ok?"Hola WebDom, "+v:MSG.general));
    if(ok){hint.textContent="Listo. Se abrirá WhatsApp con tu mensaje.";hint.classList.remove("is-error");}
    else if(show&&v.length){hint.textContent="Escribe al menos 10 caracteres para que sepamos de tu negocio.";hint.classList.add("is-error");}
    else{hint.textContent="Mínimo 10 caracteres.";hint.classList.remove("is-error");}
    return ok;
  }
  msg.addEventListener("input",function(){validate(false);});
  msg.addEventListener("blur",function(){validate(true);});
  form.addEventListener("submit",function(e){e.preventDefault();});
  send.addEventListener("click",function(e){if(!validate(true)){e.preventDefault();msg.focus();}});
  validate(false);
  }

  /* Copiar número */
  var copyBtn=document.getElementById("copyPhone");
  if(copyBtn)copyBtn.addEventListener("click",function(){
    var num="+18299782833",label=copyBtn.querySelector("span");
    function done(t){label.textContent=t;copyBtn.classList.add("is-success");setTimeout(function(){label.textContent="Copiar número";copyBtn.classList.remove("is-success");},2000);}
    function fallback(){var r=document.createRange();r.selectNodeContents(document.getElementById("phone"));var s=window.getSelection();s.removeAllRanges();s.addRange(r);done("Número seleccionado");}
    if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(num).then(function(){done("Copiado");},fallback);}else{fallback();}
  });

  /* Aviso del código de referencia recibido */
  if(REF){var note=document.getElementById("refNote");if(note){note.querySelector("b").textContent=REF;note.hidden=false;}}

  /* Generador de código y enlace de referencia (sin servidor: todo ocurre en el navegador) */
  (function(){
    var f=document.getElementById("refForm");if(!f)return;
    var name=document.getElementById("refName"),phone=document.getElementById("refPhone"),code=document.getElementById("refCode");
    var nameErr=document.getElementById("refNameErr"),phoneErr=document.getElementById("refPhoneErr");
    var submit=document.getElementById("refSubmit"),status=document.getElementById("refStatus");
    var out=document.getElementById("refOut"),outCode=document.getElementById("refOutCode"),outMode=document.getElementById("refOutMode");
    var outLink=document.getElementById("refOutLink"),copy=document.getElementById("refCopy"),share=document.getElementById("refShare");
    var who=document.getElementById("refOutWho"),confirm=document.getElementById("refConfirm");
    var MODES={cliente:{tag:"Modalidad: Cliente (crédito)",msg:"Cliente WebDom"},socio:{tag:"Modalidad: Socio (10–15 %)",msg:"Socio aliado"}};
    function setErr(input,el,text){if(text){input.setAttribute("aria-invalid","true");el.textContent=text;}else{input.removeAttribute("aria-invalid");el.textContent="";}}
    function checkName(){var ok=name.value.trim().length>=2;setErr(name,nameErr,ok?"":"Escribe tu nombre o el de tu negocio.");return ok;}
    function checkPhone(){var d=phone.value.replace(/\D/g,""),ok=d.length>=10&&d.length<=15;setErr(phone,phoneErr,ok?"":"Escribe un WhatsApp válido, con código de área (10 dígitos o más).");return ok;}
    name.addEventListener("blur",function(){if(name.value.trim())checkName();});
    phone.addEventListener("blur",function(){if(phone.value.trim())checkPhone();});
    name.addEventListener("input",function(){if(name.hasAttribute("aria-invalid"))checkName();});
    phone.addEventListener("input",function(){if(phone.hasAttribute("aria-invalid"))checkPhone();});
    code.addEventListener("blur",function(){code.value=cleanCode(code.value);});
    f.addEventListener("submit",function(e){
      e.preventDefault();
      var okN=checkName(),okP=checkPhone();
      if(!okN||!okP){(okN?phone:name).focus();status.textContent="Revisa los campos marcados.";return;}
      var mode=f.querySelector("input[name='refMode']:checked").value;
      var nm=name.value.trim().replace(/\s+/g," "),ph=phone.value.trim();
      code.value=cleanCode(code.value);
      var c=code.value||("REF-"+(noAccents(nm).toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,12)||"WEBDOM"));
      var link=SITE+"?ref="+encodeURIComponent(c);
      submit.classList.add("is-loading");
      setTimeout(function(){
        submit.classList.remove("is-loading");submit.classList.add("is-success");
        setTimeout(function(){submit.classList.remove("is-success");},1800);
        outCode.textContent=c;
        outMode.textContent=MODES[mode].tag;
        outLink.value=link;
        share.href="https://wa.me/?text="+encodeURIComponent("Te recomiendo WebDom para la página web de tu negocio. Mira sus trabajos y escríbeles desde mi enlace de referencia: "+link);
        confirm.href=WA+encodeURIComponent("Hola WebDom, generé el código de referencia "+c+" en la modalidad "+MODES[mode].msg+", a nombre de "+nm+" (WhatsApp: "+ph+"). ¿Me lo confirman?");
        who.textContent="A nombre de "+nm+" · WhatsApp "+ph;
        out.hidden=false;
        out.style.animation="none";void out.offsetWidth;out.style.animation="";
        status.textContent="Código "+c+" generado. Tu enlace está listo para copiar o compartir.";
        var r=out.getBoundingClientRect();
        if(r.bottom>window.innerHeight||r.top<0){out.scrollIntoView({block:"nearest",behavior:reduce?"auto":"smooth"});}
      },reduce?0:500);
    });
    outLink.addEventListener("focus",function(){outLink.select();});
    copy.addEventListener("click",function(){
      var label=copy.querySelector("span");
      function done(t){label.textContent=t;copy.classList.add("is-success");setTimeout(function(){label.textContent="Copiar enlace";copy.classList.remove("is-success");},2200);}
      function fallback(){outLink.focus();outLink.select();done("Enlace seleccionado");}
      if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(outLink.value).then(function(){done("¡Copiado!");},fallback);}else{fallback();}
    });
  })();

  /* Cotizador en 3 pasos (sin servidor: el resumen sale por WhatsApp) */
  (function(){
    var f=document.getElementById("quoteForm");if(!f)return;
    var root=f.closest("[data-quoter]"),panels=f.querySelectorAll(".qpanel"),labels=root.querySelectorAll("[data-qstep-label]");
    var bar=root.querySelector(".qbar i"),err=document.getElementById("qErr"),live=document.getElementById("qLive");
    var back=document.getElementById("qBack"),next=document.getElementById("qNext"),reset=document.getElementById("qReset");
    var step=1;
    var NAMES={web:"Página web",catalogo:"Catálogo con pedidos por WhatsApp",tienda:"Tienda online",sistema:"Sistema web"};
    var STD=["formulario","maps","faq"],PREM=["equipo","sedes","seo","reservas"];
    function val(n){var i=f.querySelector("input[name='"+n+"']:checked");return i?i.value:"";}
    function vals(n){return [].map.call(f.querySelectorAll("input[name='"+n+"']:checked"),function(i){return i.value;});}
    function txt(n){var i=f.querySelector("input[name='"+n+"']:checked");return i?i.getAttribute("data-label")||i.parentNode.querySelector("b").textContent:"";}
    function txts(n){return [].map.call(f.querySelectorAll("input[name='"+n+"']:checked"),function(i){return i.getAttribute("data-label")||i.parentNode.querySelector("b").textContent;});}
    function need(){var n=val("need");return n==="nose"?val("goal"):n;}
    function showFor(){
      var n=val("need");
      f.querySelectorAll("[data-for]").forEach(function(b){b.hidden=b.getAttribute("data-for")!==n;});
      var help=f.querySelector("[data-for-plan]");if(help)help.hidden=val("plan")!=="ayuda";
    }
    function setErr(t,fs){
      err.textContent=t||"";
      f.querySelectorAll(".is-error").forEach(function(x){x.classList.remove("is-error");});
      if(fs)fs.classList.add("is-error");
    }
    function check(){
      if(step===1){if(!val("need")){setErr("Elige una opción para continuar.",f.querySelector("[name='need']").closest("fieldset"));return false;}return true;}
      if(step===2){
        var n=val("need"),req={web:["plan","pay"],catalogo:["items"],tienda:["rnc"],sistema:["sis"],nose:["goal"]}[n]||[];
        for(var i=0;i<req.length;i++){if(!val(req[i])){setErr("Responde esta pregunta para ver tu estimado.",f.querySelector("[name='"+req[i]+"']").closest("fieldset"));return false;}}
        if(n==="tienda"&&!vals("cobro").length){setErr("Elige al menos una forma de cobro.",f.querySelector("[name='cobro']").closest("fieldset"));return false;}
        return true;
      }
      return true;
    }
    function recommend(){
      var fs=vals("feat");
      if(fs.some(function(x){return PREM.indexOf(x)>-1;}))return "premium";
      if(fs.some(function(x){return STD.indexOf(x)>-1;}))return "estandar";
      return "basico";
    }
    function li(t){var l=document.createElement("li");l.textContent=t;return l;}
    function estimate(){
      var n=val("need"),s=need(),biz=document.getElementById("qBiz").value.trim().replace(/\s+/g," ");
      var kicker="Tu estimado",service=NAMES[s],price="Por cotizar",sub="",items=[],note="",wa=[];
      if(n==="nose"){kicker="Te recomendamos";items.push("Lo que quieres lograr: "+txt("goal"));}
      if(s==="web"){
        if(n==="web"){
          var pk=val("plan"),p;
          if(pk==="ayuda"){pk=recommend();kicker="Te recomendamos";var fs=txts("feat");items.push(fs.length?"Necesitas: "+fs.join(", "):"Sin funciones adicionales marcadas");}
          p=PLANS[pk];service="Página web · Plan "+p.name;
          if(val("pay")==="unico"){price=money(p.unico);sub="Pago único · ahorras "+money(p.cuotas-p.unico);items.push("Forma de pago: pago único de "+money(p.unico));}
          else{price=money(p.cuotas);sub="En 3 pagos de "+money(p.cuota);items.push("Forma de pago: 3 pagos de "+money(p.cuota)+" (total "+money(p.cuotas)+")");}
        }else{price="Desde "+money(PLANS.basico.unico);sub="Según el plan y la forma de pago";}
        items.push("Entrega en 48 horas");items.push("Dominio y hosting incluidos");
      }else if(s==="catalogo"){
        sub="Listo en 2 a 3 semanas";
        if(n==="catalogo"){items.push("Productos: "+txt("items"));if(val("items")==="mas40")note="Hasta 40 productos van incluidos para arrancar; los adicionales entran en tu cotización.";}
        items.push("El pedido te llega listo por WhatsApp");
      }else if(s==="tienda"){
        sub="Fecha exacta después de conversar";
        if(n==="tienda"){
          var c=vals("cobro");items.push("Cobro: "+txts("cobro").join(", "));items.push("RNC: "+txt("rnc"));
          if(c.indexOf("tarjeta")>-1&&val("rnc")!=="si")note="Para cobrar con tarjeta se necesita RNC; mientras tanto, se puede cobrar por transferencia.";
          else if(c.indexOf("tarjeta")>-1)note="El banco que procesa las tarjetas (Azul o CardNET) es un contrato tuyo y cobra su comisión por venta.";
        }
        items.push("60 días de garantía");
      }else if(s==="sistema"){
        sub="Primero entendemos tu proceso";
        if(n==="sistema"){items.push("Quieres resolver: "+txt("sis"));var nt=document.getElementById("qSisNote").value.trim();if(nt)items.push("Detalle: "+nt);}
        items.push("60 días de garantía");
      }
      if(biz)items.push("Tu negocio: "+biz);
      document.getElementById("qKicker").textContent=kicker;
      document.getElementById("qService").textContent=service;
      document.getElementById("qPrice").textContent=price;
      document.getElementById("qPriceSub").textContent=sub;
      var ul=document.getElementById("qSummary");ul.textContent="";items.forEach(function(t){ul.appendChild(li(t));});
      var nEl=document.getElementById("qNote");nEl.textContent=note;nEl.hidden=!note;
      root.querySelectorAll("[data-more]").forEach(function(a){a.hidden=a.getAttribute("data-more")!==s;});
      wa.push("Hola WebDom, armé un estimado en su web:");
      wa.push("• Servicio: "+service);
      wa.push("• Estimado: "+price+(sub?" ("+sub+")":""));
      items.forEach(function(t){wa.push("• "+t);});
      wa.push(s==="web"&&n==="web"?"¿Me confirman para empezar?":"¿Me envían la cotización?");
      document.getElementById("qSend").href=WA+encodeURIComponent(withRef(wa.join("\n")));
    }
    function go(n,focus){
      step=n;setErr("");
      panels.forEach(function(p){p.hidden=+p.getAttribute("data-step")!==n;});
      labels.forEach(function(l){var k=+l.getAttribute("data-qstep-label");l.classList.toggle("is-done",k<n);if(k===n)l.setAttribute("aria-current","step");else l.removeAttribute("aria-current");});
      bar.style.width=(n/3*100)+"%";
      back.hidden=n===1;next.hidden=n===3;reset.hidden=n!==3;
      next.querySelector(".btn__label").textContent=n===2?"Ver mi estimado":"Siguiente";
      if(n===3)estimate();
      live.textContent="Paso "+n+" de 3";
      if(focus){var t=n===3?root.querySelector(".qresult"):panels[n-1];t.focus({preventScroll:true});
        var r=root.getBoundingClientRect();if(r.top<0||r.top>window.innerHeight*.5)root.scrollIntoView({block:"start",behavior:reduce?"auto":"smooth"});}
    }
    f.addEventListener("change",function(e){showFor();if(e.target.closest(".is-error"))setErr("");});
    f.addEventListener("submit",function(e){e.preventDefault();if(!check())return;go(step+1,true);});
    back.addEventListener("click",function(){go(step-1,true);});
    reset.addEventListener("click",function(){f.reset();showFor();go(1,true);});
    showFor();go(1,false);
  })();

  /* WhatsApp flotante */
  var wa=document.getElementById("waFloat"),hero=document.querySelector("[data-hero]"),contact=document.getElementById("contacto");
  function onScrollWa(){
    if(!wa)return;
    var past=hero?hero.getBoundingClientRect().bottom<80:window.scrollY>400;
    var cr=contact?contact.getBoundingClientRect():null,inContact=cr?cr.top<window.innerHeight*.6&&cr.bottom>0:false;
    wa.classList.toggle("is-visible",past&&!inContact);
  }

  var ticking=false;
  function onScroll(){if(ticking)return;ticking=true;requestAnimationFrame(function(){onScrollHeader();onScrollStack();onScrollFill();onScrollWa();ticking=false;});}
  window.addEventListener("scroll",onScroll,{passive:true});
  window.addEventListener("resize",onScroll);
  onScroll();
})();
