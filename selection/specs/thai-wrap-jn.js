function thaiWrap() {
  /* if it is Internet Explorer, do nothing. */
  /* note: Opera can identified itself as IE, but we should treat it as Opera. */
  var ua = navigator.userAgent.toLowerCase();
  if((ua.indexOf("opera")<=0)&&(ua.indexOf("msie")>0)) return;

  /* compare function for sorting */
  function cnum(a,b) {
    return a-b
  }

  /* unambiguous words that are common, like prepositions */
  cw="(เป็น|อยู่|จะ|ใช้|ได้|ให้|ใน|จึง|หรือ|และ|กับ|เนื่อง|ด้วย|ถ้า|แล้ว|ทั้ง|เพราะ|ซึ่ง|ซ้ำ|ไม่|ใช่|ต้อง|กัน|จาก|ถึง|นั้น|ผู้|ความ|ส่วน|ยัง|ทั่ว|อื่น|โดย|สามารถ|เท่า|ใต้|ใส่|ใด|ไว้|ใหม่|ใหญ่|เล็ก|ใกล้|ไกล|เขา|ช่วย|ฉบับ|ค้น|เร็ว|เข้า|เช้า)";
  /* leading chars */
  lc="[เ-ไ]|\\(|\\[|\\{|\"";
  /* "following" chars */
  fc="ฯ|[ะ-ฺ]|[ๅ-๎]|\\)|\\]|\\}|\"";
  /* thai chars */
  tc="ก-ฺเ-๏๚๛";

  regexes = [
    // following chars followed by leading chars
    new RegExp("("+fc+")(?=("+lc+"))")
    // thai followed by non-thai
  , new RegExp("(["+tc+"])(?![\\)\\]\\}\"]|["+tc+"])")
    // non-thai followed by thai
  , new RegExp("([^"+tc+"\\(\\(\\[\\{\"])(?=["+tc+"])")
    // non-leading char followed by known word
  , new RegExp("([^"+lc+"])(?=("+lc+")*"+cw+"("+fc+")?)")
    // known word followed by non-following chars */
  , new RegExp("(("+lc+")*"+cw+"("+fc+")*)(?!"+fc+")")
    // end-of-word symbols */
  , new RegExp("([ๅๆำ])")
  ]

  lengths = [1, 1, 1, 1, 1,1]

  

    /* do breaks */
    function F(n){
    var p,a,c,x,t,e;
    if(n.nodeType==3){
     /* find all possible break points */
     p=new Array();
     for(i=0;i<r.length;i++){
      t=n.data.search(r[i]);
      if(t>=0){
       if(l[i]>=0){p.push(t+l[i]);}
       else{e=n.data.match(r[i]);p.push(t+e[1].length);}
      }
     }
     /* use the left-most break point */
     if(p.length>0){
      p.sort(cnum);
      if(p[0]>=0){
       a=n.splitText(p[0]);
       /*n.parentNode.insertBefore(document.createElement("WBR"),a);*/
       /* Use zero-width space instead of <WBR> */
       /* as Opera doesn't support <WBR>, http://www.quirksmode.org/oddsandends/wbr.html */
       n.parentNode.insertBefore(document.createTextNode("\u200b"),a);
      }
     }
    }else{
     if(n.tagName!="STYLE"&&n.tagName!="SCRIPT"){
      for(c=0;x=n.childNodes[c];++c){F(x);}}
    }
  }
}