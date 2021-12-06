import{S as H}from"./vendor.c27de078.js";const K=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))n(r);new MutationObserver(r=>{for(const c of r)if(c.type==="childList")for(const s of c.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function o(r){const c={};return r.integrity&&(c.integrity=r.integrity),r.referrerpolicy&&(c.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?c.credentials="include":r.crossorigin==="anonymous"?c.credentials="omit":c.credentials="same-origin",c}function n(r){if(r.ep)return;r.ep=!0;const c=o(r);fetch(r.href,c)}};K();var M=document.querySelector("ul"),I=H.create(M,{onStart:function(e){document.querySelector(".price_footer").classList.add("dragging")},onEnd:function(e){document.querySelector(".price_footer").classList.remove("dragging"),L(e.oldIndex,e.newIndex)},disabled:!0,filter:".remove"}),v,S,U=JSON.parse(localStorage.getItem("PoSData"))||{numOfItems:0,names:[],prices:[]},{numOfItems:i,names:p,prices:q}=U;localStorage.getItem("numOfItems");document.querySelector(":root").style.setProperty("--num-of-items",Number(i));function w(e){let o=(e.target||e).previousElementSibling;o.stepUp(),o.dispatchEvent(new Event("input"))}function A(e){let o=(e.target||e).nextElementSibling;o.stepDown(),o.dispatchEvent(new Event("input"))}window.onload=function(){S=document.querySelector(".edit");let e=document.querySelector(".finished"),t=document.querySelector(".add"),o=document.querySelector(".order"),n=document.querySelector(".complete");e.addEventListener("click",E),t.addEventListener("click",_),n.addEventListener("click",F);for(var r=0;r<i;r++){let c=document.createElement("li");c.tabIndex=0,c.dataset.order=Number(r)+1,c.innerHTML=x(p[r],q[r],r),o.appendChild(c),B(c)}h(o),v=document.querySelectorAll(".remove"),S.dataset.order=Number(i)+1,S.nextElementSibling.dataset.order=Number(i)+2,S.addEventListener("click",c=>{let s=c.target,u=document.querySelector(".controls"),f=document.querySelectorAll("li");const y=s.dataset.inEdit;document.querySelector(".total").dataset.inTransition=="true"?W(s):y=="true"?(g(u,"any"),v.forEach(m=>{g(m,"any"),m.disabled=!0}),f.forEach(m=>m.tabIndex="0"),I.option("disabled",!0),X(),n.disabled=!1,s.dataset.inEdit=!1):(h(u),v.forEach(m=>{h(m),m.disabled=!1}),f.forEach(m=>m.tabIndex="-1"),I.option("disabled",!1),V(),n.disabled=!0,s.dataset.inEdit=!0)})};var N=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"});function F(e){let t=e.target||e,o=document.querySelectorAll("li"),n=document.querySelector(".total"),r=document.querySelector("#total").dataset.total;document.querySelector(".container");let c=t.previousElementSibling;const s=n.dataset.inTransition;r=="0"||(s=="true"?(J(),h(document.querySelector(".order")),o.forEach(u=>u.tabIndex="0"),n.dataset.inTransition="false",c.firstElementChild.innerText="Edit",t.firstElementChild.innerText="Complete"):(o.forEach(u=>u.tabIndex="-1"),n.dataset.inTransition="true",g(document.querySelector(".order"),"margin-top"),c.firstElementChild.innerText="Back",t.firstElementChild.innerText="Finish"))}function W(e){let t=document.querySelectorAll("li"),o=document.querySelector(".total");document.querySelector(".container");let n=e.nextElementSibling;h(document.querySelector(".order")),t.forEach(r=>r.tabIndex="0"),o.dataset.inTransition="false",e.firstElementChild.innerText="Edit",n.firstElementChild.innerText="Complete"}function J(){let e=document.querySelector("#total");document.querySelectorAll('[name="Quantity"]').forEach(t=>{t.classList.add("fadeout"),e.classList.add("fadeout"),setTimeout(function(){t.value=0,t.classList.remove("fadeout"),e.classList.remove("fadeout"),t.dispatchEvent(new Event("input"))},125)})}function O(){let e=document.querySelectorAll("li"),t=document.querySelector(".edit"),o=document.querySelector(".complete");for(var n=1;n<=i;n++){let r=e[n-1],c=r.firstElementChild;r.dataset.order=n,c.dataset.order=n-.5}t.dataset.order=Number(i)+1,o.dataset.order=Number(i)+2}function Q(e){let t=e.target||e,o=t.parentElement,n=t.parentElement.querySelector("input"),r=document.querySelector("#total"),{price:c,quantity:s}=n.dataset,{total:u}=r.dataset,f=Number(u)-s*c,y=o.dataset.order;p.splice(y-1,1),q.splice(y-1,1),r.value=N.format(f),r.dataset.total=f,i=Number(i)-1,document.documentElement.style.setProperty("--num-of-items",Number(i)),o.outerHTML="",localStorage.setItem("PoSData",JSON.stringify({numOfItems:i,names:p,prices:q})),O(),v=document.querySelectorAll(".remove")}function R(e){let t=e.target||e,o=document.querySelector("#total"),n=t.value,{price:r,quantity:c}=t.dataset,{total:s}=o.dataset,u=Number(s)+n*r-c*r;o.value=N.format(u),o.dataset.total=u,t.dataset.quantity=n}function _(){let e=document.querySelector(".addItem");document.querySelector(".order"),j(),e.dataset.adding="true",h(e);let t=document.querySelector("#cancel-add-item"),o=document.querySelector(".confirm"),n=document.querySelector("#item"),r=document.querySelector("#price");n.focus(),t.addEventListener("click",function(){g(e,"any"),o.removeEventListener("click",T),n.value="",r.value="",G(),e.dataset.adding="false"},{once:!0}),o.addEventListener("click",T)}function T(){document.querySelector(".addItem");let e=document.querySelector(".order"),t=document.querySelector("#cancel-add-item");document.querySelector(".confirm");let o=document.querySelector("#item"),n=document.querySelector("#price");if(!o.value.trim().length&&!n.value.length)t.dispatchEvent(new Event("click"));else if(!(!o.value.trim().length||!n.value.length)){let r=N.formatToParts(n.value);r[1].value=r[1].value||"";let c=document.createElement("li");c.tabIndex="-1",c.dataset.order=Number(i)+1,c.innerHTML=x(o.value,r[1].value+r[2].value+r[3].value,i),e.appendChild(c),p[i]=o.value,q[i]=r[1].value+r[2].value+r[3].value,i=Number(i)+1,document.documentElement.style.setProperty("--num-of-items",Number(i)),localStorage.setItem("PoSData",JSON.stringify({numOfItems:i,names:p,prices:q})),o.value="",n.value="",S.dataset.order=Number(i)+1,S.nextElementSibling.dataset.order=Number(i)+2,Array.from(e.lastChild.lastChild.children).forEach(s=>{s.disabled=!0}),B(c),v=document.querySelectorAll(".remove"),o.focus()}}function x(e,t,o){return'        <button class="remove hidden" data-order="'+(Number(o)+.5)+`" tabindex="0" disabled></button>
        <h2 data-price="`+t+'">'+e+`</h2>
        <div class="quantity">
            <button class="decrement" tabindex="-1"></button>
            <input type="number" pattern="[0-9]*" inputmode="numeric" data-price="`+t+'" data-quantity="0" min="0" max="99" value="0" name="Quantity" id="'+e.toLowerCase()+`" tabindex="-1">
            <button class="increment" tabindex="-1"></button>
        </div>`}function B(e){let t=e.querySelector(".remove"),o=e.querySelector(".increment"),n=e.querySelector(".decrement"),r=e.querySelector("input");t.addEventListener("click",Q),o.addEventListener("click",w),n.addEventListener("click",A),r.addEventListener("input",R)}function j(){let e=document.querySelector("body"),t=document.querySelector(".controls").children;v.forEach(o=>{g(o,"any"),o.disabled=!0}),e.classList.add("no-scroll"),t[0].disabled=!0,t[1].disabled=!0,S.disabled=!0}function G(){let e=document.querySelector("body"),t=document.querySelector(".controls").children;v.forEach(o=>{h(o),o.disabled=!1}),e.classList.remove("no-scroll"),t[0].disabled=!1,t[1].disabled=!1,S.disabled=!1}function h(e){e.classList.remove("hidden"),e.offsetWidth,e.classList.add("show")}function g(e,t){e.classList.remove("show"),e.addEventListener("transitionend",function o(n){(t=="any"||n.propertyName==t)&&!e.matches(".show")&&(e.classList.add("hidden"),e.removeEventListener("transitionend",o))})}function V(){Array.from(document.querySelectorAll(".quantity")).forEach(e=>{Array.from(e.children).forEach(t=>{t.disabled=!0})})}function X(){Array.from(document.querySelectorAll(".quantity")).forEach(e=>{Array.from(e.children).forEach(t=>{t.disabled=!1})})}function z(e){e.parentElement.insertBefore(e,e.previousElementSibling),e.focus()}function Y(e){e.parentElement.insertBefore(e.nextElementSibling,e),e.focus()}function L(e,t){let o=p[e],n=q[e];p.splice(e,1),q.splice(e,1),p.splice(t,0,o),q.splice(t,0,n),localStorage.setItem("PoSData",JSON.stringify({numOfItems:i,names:p,prices:q})),O()}function E(){document.querySelector(".edit").dispatchEvent(new Event("click"))}document.addEventListener("keydown",e=>{const t="ArrowUp",o="ArrowLeft",n="ArrowDown",r="ArrowRight",c="KeyW",s="KeyA",u="KeyS",f="KeyD",y="Enter",k="Backspace",m="Escape",d=document.activeElement,C=S.dataset.inEdit,D=document.querySelector(".total").dataset.inTransition,P=document.querySelector(".addItem").dataset.adding;let a=e.code;if(!a||a.indexOf("Numpad")!=-1||a.indexOf("Digit")!=-1)switch(a=e.key,e.key){case"w":case"W":a=c;break;case"a":case"A":a=s;break;case"s":case"S":a=u;break;case"d":case"D":a=f;break}if(D=="true")if(d.parentElement.matches(".footer")){const l=d.dataset.order;switch(a){case o:case s:l!=Number(i)+1&&document.querySelector('[data-order="'+(Number(l)-1)+'"]').focus();break;case r:case f:l!=Number(i)+2&&document.querySelector('[data-order="'+(Number(l)+1)+'"]').focus();break;case k:document.querySelector(".edit").click()}}else switch(a){case o:case s:case r:case f:document.querySelector('[data-order="'+(Number(i)+1)+'"]').focus();break;case k:document.querySelector(".edit").click();break;case y:document.querySelector(".complete").click()}else if(C!="true")if(d.matches("li")){const l=d.dataset.order;if(isFinite(a)){let b=d.querySelector("input");b.value=b.value=="0"?a:b.value.slice(0,-1)+a,b.dispatchEvent(new Event("input"))}else switch(a){case t:case c:l!=1&&document.querySelector('[data-order="'+(Number(l)-1)+'"]').focus();break;case n:case u:document.querySelector('[data-order="'+(Number(l)+1)+'"]').focus();break;case o:case s:A(d.querySelector(".decrement"));break;case r:case f:w(d.querySelector(".increment"));break;case y:document.querySelector(".complete").click();break;case k:let b=d.querySelector("input");b.value=b.value.length==1?0:b.value.slice(0,-1),b.dispatchEvent(new Event("input"));break}}else if(d.parentElement.matches(".footer")){const l=d.dataset.order;switch(a){case t:case c:document.querySelector('[data-order="'+i+'"]').focus();break;case o:case s:l!=Number(i)+1&&document.querySelector('[data-order="'+(Number(l)-1)+'"]').focus();break;case r:case f:l!=Number(i)+2&&document.querySelector('[data-order="'+(Number(l)+1)+'"]').focus();break}}else a==t||a==n||a==o||a==r||a==c||a==u||a==s||a==f?document.querySelector('[data-order="1"]').focus():a==y&&document.querySelector(".complete").click();else if(P=="true")a==y?d.matches("#item")?document.querySelector("#price").focus():d.matches("#price")&&document.querySelector(".confirm").click():a==m&&document.querySelector("#cancel-add-item").click();else if(d.matches(".remove")){const l=d.dataset.order;switch(a){case t:case c:l!=.5?document.querySelector('[data-order="'+(Number(l)-1)+'"]').focus():document.querySelector(".finished").focus();break;case n:case u:l!=Number(i)-.5?document.querySelector('[data-order="'+(Number(l)+1)+'"]').focus():document.querySelector(".edit").focus();break;case o:case s:document.querySelector('[data-order="'+(Number(l)+.5)+'"]').focus();break;case m:E();break}}else if(d.matches("li")){const l=d.dataset.order;switch(a){case t:case c:l!=1?(z(d),L(l-1,l-2)):document.querySelector('[data-order="'+(Number(l)-.5)+'"]').focus();break;case n:case u:l!=Number(i)?(Y(d),L(l-1,l)):document.querySelector(".edit").focus();break;case r:case f:document.querySelector('[data-order="'+(Number(l)-.5)+'"]').focus();break;case m:E();break}}else if(d.parentElement.matches(".controls")){const l=d.dataset.order;switch(a){case n:case u:document.querySelector('[data-order="0.5"]').focus();break;case o:case s:l!=-.5&&document.querySelector('[data-order="'+(Number(l)-.5)+'"]').focus();break;case r:case f:l!=0&&document.querySelector('[data-order="'+(Number(l)+.5)+'"]').focus();break;case m:E();break}}else d.matches(".edit")?a==t?document.querySelector('[data-order="'+(Number(i)-.5)+'"]').focus():a==m&&E():a==t||a==n||a==o||a==r||a==c||a==u||a==s||a==f?document.querySelector('[data-order="0.5"]').focus():a==m&&E()});
