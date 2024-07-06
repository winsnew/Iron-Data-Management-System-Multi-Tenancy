import{r as s,j as e,I as b,d as F}from"./app-623ed0f4.js";import{a as v}from"./axios-28bc18a3.js";import{a as he,d as xe}from"./Delete-420f6154.js";import{d as me}from"./Update-0995898d.js";import{H as ue}from"./Homepage-08511e85.js";import{u as pe,T as n,a as o,M as L,B as N,P as fe}from"./Box-957a2bf3.js";import{u as je}from"./useMediaQuery-3b20bec3.js";import{S as ge}from"./Snackbar-339c9b43.js";import{M as ye}from"./Alert-010238a0.js";import{T as w,F as I,I as be,S as ve}from"./TextField-5a304923.js";import{M as z}from"./MenuItem-d02030d1.js";import{T as we,a as Ie,b as Se,c as S,d as Ce}from"./TableRow-d2f5aa9a.js";import{T as a}from"./TableCell-3fbb70b1.js";import{I as H}from"./IconButton-3addbdd0.js";import{T as Te}from"./TablePagination-9505c5d0.js";import"./listItemTextClasses-8727f840.js";const Qe=({returnorders:i,successMessage:C,deleteMessage:T,updateMessage:Pe})=>{const[P,$]=s.useState([]),[W,k]=s.useState([]),[G,Q]=s.useState(!1),[U,M]=s.useState(!1),[r,c]=s.useState({return_raw_no:"",date:"",note:"",status:""}),[h,D]=s.useState(null),[Y,R]=s.useState(null),[x,q]=s.useState(""),[_,ke]=s.useState(0),[m,E]=s.useState(0),[d,J]=s.useState(5),K=window.location.href,V=pe(),[X,u]=s.useState(!1),[Z,O]=s.useState(""),[ee,B]=s.useState("success"),te=(t,l)=>{E(l)},se=t=>{J(parseInt(t.target.value,10)),E(0)};s.useEffect(()=>{const t=i.filter(l=>l.name&&l.name.toLowerCase().includes(x.toLowerCase()));k(t)},[P,x]),s.useEffect(()=>{const t=i.slice(0,_);k(t)},[P,x,_]),s.useEffect(()=>{C&&(B("success"),O("Item added successfully"),u(!0))},[C]),s.useEffect(()=>{T&&(B("warning"),O("Item deleted successfully"),u(!0))},[T]);const p=async()=>{try{const t=await F.Inertia.visit(K,{method:"get",data:{},replace:!1,preserveState:!1,preserveScroll:!1});$(t)}catch(t){console.error("Error fetching items:",t)}};s.useEffect(()=>{},[]);const ae=async()=>{try{await v.post("/receive-order",r),f(),c({return_raw_no:"",date:"",note:"",status:""}),p()}catch(t){console.error("Error adding item:",t)}},ne=t=>{R(t),ie()},re=()=>{try{v.delete(`/delete-return-order-raw/${Y}`).then(()=>{}),j(),F.Inertia.reload()}catch(t){console.error("Error deleting item:",t)}},le=async()=>{try{await v.put(`/receive-order/${h}`,r),f(),c({return_raw_no:"",date:"",note:"",status:""}),D(null),p()}catch(t){console.error("Error updating item:",t)}},oe=()=>{h?(le(),p()):ae()},A=()=>{f()},f=()=>{Q(!1),c({return_raw_no:"",date:"",note:"",status:""}),D(null)},ie=()=>{M(!0)},j=()=>{M(!1),R(null)},g=t=>{c({...r,[t.target.name]:t.target.value})},de=t=>{q(t.target.value)},y=je(V.breakpoints.down("sm"));return e.jsxs(ue,{children:[e.jsx(ge,{open:X,autoHideDuration:4e3,onClose:()=>u(!1),anchorOrigin:{vertical:"bottom",horizontal:"right"},style:{marginBottom:"30px",marginRight:"30px"},children:e.jsx(ye,{elevation:6,variant:"filled",severity:ee,onClose:()=>u(!1),children:Z})}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsx(n,{variant:"h4",children:"Return Order"}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",flexDirection:y?"column":"row"},children:[e.jsx(b,{href:"/return-order-detail",style:{marginBottom:y?"10px":"0"},children:e.jsx(o,{variant:"contained",size:"small",style:{marginRight:"20px"},children:"Raw Product"})}),e.jsx(b,{href:"/return-order-goods",style:{marginBottom:y?"10px":"0"},children:e.jsx(o,{variant:"contained",size:"small",children:"Goods Product"})})]})]}),e.jsx("hr",{style:{color:"white"}}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"10px"},children:[e.jsx("div",{style:{display:"flex",alignItems:"center",flexDirection:"row"}}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsx(n,{variant:"h4"}),e.jsx(w,{label:"Search..",variant:"outlined",value:x,onChange:de,style:{width:"150px"},size:"small"})]})]}),e.jsx(L,{open:G,onClose:A,"aria-labelledby":"add-item-modal","aria-describedby":"form-for-adding-or-editing-item",children:e.jsxs(N,{sx:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:540,bgcolor:"background.paper",boxShadow:24,p:4},children:[e.jsx(n,{variant:"h6",gutterBottom:!0,children:h?"Edit Material":"Add Material"}),e.jsx(I,{fullWidth:!0,sx:{mb:2},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsx(n,{variant:"body1",style:{marginRight:"10px"},children:"Code"}),e.jsx(w,{label:"Code",variant:"outlined",name:"code",value:r.code,onChange:g,sx:{width:"300px"}})]})}),e.jsx(I,{fullWidth:!0,sx:{mb:2},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsx(n,{variant:"body1",style:{marginRight:"10px"},children:"Name"}),e.jsx(w,{label:"Name",variant:"outlined",name:"name",value:r.name,onChange:g,sx:{width:"300px"}})]})}),e.jsx(I,{fullWidth:!0,sx:{mb:2},children:e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsx(n,{variant:"body1",style:{marginRight:"10px"},children:"Status"}),e.jsx(be,{id:"status-label"}),e.jsxs(ve,{labelId:"status-label",id:"status",name:"status",value:r.status,onChange:g,sx:{width:"300px"},children:[e.jsx(z,{value:"1",children:"Active"}),e.jsx(z,{value:"0",children:"Inactive"})]})]})}),e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",marginTop:"20px"},children:[e.jsx(o,{variant:"contained",color:"primary",onClick:oe,children:h?e.jsx(me,{}):"Save"}),e.jsx(o,{variant:"contained",color:"secondary",onClick:A,style:{marginLeft:"10px"},children:"Cancel"})]})]})}),e.jsx(L,{open:U,onClose:j,"aria-labelledby":"delete-confirmation-modal","aria-describedby":"confirmation-dialog-for-deleting-item",children:e.jsxs(N,{sx:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:370,bgcolor:"background.paper",boxShadow:24,p:4,textAlign:"center"},children:[e.jsx(n,{variant:"h6",gutterBottom:!0,children:"Are you sure you want to delete this item?"}),e.jsx(o,{variant:"contained",color:"primary",onClick:re,children:"Yes"}),e.jsx(o,{variant:"contained",color:"secondary",onClick:j,style:{marginLeft:"10px"},children:"Cancel"})]})}),e.jsxs("div",{children:[e.jsx(we,{component:fe,style:{marginTop:"20px"},children:e.jsxs(Ie,{size:"small",children:[e.jsx(Se,{style:{height:"3em"},children:e.jsxs(S,{children:[e.jsx(a,{children:e.jsx("b",{children:"No."})}),e.jsx(a,{children:e.jsx("b",{children:"RO No."})}),e.jsx(a,{children:e.jsx("b",{children:"Date"})}),e.jsx(a,{children:e.jsx("b",{children:"Type"})}),e.jsx(a,{children:e.jsx("b",{children:"Note"})}),e.jsx(a,{children:e.jsx("b",{children:"Status"})}),e.jsx(a,{children:e.jsx("b",{children:"Setting"})})]})}),e.jsx(Ce,{children:i&&i.length>0?i.slice(m*d,m*d+d).map((t,l)=>{const ce=m*d+l+1;return e.jsxs(S,{children:[e.jsx(a,{children:ce}),e.jsx(a,{children:t.return_raw_no}),e.jsx(a,{children:t.date}),e.jsx(a,{children:t.type}),e.jsx(a,{children:t.note}),e.jsx(a,{children:t.status}),e.jsxs(a,{children:[e.jsx(H,{color:"secondary",onClick:()=>ne(t.id),children:e.jsx(he,{})}),e.jsx(b,{href:"/edit-return-order-raw/"+t.id,children:e.jsx(H,{color:"primary",children:e.jsx(xe,{})})})]})]},t.id)}):e.jsx(S,{children:e.jsx(a,{align:"center",colSpan:7,children:"No data available"})})})]})}),e.jsx("hr",{style:{color:"white"}}),e.jsx(Te,{rowsPerPageOptions:[5,10,25],component:"div",count:W.length,rowsPerPage:d,page:m,onPageChange:te,onRowsPerPageChange:se})]})]})};export{Qe as default};
