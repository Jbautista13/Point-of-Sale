import{S as K}from"./vendor.c27de078.js";const U=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))c(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const s of n.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&c(s)}).observe(document,{childList:!0,subtree:!0});function r(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerpolicy&&(n.referrerPolicy=o.referrerpolicy),o.crossorigin==="use-credentials"?n.credentials="include":o.crossorigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function c(o){if(o.ep)return;o.ep=!0;const n=r(o);fetch(o.href,n)}};U();var F=document.querySelector("ul"),I=K.create(F,{onStart:function(e){document.querySelector(".price_footer").classList.add("dragging")},onEnd:function(e){document.querySelector(".price_footer").classList.remove("dragging"),A(e.oldIndex,e.newIndex)},disabled:!0,filter:".remove"}),g,p,J=JSON.parse(localStorage.getItem("PoSData"))||{numOfItems:0,names:[],prices:[],theme:"system"},{numOfItems:i,names:b,prices:S,theme:h}=J;h=h||"system";P();document.querySelector(":root").dataset.theme=h;document.querySelector(":root").style.setProperty("--num-of-items",Number(i));function T(e){let r=(e.target||e).previousElementSibling;r.stepUp(),r.dispatchEvent(new Event("input"))}function O(e){let r=(e.target||e).nextElementSibling;r.stepDown(),r.dispatchEvent(new Event("input"))}window.onload=function(){p=document.querySelector(".edit");let e=document.querySelector(".finished"),t=document.querySelector(".add"),r=document.querySelector(".order"),c=document.querySelector(".complete"),o=document.querySelectorAll(".theme-button");e.addEventListener("click",L),t.addEventListener("click",G),c.addEventListener("click",W),o.forEach(s=>{s.addEventListener("click",V)});for(var n=0;n<i;n++){let s=document.createElement("li");s.tabIndex=0,s.dataset.order=Number(n)+1,s.innerHTML=C(b[n],S[n],n),r.appendChild(s),D(s)}E(r),g=document.querySelectorAll(".remove"),p.dataset.order=Number(i)+1,p.nextElementSibling.dataset.order=Number(i)+2,p.addEventListener("click",s=>{let u=s.target,m=document.querySelector(".controls"),y=document.querySelectorAll("li"),k=document.querySelector(".theme-picker");const v=u.dataset.inEdit;document.querySelector(".total").dataset.inTransition=="true"?Q(u):v=="true"?(N(m,"any"),N(k,"margin-top"),g.forEach(f=>{N(f,"any"),f.disabled=!0}),y.forEach(f=>f.tabIndex="0"),I.option("disabled",!0),Z(),c.disabled=!1,u.dataset.inEdit=!1):(E(m),E(k),g.forEach(f=>{E(f),f.disabled=!1}),y.forEach(f=>f.tabIndex="-1"),I.option("disabled",!1),Y(),c.disabled=!0,u.dataset.inEdit=!0)})};var w=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"});function W(e){let t=e.target||e,r=document.querySelectorAll("li"),c=document.querySelector(".total"),o=document.querySelector("#total").dataset.total;document.querySelector(".container");let n=t.previousElementSibling;const s=c.dataset.inTransition;o=="0"||(s=="true"?(R(),E(document.querySelector(".order")),r.forEach(u=>u.tabIndex="0"),c.dataset.inTransition="false",n.firstElementChild.innerText="Edit",t.firstElementChild.innerText="Complete"):(r.forEach(u=>u.tabIndex="-1"),c.dataset.inTransition="true",N(document.querySelector(".order"),"margin-top"),n.firstElementChild.innerText="Back",t.firstElementChild.innerText="Finish"))}function Q(e){let t=document.querySelectorAll("li"),r=document.querySelector(".total");document.querySelector(".container");let c=e.nextElementSibling;E(document.querySelector(".order")),t.forEach(o=>o.tabIndex="0"),r.dataset.inTransition="false",e.firstElementChild.innerText="Edit",c.firstElementChild.innerText="Complete"}function R(){let e=document.querySelector("#total");document.querySelectorAll('[name="Quantity"]').forEach(t=>{t.classList.add("fadeout"),e.classList.add("fadeout"),setTimeout(function(){t.value=0,t.classList.remove("fadeout"),e.classList.remove("fadeout"),t.dispatchEvent(new Event("input"))},125)})}function x(){let e=document.querySelectorAll("li"),t=document.querySelector(".edit"),r=document.querySelector(".complete");for(var c=1;c<=i;c++){let o=e[c-1],n=o.firstElementChild;o.dataset.order=c,n.dataset.order=c-.5}t.dataset.order=Number(i)+1,r.dataset.order=Number(i)+2}function _(e){let t=e.target||e,r=t.parentElement,c=t.parentElement.querySelector("input"),o=document.querySelector("#total"),{price:n,quantity:s}=c.dataset,{total:u}=o.dataset,m=Number(u)-s*n,y=r.dataset.order;b.splice(y-1,1),S.splice(y-1,1),o.value=w.format(m),o.dataset.total=m,i=Number(i)-1,document.documentElement.style.setProperty("--num-of-items",Number(i)),r.outerHTML="",localStorage.setItem("PoSData",JSON.stringify({numOfItems:i,names:b,prices:S,theme:h})),x(),g=document.querySelectorAll(".remove")}function j(e){let t=e.target||e,r=document.querySelector("#total"),c=t.value,{price:o,quantity:n}=t.dataset,{total:s}=r.dataset,u=Number(s)+c*o-n*o;r.value=w.format(u),r.dataset.total=u,t.dataset.quantity=c}function G(){let e=document.querySelector(".addItem");document.querySelector(".order"),X(),e.dataset.adding="true",E(e);let t=document.querySelector("#cancel-add-item"),r=document.querySelector("#confirm-add-item"),c=document.querySelector("#item"),o=document.querySelector("#price");c.focus(),t.addEventListener("click",function(){N(e,"any"),r.removeEventListener("click",B),c.value="",o.value="",z(),e.dataset.adding="false"},{once:!0}),r.addEventListener("click",B)}function V(e){h=e.currentTarget.dataset.themeName,P(),document.querySelector(":root").dataset.theme=h,localStorage.setItem("PoSData",JSON.stringify({numOfItems:i,names:b,prices:S,theme:h})),console.log(e.currentTarget)}function B(){document.querySelector(".addItem");let e=document.querySelector(".order"),t=document.querySelector("#cancel-add-item"),r=document.querySelector("#item"),c=document.querySelector("#price");if(!r.value.trim().length&&!c.value.length)t.dispatchEvent(new Event("click"));else if(!(!r.value.trim().length||!c.value.length)){let o=w.formatToParts(c.value);o[1].value=o[1].value||"";let n=document.createElement("li");n.tabIndex="-1",n.dataset.order=Number(i)+1,n.innerHTML=C(r.value,o[1].value+o[2].value+o[3].value,i),e.appendChild(n),b[i]=r.value,S[i]=o[1].value+o[2].value+o[3].value,i=Number(i)+1,document.documentElement.style.setProperty("--num-of-items",Number(i)),localStorage.setItem("PoSData",JSON.stringify({numOfItems:i,names:b,prices:S,theme:h})),r.value="",c.value="",p.dataset.order=Number(i)+1,p.nextElementSibling.dataset.order=Number(i)+2,Array.from(e.lastChild.lastChild.children).forEach(s=>{s.disabled=!0}),D(n),g=document.querySelectorAll(".remove"),r.focus()}}function C(e,t,r){return'        <button class="remove hidden" data-order="'+(Number(r)+.5)+`" tabindex="0" disabled></button>
        <h2 data-price="`+t+'">'+e+`</h2>
        <div class="quantity">
            <button class="decrement" tabindex="-1"></button>
            <input type="number" pattern="[0-9]*" inputmode="numeric" data-price="`+t+'" data-quantity="0" min="0" max="99" value="0" name="Quantity" id="'+e.toLowerCase()+`" tabindex="-1">
            <button class="increment" tabindex="-1"></button>
        </div>`}function D(e){let t=e.querySelector(".remove"),r=e.querySelector(".increment"),c=e.querySelector(".decrement"),o=e.querySelector("input");t.addEventListener("click",_),r.addEventListener("click",T),c.addEventListener("click",O),o.addEventListener("input",j)}function X(){let e=document.querySelector("body"),t=document.querySelector(".controls").children;g.forEach(r=>{N(r,"any"),r.disabled=!0}),e.classList.add("no-scroll"),t[0].disabled=!0,t[1].disabled=!0,p.disabled=!0}function z(){let e=document.querySelector("body"),t=document.querySelector(".controls").children;g.forEach(r=>{E(r),r.disabled=!1}),e.classList.remove("no-scroll"),t[0].disabled=!1,t[1].disabled=!1,p.disabled=!1}function E(e){e.classList.remove("hidden"),e.offsetWidth,e.classList.add("show")}function N(e,t){e.classList.remove("show"),e.addEventListener("transitionend",function r(c){(t=="any"||c.propertyName==t)&&!e.matches(".show")&&(e.classList.add("hidden"),e.removeEventListener("transitionend",r))})}function Y(){Array.from(document.querySelectorAll(".quantity")).forEach(e=>{Array.from(e.children).forEach(t=>{t.disabled=!0})})}function Z(){Array.from(document.querySelectorAll(".quantity")).forEach(e=>{Array.from(e.children).forEach(t=>{t.disabled=!1})})}function $(e){e.parentElement.insertBefore(e,e.previousElementSibling),e.focus()}function ee(e){e.parentElement.insertBefore(e.nextElementSibling,e),e.focus()}function A(e,t){let r=b[e],c=S[e];b.splice(e,1),S.splice(e,1),b.splice(t,0,r),S.splice(t,0,c),localStorage.setItem("PoSData",JSON.stringify({numOfItems:i,names:b,prices:S,theme:h})),x()}function P(){switch(h){case"light":document.querySelector('meta[name="theme-color"]').setAttribute("content","#ffffff");break;case"dark":document.querySelector('meta[name="theme-color"]').setAttribute("content","#1c1c1c");break;case"system":window.matchMedia?window.matchMedia("(prefers-color-scheme: dark").matches?document.querySelector('meta[name="theme-color"]').setAttribute("content","#1c1c1c"):document.querySelector('meta[name="theme-color"]').setAttribute("content","#ffffff"):document.querySelector('meta[name="theme-color"]').setAttribute("content","#1c1c1c");break}}function L(){document.querySelector(".edit").dispatchEvent(new Event("click"))}document.addEventListener("keydown",e=>{const t="ArrowUp",r="ArrowLeft",c="ArrowDown",o="ArrowRight",n="KeyW",s="KeyA",u="KeyS",m="KeyD",y="Enter",k="Backspace",v="Escape",d=document.activeElement,f=p.dataset.inEdit,M=document.querySelector(".total").dataset.inTransition,H=document.querySelector(".addItem").dataset.adding;let a=e.code;if(!a||a.indexOf("Numpad")!=-1||a.indexOf("Digit")!=-1)switch(a=e.key,e.key){case"w":case"W":a=n;break;case"a":case"A":a=s;break;case"s":case"S":a=u;break;case"d":case"D":a=m;break}if(M=="true")if(d.parentElement.matches(".footer")){const l=d.dataset.order;switch(a){case r:case s:l!=Number(i)+1&&document.querySelector('[data-order="'+(Number(l)-1)+'"]').focus();break;case o:case m:l!=Number(i)+2&&document.querySelector('[data-order="'+(Number(l)+1)+'"]').focus();break;case k:document.querySelector(".edit").click()}}else switch(a){case r:case s:case o:case m:document.querySelector('[data-order="'+(Number(i)+1)+'"]').focus();break;case k:document.querySelector(".edit").click();break;case y:document.querySelector(".complete").click()}else if(f!="true")if(d.matches("li")){const l=d.dataset.order;if(isFinite(a)){let q=d.querySelector("input");q.value=q.value=="0"?a:q.value.slice(0,-1)+a,q.dispatchEvent(new Event("input"))}else switch(a){case t:case n:l!=1&&document.querySelector('[data-order="'+(Number(l)-1)+'"]').focus();break;case c:case u:document.querySelector('[data-order="'+(Number(l)+1)+'"]').focus();break;case r:case s:O(d.querySelector(".decrement"));break;case o:case m:T(d.querySelector(".increment"));break;case y:document.querySelector(".complete").click();break;case k:let q=d.querySelector("input");q.value=q.value.length==1?0:q.value.slice(0,-1),q.dispatchEvent(new Event("input"));break}}else if(d.parentElement.matches(".footer")){const l=d.dataset.order;switch(a){case t:case n:document.querySelector('[data-order="'+i+'"]').focus();break;case r:case s:l!=Number(i)+1&&document.querySelector('[data-order="'+(Number(l)-1)+'"]').focus();break;case o:case m:l!=Number(i)+2&&document.querySelector('[data-order="'+(Number(l)+1)+'"]').focus();break}}else a==t||a==c||a==r||a==o||a==n||a==u||a==s||a==m?document.querySelector('[data-order="1"]').focus():a==y&&document.querySelector(".complete").click();else if(H=="true")a==y?d.matches("#item")?document.querySelector("#price").focus():d.matches("#price")&&document.querySelector("#confirm-add-item").click():a==v&&document.querySelector("#cancel-add-item").click();else if(d.matches(".remove")){const l=d.dataset.order;switch(a){case t:case n:l!=.5?document.querySelector('[data-order="'+(Number(l)-1)+'"]').focus():document.querySelector(".finished").focus();break;case c:case u:l!=Number(i)-.5?document.querySelector('[data-order="'+(Number(l)+1)+'"]').focus():document.querySelector(".edit").focus();break;case r:case s:document.querySelector('[data-order="'+(Number(l)+.5)+'"]').focus();break;case v:L();break}}else if(d.matches("li")){const l=d.dataset.order;switch(a){case t:case n:l!=1?($(d),A(l-1,l-2)):document.querySelector('[data-order="'+(Number(l)-.5)+'"]').focus();break;case c:case u:l!=Number(i)?(ee(d),A(l-1,l)):document.querySelector(".edit").focus();break;case o:case m:document.querySelector('[data-order="'+(Number(l)-.5)+'"]').focus();break;case v:L();break}}else if(d.parentElement.matches(".controls")){const l=d.dataset.order;switch(a){case c:case u:document.querySelector('[data-order="0.5"]').focus();break;case r:case s:l!=-.5&&document.querySelector('[data-order="'+(Number(l)-.5)+'"]').focus();break;case o:case m:l!=0&&document.querySelector('[data-order="'+(Number(l)+.5)+'"]').focus();break;case v:L();break}}else d.matches(".edit")?a==t?document.querySelector('[data-order="'+(Number(i)-.5)+'"]').focus():a==v&&L():a==t||a==c||a==r||a==o||a==n||a==u||a==s||a==m?document.querySelector('[data-order="0.5"]').focus():a==v&&L()});
