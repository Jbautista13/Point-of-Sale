var se=Object.defineProperty;var z=Object.getOwnPropertySymbols;var ue=Object.prototype.hasOwnProperty,me=Object.prototype.propertyIsEnumerable;var J=(e,t,r)=>t in e?se(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,F=(e,t)=>{for(var r in t||(t={}))ue.call(t,r)&&J(e,r,t[r]);if(z)for(var r of z(t))me.call(t,r)&&J(e,r,t[r]);return e};import{S as fe}from"./vendor.c27de078.js";const ye=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function r(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerpolicy&&(o.referrerPolicy=a.referrerpolicy),a.crossorigin==="use-credentials"?o.credentials="include":a.crossorigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(a){if(a.ep)return;a.ep=!0;const o=r(a);fetch(a.href,o)}};ye();var I,A,G,C,O,N={showKeys:!1,keyPressedCurrently:!1},v={hideKeyPressTimer:null,errorTimer:null},he=JSON.parse(localStorage.getItem("PoSData"))||{numOfItems:0,names:[],prices:[],theme:"system",settings:{"Change Calculator":!0}},{numOfItems:y=0,names:k=[],prices:q=[],theme:B="system",settings:L={change_calculator:!0}}=he,U=F({},L);W(y);window.onload=function(){C=document.querySelector(".edit");let e=document.querySelector(".finished"),t=document.querySelector(".add"),r=document.querySelector(".order"),n=document.querySelector(".complete"),a=document.querySelector("#cash");O=document.getElementById("open-settings"),G=document.querySelectorAll(".theme-button"),a.addEventListener("keydown",Te),e.addEventListener("click",M),t.addEventListener("click",qe),O.addEventListener("click",ke),n.addEventListener("click",ve),G.forEach(i=>{i.addEventListener("click",Le)}),oe(!0);for(var o=0;o<y;o++){let i=document.createElement("li");i.tabIndex=0,i.dataset.order=Number(o)+1,i.innerHTML=ae(k[o],q[o],o),r.appendChild(i),ie(i)}E(r),document.querySelector(`[data-theme-name="${B}"`).disabled=!0,I=document.querySelectorAll(".item-remove-button"),A=document.querySelectorAll(".item-edit-button"),R(),C.addEventListener("click",i=>{let s=document.querySelector(".controls"),u=document.querySelectorAll("li");document.querySelector(".theme-picker");const h=document.body.dataset.inEdit;document.body.dataset.finishingOrder=="true"?be(C):h=="true"?(S(O,"margin-bottom"),S(s,"any"),I.forEach(m=>{S(m,"any"),m.disabled=!0}),A.forEach(m=>{S(m,"any"),m.disabled=!0}),u.forEach(m=>m.tabIndex="0"),le.option("disabled",!0),Ae(),n.disabled=!1,document.body.dataset.inEdit=!1,document.removeEventListener("dblclick",ee)):(E(s),E(O),I.forEach(m=>{E(m),m.disabled=!1}),A.forEach(m=>{E(m),m.disabled=!1}),u.forEach(m=>m.tabIndex="-1"),le.option("disabled",!1),Ie(),n.disabled=!0,document.body.dataset.inEdit=!0,document.addEventListener("dblclick",ee))})};var w=new Intl.NumberFormat("en-US",{style:"currency",currency:"USD"});function ve(e){let t=e.target||e,r=document.querySelectorAll("li");document.querySelector(".total");let n=document.querySelector("#total").dataset.total;document.querySelector(".container");let a=t.previousElementSibling;const o=document.body.dataset.finishingOrder;n=="0"||(o=="true"?(Ee(),E(document.querySelector(".order")),L.change_calculator!=!1&&S(document.querySelector(".change-container"),"margin-top"),r.forEach(i=>i.tabIndex="0"),r[0].focus(),document.body.dataset.finishingOrder="false",a.firstElementChild.innerText="Edit",t.firstElementChild.innerText="Complete"):(r.forEach(i=>i.tabIndex="-1"),document.body.dataset.finishingOrder="true",S(document.querySelector(".order"),"margin-top"),L.change_calculator!=!1&&(xe(),E(document.querySelector(".change-container")),document.querySelector("input#cash").focus(),document.querySelector("input#cash").scrollIntoView()),a.firstElementChild.innerText="Back",t.firstElementChild.innerText="Finish"))}function be(e){let t=document.querySelectorAll("li"),r=e.nextElementSibling;E(document.querySelector(".order")),S(document.querySelector(".change-container"),"margin-top"),t.forEach(n=>n.tabIndex="0"),document.body.dataset.finishingOrder="false",e.firstElementChild.innerText="Edit",r.firstElementChild.innerText="Complete"}function Ee(){let e=document.querySelector("#total");document.querySelectorAll('[name="Quantity"]').forEach(t=>{t.classList.add("fadeout"),e.classList.add("fadeout"),setTimeout(function(){t.value=0,t.classList.remove("fadeout"),e.classList.remove("fadeout"),t.dispatchEvent(new Event("input"))},125)})}function X(){let e=document.querySelectorAll("li");for(var t=1;t<=y;t++){let r=e[t-1],n=r.firstElementChild,a=r.children[1];r.dataset.order=t,n.dataset.order=t-.75,a.dataset.order=t-.25}R()}function pe(e){let t=e.target||e,r=t.parentElement,n=t.parentElement.querySelector("input"),a=document.querySelector("#total"),{price:o,quantity:i}=n.dataset,{total:s}=a.dataset,u=Number(s)-i*o,h=r.dataset.order;k.splice(h-1,1),q.splice(h-1,1),a.value=w.format(u),a.dataset.total=u,y=Number(y)-1,W(y),r.classList.add("remove"),r.addEventListener("transitionend",function(m){m.propertyName=="margin-top"&&(r.outerHTML="",X())}),$(),I=document.querySelectorAll(".item-remove-button"),A=document.querySelectorAll(".item-edit-button")}function Se(e){let t=e.target||e,r=document.querySelector("#total"),n=t.value,{price:a,quantity:o}=t.dataset,{total:i}=r.dataset,s=Number(i)+n*a-o*a;r.value=w.format(s),r.dataset.total=s,t.dataset.quantity=n}function ge(e){e.stopPropagation();let t=document.querySelector(".modal-edit-item");_(),document.body.dataset.currentModal="editing",E(t);let n=(e.target||e).nextElementSibling,a=t.querySelector(".x-button"),o=document.querySelector("#cancel-edit-item"),i=document.querySelector("#confirm-edit-item"),s=document.querySelector("#edited-item-name"),u=document.querySelector("#edited-item-price");s.value=n.innerText,u.value=n.dataset.price,s.focus(),a.addEventListener("click",D),o.addEventListener("click",function(){S(t,"any"),a.removeEventListener("click",D),i.removeEventListener("click",te),s.value="",u.value="",V(),document.body.dataset.currentModal=""},{once:!0}),i.addEventListener("click",te),i.dataset.previousItemName=n.innerText,i.dataset.previousPrice=n.dataset.price}function ke(e){e.stopPropagation();let t=document.querySelector(".settings-modal");_(),document.body.dataset.currentModal="settings",E(t);let r=t.querySelector(".x-button"),n=t.querySelector(".cancel"),a=t.querySelector(".confirm");r.addEventListener("click",D),n.addEventListener("click",function(){S(t,"any"),r.removeEventListener("click",D),a.removeEventListener("click",re),oe(),U=F({},L),V(),document.body.dataset.currentModal=""},{once:!0}),a.addEventListener("click",re)}function qe(e){e.stopPropagation();let t=document.querySelector(".modal-add-item");_(),document.body.dataset.currentModal="adding",E(t);let r=t.querySelector(".x-button"),n=t.querySelector("#cancel-add-item"),a=t.querySelector("#confirm-add-item"),o=t.querySelector("#add-item-name"),i=t.querySelector("#add-item-price");o.focus(),r.addEventListener("click",D),n.addEventListener("click",function(){S(t,"any"),r.removeEventListener("click",D),a.removeEventListener("click",ne),o.value="",i.value="",V(),document.body.dataset.currentModal=""},{once:!0}),a.addEventListener("click",ne)}function Le(e){document.querySelector(`[data-theme-name="${B}"`).disabled=!1,e.currentTarget.disabled=!0,B=e.currentTarget.dataset.themeName,document.documentElement.dataset.theme=B,$(),Ne()}function we(e){let t=e.currentTarget;U[t.id]=t.checked}function Te(e){let t=e.target,r=t.parentElement.nextElementSibling.children[1];e.code=="Escape"||e.code=="Enter"||(e.preventDefault(),e.stopPropagation(),!(!isFinite(e.key)&&e.code!="Backspace"&&e.code!="Period")&&(isFinite(e.key)?t.value=w.format(Number(t.value.replace(/[^0-9.-]+/g,"")*10)+e.key/100):e.code=="Backspace"?t.value=w.format(Math.floor(Number(t.value.replace(/[^0-9.-]+/g,"")*10))/100):t.value=w.format(Number(t.value.replace(/[^0-9.-]+/g,"")*100)),r.value=w.format(Number(t.value.replace(/[^0-9.-]+/g,""))-document.querySelector("#total").dataset.total)))}function Y(e){let r=(e.target||e).previousElementSibling;r.stepUp(),r.dispatchEvent(new Event("input"))}function Z(e){let r=(e.target||e).nextElementSibling;r.stepDown(),r.dispatchEvent(new Event("input"))}function D(){let e=document.body.dataset.currentModal;e=="adding"?document.querySelector("#cancel-add-item").click():e=="editing"?document.querySelector("#cancel-edit-item").click():e=="settings"&&document.getElementById("cancel-settings-change").click()}function ee(e){document.body.dataset.currentModal?e.target.closest(".modal")||D():!e.target.closest(".container")&&!e.target.closest(".theme-picker")&&!e.target.closest(".modal")&&M()}function xe(){document.querySelector("#change").value="$0.00",document.querySelector("#cash").value="$0.00"}function te(e){let t=document.querySelector(".modal-edit-item"),r=document.querySelector("#cancel-edit-item"),n=document.querySelector("#edited-item-name"),a=document.querySelector("#edited-item-price");if(!n.value.trim().length||!a.value.length)r.dispatchEvent(new Event("click"));else{let o=k.indexOf(e.currentTarget.dataset.previousItemName),i=document.querySelector('[data-order="'+Number(o+1)+'"'),s=w.formatToParts(a.value);if(s[1].type==="nan"){document.activeElement.blur();let h=document.querySelector("#alert-error");t.classList.add("modal-shake"),confirm.disabled=!0,h.textContent="Enter a valid price for "+n.value,h.classList.add("show"),v.errorTimer&&clearTimeout(v.errorTimer),v.errorTimer=setTimeout(K,2500),t.addEventListener("animationend",function b(){t.removeEventListener("animationend",b),t.classList.remove("modal-shake"),confirm.disabled=!1,a.focus()});return}s[1].value=s[1].value||"";let u=s[1].value+s[2].value+s[3].value;if(document.getElementById(n.value.toLowerCase()+"_"+u)){document.activeElement.blur();let h=document.querySelector("#alert-error");t.classList.add("modal-shake"),confirm.disabled=!0,h.textContent="Item already exists",h.classList.add("show"),v.errorTimer&&clearTimeout(v.errorTimer),v.errorTimer=setTimeout(K,2500),t.addEventListener("animationend",function b(){t.removeEventListener("animationend",b),t.classList.remove("modal-shake"),confirm.disabled=!1,n.focus()});return}i.children[0].ariaLabel="Remove "+n.value+" Menu Item",i.children[1].ariaLabel="Edit "+n.value+" Menu Item",i.children[2].dataset.price=u,i.children[2].innerText=n.value,i.children[3].children[0].ariaLabel="Decrement "+n.value,i.children[3].children[1].ariaLabel="Number of "+n.value,i.children[3].children[1].id=n.value.toLowerCase(),i.children[3].children[1].dataset.price=u,i.children[3].children[2].ariaLabel="Increment "+n.value,k[o]=n.value,q[o]=u,$(),i.children[3].children[1].dispatchEvent(new Event("input")),r.dispatchEvent(new Event("click"))}}function re(e){let r=e.currentTarget.parentElement.parentElement.querySelector(".cancel");L=F({},U),$(),r.dispatchEvent(new Event("click"))}function ne(e){let t=document.querySelector(".modal-add-item"),r=document.querySelector(".order"),n=e.currentTarget,a=document.querySelector("#cancel-add-item"),o=document.querySelector("#add-item-name"),i=document.querySelector("#add-item-price");if(!o.value.trim().length&&!i.value.length)a.dispatchEvent(new Event("click"));else if(o.value.trim().length)if(i.value.length){let s=w.formatToParts(i.value);if(s[1].type==="nan"){document.activeElement.blur();let b=document.querySelector("#alert-error");t.classList.add("modal-shake"),n.disabled=!0,b.textContent="Enter a valid price for "+o.value,b.classList.add("show"),v.errorTimer&&clearTimeout(v.errorTimer),v.errorTimer=setTimeout(K,2500),t.addEventListener("animationend",function m(){t.removeEventListener("animationend",m),t.classList.remove("modal-shake"),n.disabled=!1,i.focus()});return}s[1].value=s[1].value||"";let u=s[1].value+s[2].value+s[3].value;if(document.getElementById(o.value.toLowerCase()+"_"+u)){document.activeElement.blur();let b=document.querySelector("#alert-error");t.classList.add("modal-shake"),n.disabled=!0,b.textContent="Item already exists",b.classList.add("show"),v.errorTimer&&clearTimeout(v.errorTimer),v.errorTimer=setTimeout(K,2500),t.addEventListener("animationend",function m(){t.removeEventListener("animationend",m),t.classList.remove("modal-shake"),n.disabled=!1,o.focus()});return}let h=document.createElement("li");h.tabIndex="-1",h.dataset.order=Number(y)+1,h.innerHTML=ae(o.value,u,y),r.appendChild(h),k[y]=o.value,q[y]=u,y=Number(y)+1,W(y),$(),o.value="",i.value="",R(),Array.from(r.lastChild.lastChild.children).forEach(b=>{b.disabled=!0}),ie(h),I=document.querySelectorAll(".item-remove-button"),A=document.querySelectorAll(".item-edit-button"),o.focus()}else{document.activeElement.blur();let s=document.querySelector("#alert-error");t.classList.add("modal-shake"),n.disabled=!0,s.textContent="Please enter a price for "+o.value,s.classList.add("show"),v.errorTimer&&clearTimeout(v.errorTimer),v.errorTimer=setTimeout(K,2500),t.addEventListener("animationend",function u(){t.removeEventListener("animationend",u),t.classList.remove("modal-shake"),n.disabled=!1,i.focus()});return}else{document.activeElement.blur();let s=document.querySelector("#alert-error");t.classList.add("modal-shake"),n.disabled=!0,s.textContent="Please enter an item name",s.classList.add("show"),v.errorTimer&&clearTimeout(v.errorTimer),v.errorTimer=setTimeout(K,2500),t.addEventListener("animationend",function u(){t.removeEventListener("animationend",u),t.classList.remove("modal-shake"),n.disabled=!1,o.focus()});return}}function ae(e,t,r){const n=Q(e),a=Q(t),o=Q(r);return`<button aria-label="Remove ${n} Menu Item" class="menu-item-control x-button item-remove-button hidden" data-order="${Number(o)+.25}" tabindex="0" disabled></button>
        <button aria-label="Edit ${n} Menu Item" class="menu-item-control item-edit-button hidden" data-order="${Number(o)+.75}" tabindex="0" disabled>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"></path>
            </svg>
        </button>
        <h2 data-price="${a}">${n}</h2>
        <div class="quantity">
            <button aria-label="Decrement ${n}" class="decrement" tabindex="-1"></button>
            <input aria-label="Number of ${n}" type="number" pattern="[0-9]*" inputmode="numeric" data-name="${n}" data-price="${a}" data-quantity="0" min="0" max="99" value="0" name="Quantity" id="${n.toLowerCase()}_${a}" tabindex="-1">
            <button aria-label="Increment ${n}" class="increment" tabindex="-1"></button>
        </div>`}function R(){C.dataset.order=Number(y)+1,C.nextElementSibling.dataset.order=Number(y)+2}function oe(e=!1){console.log(L);for(const[t,r]of Object.entries(L)){let n=document.getElementById(t);n.checked=r,e&&n.addEventListener("click",we)}}function ie(e){let t=e.querySelector(".item-remove-button"),r=e.querySelector(".item-edit-button"),n=e.querySelector(".increment"),a=e.querySelector(".decrement"),o=e.querySelector("input");t.addEventListener("click",pe),r.addEventListener("click",ge),n.addEventListener("click",Y),a.addEventListener("click",Z),o.addEventListener("input",Se)}function _(){let e=document.querySelector("body"),t=document.querySelector(".controls").children;I.forEach(r=>{S(r,"any"),r.disabled=!0}),A.forEach(r=>{S(r,"any"),r.disabled=!0}),e.classList.add("no-scroll"),t[0].disabled=!0,t[1].disabled=!0,O.disabled=!0,C.disabled=!0}function V(){let e=document.querySelector("body"),t=document.querySelector(".controls").children;I.forEach(r=>{E(r),r.disabled=!1}),A.forEach(r=>{E(r),r.disabled=!1}),e.classList.remove("no-scroll"),t[0].disabled=!1,t[1].disabled=!1,O.disabled=!1,C.disabled=!1}function E(e){e.classList.remove("hidden"),e.offsetWidth,e.classList.add("show")}function S(e,t){e.classList.remove("show"),e.addEventListener("transitionend",function r(n){(t=="any"||n.propertyName==t)&&!e.matches(".show")&&(e.classList.add("hidden"),e.removeEventListener("transitionend",r))})}function Ie(){Array.from(document.querySelectorAll(".quantity")).forEach(e=>{Array.from(e.children).forEach(t=>{t.disabled=!0})})}function Ae(){Array.from(document.querySelectorAll(".quantity")).forEach(e=>{Array.from(e.children).forEach(t=>{t.disabled=!1})})}function Ce(e,t){let r=k[e],n=q[e];k.splice(e,1),q.splice(e,1),k.splice(t,0,r),q.splice(t,0,n),$(),X()}function ce(e){var t=e.getBoundingClientRect(),r=Math.max(document.documentElement.clientHeight,window.innerHeight);return!(t.bottom>0&&t.bottom<=r&&t.top>0&&t.top<=r)}function Ne(){switch(B){case"light":document.querySelector('meta[name="theme-color"]').setAttribute("content","#ffffff");break;case"dark":document.querySelector('meta[name="theme-color"]').setAttribute("content","#1c1c1c");break;case"system":window.matchMedia?window.matchMedia("(prefers-color-scheme: light").matches?document.querySelector('meta[name="theme-color"]').setAttribute("content","#ffffff"):window.matchMedia("(prefers-color-scheme: dark").matches?document.querySelector('meta[name="theme-color"]').setAttribute("content","#1c1c1c"):document.querySelector('meta[name="theme-color"]').setAttribute("content",window.getComputedStyle(document.body).getPropertyValue("background-color")):document.querySelector('meta[name="theme-color"]').setAttribute("content","#1c1c1c");break}}function W(e){document.querySelector(":root").style.setProperty("--num-of-items",Number(e))}function M(){document.querySelector(".edit").dispatchEvent(new Event("click"))}function De(){if(N.keyPressedCurrently=!1,N.keyPressedCurrently==!1){let e=document.querySelector("#alert-default");e.classList.remove("show"),e.addEventListener("transitionend",function t(r){r.propertyName==="opacity"&&!e.matches(".show")&&(e.textContent="",e.removeEventListener("transitionend",t))})}}function K(){let e=document.querySelector("#alert-error");e.classList.remove("show"),e.addEventListener("transitionend",function t(r){r.propertyName==="opacity"&&!e.matches(".show")&&(e.textContent="",e.removeEventListener("transitionend",t))})}function $(){localStorage.setItem("PoSData",JSON.stringify({numOfItems:y,names:k,prices:q,theme:B,settings:L}))}function Q(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function P(e,t){let r=document.querySelector('[data-order="'+(Number(e)-t)+'"]');r.focus(),ce(r)&&r.scrollIntoView()}function T(e,t){let r=document.querySelector('[data-order="'+(Number(e)+t)+'"]');r.focus(),ce(r)&&r.scrollIntoView()}document.addEventListener("keydown",e=>{const t="ArrowUp",r="ArrowLeft",n="ArrowDown",a="ArrowRight",o="KeyW",i="KeyA",s="KeyS",u="KeyD",h="Enter",b="Backspace",m="Escape",g=1,H=.5,c=document.activeElement,j=document.body.dataset.inEdit,de=document.body.dataset.finishingOrder,x=document.body.dataset.currentModal;let l=e.code;if(!l||l.indexOf("Numpad")!=-1||l.indexOf("Digit")!=-1)switch(l=e.key,e.key){case"w":case"W":l=o;break;case"a":case"A":l=i;break;case"s":case"S":l=s;break;case"d":case"D":l=u;break}if(!(c instanceof HTMLInputElement&&l!=m&&!c.parentElement.matches(".modal-content")&&!c.matches("input#cash"))){if(N.showKeys){let d="",f=e.key;l.indexOf("Key")!=-1?f=f.toUpperCase():l=="ArrowUp"?f="\u2191":l=="ArrowLeft"?f="\u2190":l=="ArrowRight"?f="\u2192":l=="ArrowDown"&&(f="\u2193"),console.log("press.key: "+e.key+", press.code: "+e.code+", displayKey: "+f),e.ctrlKey?(d=p.control,e.shiftKey&&(d+=" "+p.shift),e.altKey&&(d+=" "+p.alt),e.metaKey&&(d+=" "+p.meta),e.key!="Control"&&e.key!="Meta"&&e.key!="Alt"&&e.key!="Shift"?f=d+" + "+f:f=d):e.metaKey?(d=p.meta,e.shiftKey&&(d+=" "+p.shift),e.altKey&&(d+=" "+p.alt),e.key!="Control"&&e.key!="Meta"&&e.key!="Alt"&&e.key!="Shift"?f=d+" + "+f:f=d):e.altKey&&(d=p.alt,e.shiftKey&&(d+=" "+p.shift),e.key!="Control"&&e.key!="Meta"&&e.key!="Alt"&&e.key!="Shift"?f=d+" + "+f:f=d),document.querySelector("#alert-default").textContent=f,N.keyPressedCurrently==!0?clearTimeout(v.hideKeyPressTimer):(document.querySelector("#alert-default").classList.add("show"),N.keyPressedCurrently=!0),v.hideKeyPressTimer=setTimeout(De,2500)}if(e.altKey&&l=="KeyK"){N.showKeys=!N.showKeys;return}if(de=="true")if(document.activeElement.isContentEditable,c.parentElement.matches(".footer")){const d=c.dataset.order;switch(l){case r:case i:d!=Number(y)+1&&P(d,g);break;case a:case u:d!=Number(y)+2&&T(d,g);break;case b:document.querySelector(".edit").click()}}else switch(l){case r:case i:case a:case u:document.querySelector(".edit").focus();break;case m:case b:document.querySelector(".edit").click();break;case h:document.querySelector(".complete").click()}else if(j!="true")if(c.matches("li")){const d=c.dataset.order;if(isFinite(l)){let f=c.querySelector("input");f.value=f.value=="0"?l:f.value.slice(0,-1)+l,f.dispatchEvent(new Event("input"))}else switch(l){case t:case o:d!=1&&P(d,g),e.preventDefault();break;case n:case s:T(d,g),e.preventDefault();break;case r:case i:Z(c.querySelector(".decrement"));break;case a:case u:Y(c.querySelector(".increment"));break;case h:document.querySelector(".complete").click();break;case b:let f=c.querySelector("input");f.value=f.value.length==1?0:f.value.slice(0,-1),f.dispatchEvent(new Event("input"));break}}else if(c.parentElement.matches(".footer")){const d=c.dataset.order;switch(l){case t:case o:document.querySelector('[data-order="'+y+'"]').focus(),e.preventDefault();break;case r:case i:d!=Number(y)+1&&P(d,g);break;case a:case u:d!=Number(y)+2&&T(d,g);break}}else l==t||l==n||l==r||l==a||l==o||l==s||l==i||l==u?(document.querySelector('[data-order="1"]').focus(),e.preventDefault()):l==h&&document.querySelector(".complete").click();else if(x!="settings"){if(x=="adding"||x=="editing")switch(l){case t:c.matches("#add-item-name")||c.matches("#edited-item-name")?c.parentElement.previousElementSibling.focus():c.matches("#add-item-price")||c.matches("#edited-item-price")?c.previousElementSibling.previousElementSibling.focus():(c.matches(".cancel")||c.matches(".confirm"))&&c.parentElement.previousElementSibling.children[3].focus();break;case r:c.matches(".cancel")?(c.parentElement.previousElementSibling.children[3].focus(),e.preventDefault()):c.matches(".confirm")&&(c.previousElementSibling.focus(),e.preventDefault());break;case n:c.matches(".x-button")?c.nextElementSibling.children[1].focus():c.matches("#add-item-name")||c.matches("#edited-item-name")?c.nextElementSibling.nextElementSibling.focus():c.matches("#add-item-price")||c.matches("#edited-item-price")?c.parentElement.nextElementSibling.children[0].focus():c.matches(".cancel")&&c.nextElementSibling.focus();break;case a:c.matches(".x-button")?(c.nextElementSibling.children[1].focus(),e.preventDefault()):c.matches(".cancel")&&(c.nextElementSibling.focus(),e.preventDefault());break;case h:c.matches("#add-item-name")||c.matches("#edited-item-name")?c.nextElementSibling.nextElementSibling.focus():(c.matches("#add-item-price")||c.matches("#edited-item-price"))&&(x=="adding"?document.querySelector("#confirm-add-item").click():x=="editing"&&document.querySelector("#confirm-edit-item").click());break;case m:x=="adding"?document.querySelector("#cancel-add-item").click():x=="editing"&&document.querySelector("#cancel-edit-item").click();break}else if(j=="true")if(c.matches(".item-remove-button")){const d=c.dataset.order;switch(l){case t:case o:P(d,g),e.preventDefault();break;case n:case s:d!=Number(y)-.75?T(d,g):document.querySelector(".edit").focus(),e.preventDefault();break;case a:case u:T(d,H),e.preventDefault();break;case r:e.preventDefault();break;case m:M();break}}else if(c.matches(".item-edit-button")){const d=c.dataset.order;switch(l){case t:case o:P(d,g),e.preventDefault();break;case n:case s:d!=Number(y)-.25?T(d,g):document.querySelector(".edit").focus(),e.preventDefault();break;case r:case i:P(d,H),e.preventDefault();break;case a:e.preventDefault();break;case m:M();break}}else if(c.parentElement.matches(".controls")){const d=c.dataset.order;switch(l){case n:case s:T(d,g),e.preventDefault();break;case r:case i:d!=-.75&&P(d,H);break;case a:case u:d!=-.25&&T(d,H);break;case m:M();break}}else c.matches(".edit")?l==t||l==o?(document.querySelector('[data-order="'+(Number(y)-.75)+'"]').focus(),e.preventDefault()):l==m&&M():l==t||l==n||l==r||l==a||l==o||l==s||l==i||l==u?(document.querySelector('[data-order="0.25"]').focus(),e.preventDefault()):l==m&&M()}}});var p={meta:"Meta",alt:"Alt",control:"Ctrl",shift:"Shift"};/(Mac|iPhone|iPod|iPad)/i.test(navigator.userAgent)&&(p.meta="\u2318",p.alt="\u2325",p.control="\u2303",p.shift="\u21E7");var le=fe.create(document.querySelector("ul"),{onStart:function(){document.querySelector(".price_footer").classList.add("dragging")},onEnd:function(e){document.querySelector(".price_footer").classList.remove("dragging"),Ce(e.oldIndex,e.newIndex)},disabled:!0,filter:".menu-item-control, .menu-item-control svg",preventOnFilter:!1,animation:250});