import{o as a,c as l,a as e,t as _,b as g,n as b,u as f,d,s as c,r as P,w as S,v as C,e as k,F as w,f as h,g as u}from"./index-bae1f01e.js";import{_ as v}from"./_plugin-vue_export-helper-c27b6911.js";const M={props:{points:null,name:"Anonymous",isSelected:!1,isRevealed:!1,isReady:!1,isMyCard:!1,isBottomCard:!1}},x={class:"w3-container w3-center"},A={key:0,class:"w3-container w3-center"},R={class:"points"},B={key:1,class:"w3-container w3-center"},E={key:0,class:"points"};function G(n,t,i,y,r,o){return a(),l("div",{class:b(["w3-card w3-yellow w3-round-large card",{selected:i.isSelected,"w3-border w3-border-green":i.isMyCard,"bottom-card":i.isBottomCard}]),onClick:t[0]||(t[0]=m=>n.$emit("point-selected",i.points))},[e("header",x,[e("h3",null,_(i.name?i.name:" "),1)]),i.isRevealed?(a(),l("div",A,[e("span",R,_(i.points?i.points:"?"),1)])):(a(),l("div",B,[i.isReady?(a(),l("span",E,"👍")):g("",!0)]))],2)}const I=v(M,[["render",G],["__scopeId","data-v-69f35891"]]),V="paying",p="revealed",T={components:{Card:I},data(){return{player_id:null,game_id:null,name:"",points:null,showModal:!1,bonusPoint:null}},mounted(){this.game_id=this.$route.params.id,this.selectBonusPoint(),this.player_id=sessionStorage.getItem(this.game_id+"_player_id"),sessionStorage.getItem(this.game_id+"_player_name")&&(this.name=sessionStorage.getItem(this.game_id+"_player_name")),this.player_id||(this.player_id=f(16),sessionStorage.setItem(this.game_id+"_player_id",this.player_id)),d.auth={game_id:this.$route.params.id,player_id:this.player_id},d.connect(),this.name?this.joinGame():this.showModal=!0,d.on("reveal",(...n)=>{c.game.status=p}),d.on("reset",(...n)=>{this.points=null,c.game.status=V})},methods:{joinGame(){d.emit("join",{name:this.name},n=>{c.isAdmin=n.isAdmin}),sessionStorage.setItem(this.game_id+"_player_name",this.name)},sendPoints(){d.emit("points",{points:this.points})},setPoints(n){this.isRevealed||(this.points!=n?this.points=n:this.points=null,this.sendPoints())},reveal(){d.emit("reveal")},reset(){this.points=null,this.selectBonusPoint(),d.emit("reset")},selectBonusPoint(){let n=["🍺","🍨","☕","🌮","🍕","🍪","🍫"];this.bonusPoint=n[Math.floor(Math.random()*n.length)]}},computed:{connected(){return c.connected},players(){return c.players},game(){return c.game},isRevealed(){return c.game.status===p},isAdmin(){return c.isAdmin},selectablePoints(){return[1,2,3,5,8,13]}}},j={class:"w3-container w3-padding-top-32 w3-margin-top"},N={class:"w3-row"},D={key:0},L={class:"w3-col l1"},U={class:"w3-col l1"},z={class:"w3-col l1"},F={class:"w3-modal-content w3-round",style:{"max-width":"450px"}},q={class:"w3-container"},J={class:"w3-section"},Y=e("label",null,[e("b",null,"Enter your name")],-1),H={class:"w3-container w3-margin-top w3-padding-64"},K={class:"w3-container w3-cell"},O={class:"w3-container w3-row w3-margin-top w3-padding-64"},Q={class:"w3-container w3-col l1 m3"},W={class:"w3-container w3-col l1 m3"};function X(n,t,i,y,r,o){const m=P("card");return a(),l("main",null,[e("div",j,[e("div",N,[o.isAdmin?(a(),l("span",D,[e("div",L,[e("button",{class:"w3-button w3-xlarge w3-round-large w3-green",onClick:t[0]||(t[0]=(...s)=>o.reveal&&o.reveal(...s))},"Reveal")]),e("div",U,[e("button",{class:"w3-button w3-xlarge w3-round-large w3-blue",onClick:t[1]||(t[1]=(...s)=>o.reset&&o.reset(...s))},"Restart")])])):g("",!0),e("div",z,[e("button",{class:"w3-button w3-xlarge w3-white w3-border w3-border-green w3-round-large w3-text-green",onClick:t[2]||(t[2]=s=>r.showModal=!0)},"Change my name ")])])]),e("div",{id:"id01",class:"w3-modal",style:k(r.showModal?"display: block":"display: none")},[e("div",F,[e("div",q,[e("span",{onClick:t[3]||(t[3]=s=>{r.showModal=!1}),class:"w3-button w3-display-topright"},"×"),e("div",J,[Y,S(e("input",{class:"w3-input w3-border w3-margin-bottom",type:"text",placeholder:"Enter your name",name:"usrname",required:"","onUpdate:modelValue":t[4]||(t[4]=s=>r.name=s)},null,512),[[C,r.name]]),e("button",{onClick:t[5]||(t[5]=s=>{r.showModal=!1,this.joinGame()}),class:"w3-button w3-block w3-green w3-section w3-padding w3-round",type:"submit"},"Join ")])])])],4),e("div",H,[(a(!0),l(w,null,h(o.players,s=>(a(),l("div",K,[u(m,{name:s.name,points:s.points,"is-revealed":this.isRevealed,"is-ready":s.points,"is-my-card":s.player_id===this.player_id},null,8,["name","points","is-revealed","is-ready","is-my-card"])]))),256))]),e("div",O,[(a(!0),l(w,null,h(o.selectablePoints,s=>(a(),l("div",Q,[u(m,{name:"",points:s,onPointSelected:o.setPoints,"is-selected":this.points===s,"is-revealed":"true","is-bottom-card":!0},null,8,["points","onPointSelected","is-selected"])]))),256)),e("div",W,[u(m,{name:"",points:r.bonusPoint,onPointSelected:o.setPoints,"is-selected":this.points===r.bonusPoint,"is-revealed":"true"},null,8,["points","onPointSelected","is-selected"])])])])}const ee=v(T,[["render",X]]);export{ee as default};