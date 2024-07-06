import{h as H,j as R,s as j,q as s,b as C,t as P,l as T,v as _,m as A,_ as M,o as N,p as U}from"./Box-957a2bf3.js";import{r as n,j as D}from"./app-623ed0f4.js";const W=n.createContext(),E=W,L=n.createContext(),q=L;function B(e){return R("MuiTableCell",e)}const I=H("MuiTableCell",["root","head","body","footer","sizeSmall","sizeMedium","paddingCheckbox","paddingNone","alignLeft","alignCenter","alignRight","alignJustify","stickyHeader"]),J=I,F=["align","className","component","padding","scope","size","sortDirection","variant"],G=e=>{const{classes:a,variant:t,align:o,padding:r,size:g,stickyHeader:d}=e,x={root:["root",t,d&&"stickyHeader",o!=="inherit"&&`align${s(o)}`,r!=="normal"&&`padding${s(r)}`,`size${s(g)}`]};return U(x,B,a)},K=j("td",{name:"MuiTableCell",slot:"Root",overridesResolver:(e,a)=>{const{ownerState:t}=e;return[a.root,a[t.variant],a[`size${s(t.size)}`],t.padding!=="normal"&&a[`padding${s(t.padding)}`],t.align!=="inherit"&&a[`align${s(t.align)}`],t.stickyHeader&&a.stickyHeader]}})(({theme:e,ownerState:a})=>C({},e.typography.body2,{display:"table-cell",verticalAlign:"inherit",borderBottom:e.vars?`1px solid ${e.vars.palette.TableCell.border}`:`1px solid
    ${e.palette.mode==="light"?P(T(e.palette.divider,1),.88):_(T(e.palette.divider,1),.68)}`,textAlign:"left",padding:16},a.variant==="head"&&{color:(e.vars||e).palette.text.primary,lineHeight:e.typography.pxToRem(24),fontWeight:e.typography.fontWeightMedium},a.variant==="body"&&{color:(e.vars||e).palette.text.primary},a.variant==="footer"&&{color:(e.vars||e).palette.text.secondary,lineHeight:e.typography.pxToRem(21),fontSize:e.typography.pxToRem(12)},a.size==="small"&&{padding:"6px 16px",[`&.${J.paddingCheckbox}`]:{width:24,padding:"0 12px 0 16px","& > *":{padding:0}}},a.padding==="checkbox"&&{width:48,padding:"0 0 0 4px"},a.padding==="none"&&{padding:0},a.align==="left"&&{textAlign:"left"},a.align==="center"&&{textAlign:"center"},a.align==="right"&&{textAlign:"right",flexDirection:"row-reverse"},a.align==="justify"&&{textAlign:"justify"},a.stickyHeader&&{position:"sticky",top:0,zIndex:2,backgroundColor:(e.vars||e).palette.background.default})),O=n.forwardRef(function(a,t){const o=A({props:a,name:"MuiTableCell"}),{align:r="inherit",className:g,component:d,padding:x,scope:h,size:m,sortDirection:b,variant:z}=o,k=M(o,F),i=n.useContext(E),p=n.useContext(q),y=p&&p.variant==="head";let l;d?l=d:l=y?"th":"td";let c=h;l==="td"?c=void 0:!c&&y&&(c="col");const u=z||p&&p.variant,v=C({},o,{align:r,component:l,padding:x||(i&&i.padding?i.padding:"normal"),size:m||(i&&i.size?i.size:"medium"),sortDirection:b,stickyHeader:u==="head"&&i&&i.stickyHeader,variant:u}),$=G(v);let f=null;return b&&(f=b==="asc"?"ascending":"descending"),D.jsx(K,C({as:l,ref:t,className:N($.root,g),"aria-sort":f,scope:c,ownerState:v},k))}),X=O;export{X as T,q as a,E as b};
