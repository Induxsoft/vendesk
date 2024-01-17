var text_="Este valor representa la confianza que tienes en ganar el trato para la fecha de cierre prevista. La probabilidad puede asignarse por trato o etapa del embudo, y se utiliza para planificar tus ingresos futuros. La probabilidad por defecto para cada etapa es del 100%, pero puedes asignar cualquier valor entre 0% y 100%.";
var tilte="Probabilidad de ganar";


  $( document ).ready(function() {
    setInterval(function() {controller.save_secuences()},100);

}); 
$(document).ready(function()
{
                const divItem = document.getElementById("form");
                const divItem2 = document.getElementById("head");
                const divItem3 = document.getElementById("icon-mas");
                const divItem4 = document.getElementById("icon-mas1");
                const divItem5 = document.getElementById("btn-delete");

                if(divItem2) divItem2.addEventListener("click",(e)=>{
                    divClick()
                })
                if(divItem) divItem.addEventListener("click",(e)=>{
                    divClick()
                });

               
                 $(".nuevo").click(function(){
                    newstage(this);
                    views.view_new(false);
                 })
                function divClick(){
                    divItem.style.background="#F5F5F6"
                    divItem2.style.background="#F5F5F6"
                    divItem2.style.opacity="5"
                    divItem.style.opacity="5"
                    divItem3.style.visibility="visible"
                    divItem4.style.visibility="visible"
                    divItem5.style.visibility="visible"

                }


                        function addElement(){
                           
                            var newDiv = document.createElement("div");
                            var newContent = document.createTextNode("Hola!¿Qué tal?");
                            newDiv.appendChild(newContent); 

                            
                            var currentDiv = document.getElementById("div1");
                            document.body.insertBefore(newDiv, currentDiv);
                        }
               
                
});

 function newstage(e)
{
    if(e.hasAttribute("pipeline"))
        return;

    var t=e;
    
    var list_stages=document.getElementById("conten-padre");
    if(list_stages)
       list_stages.innerHTML+=stage(null,false); 
   if(e)
   {
        document.querySelector(".nuevo").remove();
        list_stages.appendChild(t);
   }
}
function onDragStart(event,id) {
  event
    .dataTransfer
    .setData('text/plain', id);

    views.delete_border();

    // event
    // .currentTarget
    // .style
    // .backgroundColor = 'yellow';
}
function onDragOver(event,iddest) {
  event.preventDefault();

  const obj = document.getElementById(iddest);
  const rec=obj.getBoundingClientRect();
  const limit=rec.x+(rec.width/2);

  var head=document.querySelector(`#${iddest} #head`);
  var container=document.querySelector(`#${iddest} .container1`);
  var controls=document.querySelector(`#${iddest} .botn-delete`);
  
    views.delete_border();
    if (event.clientX<limit)
    {
        head.classList.add("border-left");
        container.classList.add("border-left");
        controls.classList.add("border-left");
        positionEvent="beforebegin";
    }
    else{
        head.classList.add("border-right");
        container.classList.add("border-right");
        controls.classList.add("border-right");
        positionEvent="afterend";
    }

}
var positionEvent="afterend";

const max_tmss=10;
var timeout_save_sequence=max_tmss;
var is_sequence_dirty=false;

