/*!
 * replaceUrlParam.min.js
 */
 function replaceUrlParam(t,e,n){var i=new RegExp("("+e+"=).*?(&|$)"),o=t;return o=t.search(i)>=0?t.replace(i,"$1"+n+"$2"):o+(o.indexOf("?")>0?"&":"?")+e+"="+n}
