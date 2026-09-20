import sharp from 'sharp';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { writeFile } from 'node:fs/promises';
const W=576,H=720,fps=20;
const source='public/creators/editorial-grid.webp';
const {width,height}=await sharp(source).metadata();
const sw=Math.floor(width/3),sh=Math.floor(height/2);
const scenes=[
 {index:0,name:'Maya',place:'Dubai · Style & city life',title:'Meet your next',second:'brand partner.',step:'01 / FIND YOUR CREATOR',note:'Real people. Places your brand belongs.',tag:'Clothing · 7 days',color:'#f4c3a4'},
 {index:1,name:'Lena',place:'Lahore · Builders & remote work',title:'A café. A laptop.',second:'A place for your logo.',step:'02 / CHOOSE YOUR SPACE',note:'Pick a surface, location, and dates.',tag:'Laptop lid · 30 days',color:'#cbe3e5'},
 {index:2,name:'Marco',place:'London · Urban life & photography',title:'Your brief.',second:'Their choice.',step:'03 / MAKE AN OFFER',note:'Agree the price, artwork, and photo proof.',tag:'Offer → creator approval',color:'#dce5bd'},
 {index:3,name:'Kaito',place:'Tokyo · Travel & tech',title:'Your brand.',second:'Their next adventure.',step:'04 / BRING THE BRAND ALONG',note:'Wear it. Carry it. Show the placement.',tag:'Bag patch · 7 days',color:'#efd694'},
];
const photos=await Promise.all(scenes.map(s=>sharp(source).extract({left:s.index%3*sw,top:Math.floor(s.index/3)*sh,width:sw,height:sh}).resize(1056,840,{fit:'cover',position:'north'}).toBuffer()));
const encoder=spawn('ffmpeg',['-y','-loglevel','error','-f','image2pipe','-vcodec','mjpeg','-framerate',String(fps),'-i','pipe:0','-an','-c:v','libx264','-preset','medium','-crf','27','-pix_fmt','yuv420p','-movflags','+faststart','public/creators/momento-film.mp4'],{stdio:['pipe','inherit','inherit']});
const finished=once(encoder,'close');
for(let n=0;n<16*fps;n++){
 const t=n/fps,idx=Math.min(3,Math.floor(t/4)),local=t%4,s=scenes[idx];
 const zoom=1+local*.022;
 const photo=await sharp(photos[idx]).resize(Math.round(528*zoom),Math.round(420*zoom)).extract({left:Math.round((528*zoom-528)/2),top:0,width:528,height:420}).jpeg({quality:82}).toBuffer();
 const progress=528*t/16;
 const label=idx===2?'Offer ready to send':idx===3?'Your logo, along for the trip':s.tag;
 const overlay=`<svg width="576" height="720" xmlns="http://www.w3.org/2000/svg"><g font-family="DejaVu Sans,sans-serif" fill="#302c25"><text x="26" y="34" font-size="13" font-weight="700" letter-spacing="3">MOMENTO</text><text x="550" y="34" text-anchor="end" font-size="10">PEOPLE, GOING PLACES ↗</text><text x="26" y="76" font-size="11" letter-spacing="1.5">${s.step}</text><rect x="40" y="113" width="${idx===1?243:227}" height="29" rx="14" fill="#fffdf5"/><text x="54" y="133" font-size="11">${s.place.replaceAll('&','&amp;')}</text><rect x="40" y="454" width="${idx===3?256:idx===2?191:183}" height="44" rx="22" fill="${s.color}"/><text x="56" y="481" font-size="12" font-weight="700">${label}</text><text x="26" y="566" font-size="34" font-weight="700" letter-spacing="-1.6">${s.title}</text><text x="26" y="608" font-size="34" font-style="italic" font-family="DejaVu Serif,serif" fill="#a44c31" letter-spacing="-1.4">${s.second}</text><text x="26" y="641" font-size="12">${s.note}</text><rect x="24" y="666" width="528" height="3" rx="1" fill="#e1dacc"/><rect x="24" y="666" width="${progress}" height="3" rx="1" fill="#eb7853"/><text x="26" y="697" font-size="10" fill="#756e62">Illustrative concept · AI-created imagery</text><text x="550" y="697" text-anchor="end" font-size="10">0${idx+1} / 04</text></g></svg>`;
 const frame=await sharp({create:{width:W,height:H,channels:3,background:'#faf6ec'}}).composite([{input:photo,left:24,top:98},{input:Buffer.from(overlay)}]).jpeg({quality:85}).toBuffer();
 if(n===40) await writeFile('public/creators/film-poster.jpg',frame);
 if(!encoder.stdin.write(frame)) await once(encoder.stdin,'drain');
}
encoder.stdin.end(); const [code]=await finished; if(code) throw new Error('Encoding failed');
console.log('Rendered 16-second creator film.');
