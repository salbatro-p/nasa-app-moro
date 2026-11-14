import {translations} from './translations.js';
import {adventureTranslations} from './adventure-translations.js';
translations.push(...adventureTranslations);
const locales={en:'English',fr:'Français',ar:'العربية',tr:'Türkçe'};
let language='en';
try{const saved=localStorage.getItem('astra-language');if(Object.hasOwn(locales,saved))language=saved;}catch{}
const columns={en:0,fr:1,ar:2,tr:3};
const exact=new Map(translations.map(row=>[row[0],row]));
const insensitive=new Map(translations.map(row=>[row[0].toLowerCase(),row]));
const escape=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/ /g,'\\s*');
const patterns=translations.filter(row=>row[0].includes('{')).map(row=>{
 const names=[];let cursor=0,pattern='^';
 for(const match of row[0].matchAll(/\{(\w+)\}/g)){pattern+=escape(row[0].slice(cursor,match.index))+'([\\s\\S]*?)';names.push(match[1]);cursor=match.index+match[0].length;}
 return {row,names,regex:new RegExp(pattern+escape(row[0].slice(cursor))+'$')};
});
export const getLanguage=()=>language;
export function t(value,depth=0){
 if(language==='en'||depth>4)return value;
 const raw=String(value),source=raw.trim(),column=columns[language];
 const row=exact.get(source)||insensitive.get(source.toLowerCase());let translated;
 if(row)translated=row[column];
 else for(const entry of patterns){const match=source.match(entry.regex);if(match){const params=Object.fromEntries(entry.names.map((key,i)=>[key,t(match[i+1],depth+1)]));translated=entry.row[column].replace(/\{(\w+)\}/g,(_,key)=>params[key]);break;}}
 if(translated===undefined)return value;
 return raw.slice(0,raw.indexOf(source))+translated+raw.slice(raw.indexOf(source)+source.length);
}

// Keep canonical English separately so language changes never compound translations.
// Text nodes are updated in place, preserving buttons, focus, listeners and game state.
const originals=new WeakMap(),attributes=new WeakMap();
function translateNode(node){
 if(node.nodeType===Node.TEXT_NODE){
  if(!node.parentElement||node.parentElement.closest('script,style,select,kbd,code,[data-no-translate]'))return;
  const previous=originals.get(node),current=node.nodeValue;
  const source=previous&&previous.rendered===current?previous.source:current;
  const rendered=t(source);originals.set(node,{source,rendered});if(current!==rendered)node.nodeValue=rendered;
 }else if(node.nodeType===Node.ELEMENT_NODE){
  if(node.matches('script,style,select,kbd,code,[data-no-translate]'))return;
  let saved=attributes.get(node)||{};
  for(const name of ['aria-label','title']){if(node.hasAttribute(name)){const current=node.getAttribute(name),old=saved[name],source=old&&old.rendered===current?old.source:current,rendered=t(source);saved[name]={source,rendered};if(current!==rendered)node.setAttribute(name,rendered);}}
  attributes.set(node,saved);for(const child of node.childNodes)translateNode(child);
 }
}
let observer;
const observe=()=>observer.observe(document.getElementById('app'),{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['aria-label','title']});
function refresh(){observer?.disconnect();document.documentElement.lang=language;document.documentElement.dir=language==='ar'?'rtl':'ltr';translateNode(document.getElementById('app'));if(observer)observe();}
export function initLanguages(){
 const control=document.createElement('label');control.className='language-control';control.dataset.noTranslate='';
 const icon=document.createElement('span');icon.textContent='文/A';icon.setAttribute('aria-hidden','true');
 const select=document.createElement('select');select.id='language';select.setAttribute('aria-label',t('Language'));
 for(const [code,name] of Object.entries(locales)){const option=document.createElement('option');option.value=code;option.textContent=name;option.lang=code;select.append(option);}
 select.value=language;control.append(icon,select);document.querySelector('header nav').prepend(control);
 select.addEventListener('change',()=>{language=select.value;try{localStorage.setItem('astra-language',language);}catch{}refresh();select.setAttribute('aria-label',t('Language'));document.dispatchEvent(new Event('languagechange'));select.blur();});
 select.addEventListener('keydown',event=>event.stopPropagation());
 observer=new MutationObserver(records=>{observer.disconnect();const targets=new Set();for(const record of records){if(record.type==='childList')record.addedNodes.forEach(n=>targets.add(n));else targets.add(record.target);}for(const node of targets)if(node.isConnected)translateNode(node);observe();});
 refresh();
}
