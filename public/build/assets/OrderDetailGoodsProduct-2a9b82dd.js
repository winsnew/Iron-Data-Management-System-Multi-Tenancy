import{r,j as e,d as te}from"./app-623ed0f4.js";import{a as v}from"./axios-28bc18a3.js";import{a as se,d as re}from"./Delete-420f6154.js";import{H as ae}from"./Homepage-08511e85.js";import{T as i,a as l,M as ne,B as ie,P as b}from"./Box-957a2bf3.js";import{S as le,T as u}from"./TextField-5a304923.js";import{M as z}from"./MenuItem-d02030d1.js";import{T as R,a as k,b as M,c as j,d as A}from"./TableRow-d2f5aa9a.js";import{T as s}from"./TableCell-3fbb70b1.js";import{C as oe}from"./Checkbox-774633df.js";import{I as D}from"./IconButton-3addbdd0.js";import{T as de}from"./TablePagination-9505c5d0.js";import"./listItemTextClasses-8727f840.js";const Pe=({orderdetail:x})=>{const[K,E]=r.useState([]),[w,O]=r.useState([]),[B,C]=r.useState(!1),[ce,N]=r.useState(!1),[a,o]=r.useState({pc_recieve_raw_id:"",pc_order_raw_detail_id:"",reff_po:"",code:"",size:"",weight:"",weightPerKg:"",pricePerKg:"",price:"",delivery_cost:"",qty_rcv:""}),[_,g]=r.useState(null),[he,F]=r.useState(null),[S,pe]=r.useState(""),[m,I]=r.useState(0),[d,L]=r.useState(5),H=window.location.href,[c,U]=r.useState([]),W=(t,n)=>{I(n)},[$,q]=r.useState([]),G=t=>{L(parseInt(t.target.value,10)),I(0)};r.useEffect(()=>{const t=x.filter(n=>n.name.toLowerCase().includes(S.toLowerCase()));O(t)},[K,S]);const f=async()=>{try{const t=await te.Inertia.visit(H,{method:"get",data:{},replace:!1,preserveState:!1,preserveScroll:!1});E(t)}catch(t){console.error("Error fetching items:",t)}};r.useEffect(()=>{},[]);const J=async()=>{try{const t=a.weightPerKg*a.pricePerKg,n=x.filter(p=>$.includes(p.id));await v.post("/order-detail",{...a,amount:t,itemsToAdd:n}),y(),o({pc_order_raw_id:"",raw_product_id:"",code:"",material:"",size:"",status:"",note:"",weightPerKg:"",pricePerKg:""}),q([]),f()}catch(t){console.error("Error adding item:",t)}},Q=t=>{F(t),Z()},V=t=>{g(t.id),o({pc_order_raw_id:t.pc_order_raw_id,raw_product_id:t.raw_product_id,code:t.code,material:t.material,size:t.size,status:t.status,note:t.note}),T()},X=async()=>{try{await v.put(`/order-detail/${_}`,a),y(),o({pc_order_raw_id:"",raw_product_id:"",code:"",material:"",size:"",status:"",note:""}),g(null),f()}catch(t){console.error("Error updating item:",t)}},Y=()=>{_?(X(),f()):J();const t=x.filter(n=>c.includes(n.id));v.post("/order-detail",{...a,amount,itemsToAdd:t})},P=()=>{y()},T=()=>{C(!0)},y=()=>{C(!1),o({pc_order_raw_id:"",raw_product_id:"",code:"",material:"",size:"",status:"",note:""}),g(null)},Z=()=>{N(!0)},h=t=>{o({...a,[t.target.name]:t.target.value})},ee=t=>{const n=c.includes(t)?c.filter(p=>p!==t):[...c,t];U(n)};return e.jsxs(ae,{children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsx(i,{variant:"h4",children:"Update Order Raw Product"}),e.jsx("div",{style:{display:"flex",justifyContent:"space-between"}})]}),e.jsx("hr",{}),e.jsxs("div",{style:{display:"flex",justifyContent:"center"},children:[e.jsxs("div",{style:{display:"table-column"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"center"},children:[e.jsx(i,{variant:"h7",style:{marginRight:"10px"},children:"Supplier"}),e.jsxs(le,{label:"Supplier",variant:"outlined",value:a.supplier,onChange:h,style:{width:"300px"},size:"small",name:"supplier",children:[e.jsx(z,{value:"supplier1",children:"Supplier 1"}),e.jsx(z,{value:"supplier2",children:"Supplier 2"})]})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",marginTop:"10px"},children:[e.jsx(i,{variant:"h7",style:{marginRight:"32px"},children:"Note"}),e.jsx(u,{label:"Note",variant:"outlined",value:a.note,onChange:h,style:{width:"300px"},size:"small",name:"note",multiline:!0,rows:4})]})]}),e.jsxs("div",{style:{display:"table-column"},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"center"},children:[e.jsx(i,{variant:"h7",style:{marginRight:"16px"},children:"Weight"}),e.jsx(u,{label:"Weight",variant:"outlined",value:a.weight,onChange:h,style:{width:"270px"},size:"small",name:"weight"}),e.jsx(i,{variant:"h7",style:{marginLeft:"5px",marginTop:"7px"},children:"Kg"})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",marginTop:"15px"},children:[e.jsx(i,{variant:"h7",style:{marginRight:"10px"},children:"Price/kg"}),e.jsx(u,{label:"Price/kg",variant:"outlined",value:a.pricePerKg,onChange:h,style:{width:"300px"},size:"small",name:"pricePerKg"})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"center",marginTop:"15px"},children:[e.jsx(i,{variant:"h7",style:{marginRight:"10px"},children:"Amount"}),e.jsx(u,{label:"Amount",variant:"outlined",value:a.amount,onChange:h,style:{width:"300px"},size:"small",name:"amount"})]})]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:"15px"},children:[e.jsx(i,{variant:"h4",children:"Product"}),e.jsx("div",{style:{display:"flex",justifyContent:"space-between",marginTop:"10px"},children:e.jsx(l,{variant:"contained",onClick:T,children:"Add New"})})]}),e.jsx("hr",{}),e.jsx(ne,{open:B,onClose:P,"aria-labelledby":"add-item-modal","aria-describedby":"form-for-adding-or-editing-item",children:e.jsxs(ie,{sx:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",width:840,bgcolor:"background.paper",boxShadow:24,p:4},children:[e.jsx(i,{variant:"h6",gutterBottom:!0,children:"Add Product"}),e.jsx("hr",{}),e.jsx(R,{component:b,style:{marginTop:"20px"},children:e.jsxs(k,{children:[e.jsx(M,{children:e.jsxs(j,{children:[e.jsx(s,{children:"Code"}),e.jsx(s,{children:"Material"}),e.jsx(s,{children:"Size"}),e.jsx(s,{children:"Select"})," "]})}),e.jsx(A,{children:x.map(t=>e.jsxs(j,{children:[e.jsx(s,{children:t.code}),e.jsx(s,{children:t.material}),e.jsx(s,{children:t.size}),e.jsx(s,{children:e.jsx(oe,{checked:c.includes(t.id),onChange:()=>ee(t.id)})})]},t.id))})]})}),e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end",marginTop:"20px"},children:[e.jsx(l,{variant:"contained",color:"primary",onClick:Y,children:"Save"}),e.jsx(l,{variant:"contained",color:"secondary",onClick:P,style:{marginLeft:"10px"},children:"Cancel"})]})]})}),e.jsx(i,{variant:"h4",style:{marginTop:"20px"}}),e.jsxs("div",{children:[e.jsx(R,{component:b,style:{marginTop:"20px"},children:e.jsxs(k,{size:"small",children:[e.jsx(M,{style:{height:"3em"},children:e.jsxs(j,{children:[e.jsx(s,{children:"No."}),e.jsx(s,{children:"Code"}),e.jsx(s,{children:"Material"}),e.jsx(s,{children:"Size"}),e.jsx(s,{children:"Status"}),e.jsx(s,{children:"Note"}),e.jsx(s,{children:"Setting"})]})}),e.jsx(A,{children:w.slice(m*d,m*d+d).map((t,n)=>{const p=m*d+n+1;return e.jsxs(j,{children:[e.jsx(s,{children:p}),e.jsx(s,{children:t.order_raw_no}),e.jsx(s,{children:t.date}),e.jsx(s,{children:t.type}),e.jsx(s,{children:t.note}),e.jsx(s,{children:t.status}),e.jsx(s,{children:t.status=="1"?"Active":t.status=="0"?"Inactive":""}),e.jsxs(s,{children:[e.jsx(D,{color:"secondary",onClick:()=>Q(t.id),size:"small",children:e.jsx(se,{fontSize:"small"})}),e.jsx(D,{color:"primary",onClick:()=>V(t),size:"small",children:e.jsx(re,{fontSize:"small"})})]})]},t.id)})})]})}),e.jsx("hr",{}),e.jsx(de,{rowsPerPageOptions:[5,10,25],component:"div",count:w.length,rowsPerPage:d,page:m,onPageChange:W,onRowsPerPageChange:G})]}),e.jsxs("div",{style:{display:"flex",justifyContent:"flex-end"},children:[e.jsx(l,{variant:"contained",color:"error",href:"/order",style:{marginRight:"10px"},children:"Close"}),e.jsx(l,{variant:"contained",color:"primary",href:"/order",style:{marginRight:"10px"},children:"Clear"}),e.jsx(l,{variant:"contained",color:"success",href:"/order",style:{marginRight:"10px"},children:"Save"})]})]})};export{Pe as default};