function onDrop(event,iddest) {
  const id = event
    .dataTransfer
    .getData('text');

  views.delete_border();

  is_sequence_dirty=true;
    timeout_save_sequence=max_tmss;

    const draggableElement = document.getElementById(id);
    var Elementohtml=draggableElement.outerHTML;
    const dropzone = document.getElementById(iddest);

    //dropzone.appendChild(draggableElement);
    dropzone.style.border_left="2px solid green";
    dropzone.insertAdjacentHTML(positionEvent,Elementohtml);

    event
    .dataTransfer
    .clearData();

    draggableElement.remove();
}
function stage(data=null,showcancel=true)
{
    if(data==null)
        data={
            ref_pipeline:idpipeline.value,
            sequence:0,
            name:"New Stage",
            probability:0,
            stuck_in_days:false,
            sys_pk:0
        };
    if(data.sys_pk==0)
        controller.in_modify(true);

    var uuid="stg"+controller.guid();
    return `<div class="height-55" id="parent_${uuid}" ondrop="onDrop(event,'parent_${uuid}');" ondragstart="onDragStart(event,'parent_${uuid}');" ondragover="onDragOver(event,'parent_${uuid}');" onclick="controller.parent_select('#${uuid}',event)">
        <div class="bg-white border container-pruebas ${uuid}" id="${uuid}" stage="${data.sys_pk}" style="display:flex;flex-direction:column;">
            <div class="head bg-white border-bottom shadow-none" draggable="true" id="head" >
                <icons class="icon-mas ${data.sys_pk==0 ? "hidde_control":""}" id="icon-mas" position="before" onclick="views.addNewStagePosition(this,'parent_${uuid}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"></path>
                    </svg>
                </icons>
                <div class="d-flex p-4 pt-2 pb-2 align-items-center" style="height:4.6rem;">
                    <div class="flex-grow-1">
                        <h6 class="navegacion m-0" id="lbl${uuid}">${data.name}</h6>
                    </div>
                    <div class="module-icons" >
                        <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                            <div class="btn-group" role="group">
                                <button id="btnGroupDrop4" type="button" class="btn btn-sm btn-light dropdown-toggle ps-1 pe-1 bg-transparent border-0" data-bs-toggle="dropdown" aria-expanded="false">
                                    Opciones
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="btnGroupDrop4">
                                    <li>
                                        <icon class="d-flex align-items-center gap-2 p-2 text-secondary icon-head ${data.sys_pk==0 ? "hidde_control":""}" id="stage-edit" onclick="controller.edit_stage('${uuid}',this,event)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                                            </svg>
                                            Editar
                                        </icon>
                                    </li>
                                    <li>
                                        <icon class="d-flex align-items-center gap-2 p-2 text-secondary icon-head" id="stage-delete" onclick="controller.delete_stage('#parent_${uuid}',${data.sys_pk})">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                            </svg>
                                            Eliminar
                                        </icon>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <icons class="icon-mas1 ${data.sys_pk==0 ? "hidde_control":""}" id="icon-mas1" position="after" onclick="views.addNewStagePosition(this,'parent_${uuid}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"></path>
                    </svg>
                </icons>
            </div>
            <div class="container1 flex-grow-1">
                <div class="p-4 grid-item grid-item-2  active" id="form">
                    <div class="letras">
                        <label for="" class="label"><small class="text-secondary">Nombre</small></label>
                        <input class="inputs mb-4" onkeyup="views.txtchange('input${uuid}','${uuid}')" id="input${uuid}" type="text" placeholder="Cualificado" value="${data.name}" maxlength="50">
                        <label for="" class="label"><small class="text-secondary">Probabilidad</small></label>
                        ${views.message(uuid,"prob")}
                        <input class="inputs mb-4" type="number" placeholder="100" value="${data.probability}" value="0" min="0" max="100">
                    </div>
                    <label dkli-for="" class="label"><small class="text-secondary">Estancado en (dias)</small></label>
                    ${views.message(uuid,"est")}
                    <label class="switch2">
                        <input type="checkbox" id="togBtn2" ${data.stuck_in_days==true ? "checked":""}>
                        <div class="slider2 round2">
                            <span class="on"></span>
                            <span class="off"></span>
                        </div>
                    </label>
                </div>
            </div>
            <div class="botn-delete p-4">
                <div class="d-flex align-items-end justify-content-end gap-2">
                    <button class="btn btn-sm p-1 ps-2 pe-2 btn-primary d-flex align-items-center gap-2 ${data.sys_pk!=0 ? "hidde_control":""}" id="stage-save" onclick="controller.save_stage('${uuid}',${data.sys_pk})">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2" viewBox="0 0 16 16">
                            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                        </svg>
                        <small>Guardar</small>
                    </button>
                    <button class="btn btn-sm p-1 ps-2 pe-2 btn-secaondary d-flex align-items-center gap-2 ${data.sys_pk!=0 || !showcancel ? "hidde_control":""}" id="stage-cancel" onclick="controller.edit_stage('${uuid}',this,event,true)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
                            <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
                        </svg>
                        <small>Cancelar</small>
                    </button>
                </div>
            </div>
        </div>
    </div>`;
}
//eliminar 
function remove(uuid)
 {
    if(uuid=="")
        return;

     var eDiv=document.getElementById("conten-padre");
         var id=`${uuid}`;
         var stage=document.querySelector(id);
         if(stage)
            eDiv.removeChild(stage);
    
 
}

                
