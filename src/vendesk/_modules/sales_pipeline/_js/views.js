
     
let form=document.getElementById("form");
if(form)
 form.addEventListener(
"fous",
function(event){
     event.target.style.background = "blue"
},
 true
);

if(form)
form.addEventListener(
 "blur",
 function(event){
    event.target.style.background = ""
 },
true
);


window.addEventListener("load", (event) => {
  views.init();
});


var views={
    module_newetapa:null,
    init:function()
    {
        module_newetapa=document.querySelector(".nuevo");
    },
    select:function(id,data)
    {
        var select="";
        for (var i = 0; i<data.length; i++) {
            var d=data[i];
             if(i==0)
                views.edit_view(d);
            select+=`<option value="${d.sys_pk}">${d.codigo ?? ""+"  "+d.name}</option>`;
        }

        var sel=document.querySelector(id);
        if(sel){
            sel.innerHTML=select;
        }
    },
    print_stages:function(data)
    {
        var stages="";
        if(data!=null)
        {
            for(var j=0;j<data.stages.length;j++)
            {
                var stg=data.stages[j];
                stages+=stage(stg);
            }
        }
      

        var sel=document.querySelector("#conten-padre");
        if(sel)
            sel.innerHTML=stages;
            views.module_newstage();
    },

    show_modal:function(idmodal)
	{
		var element=document.querySelector("#"+idmodal);

		if(element)
			element.classList.remove("hidde_control");
	},
    close_modal:function(idmodal){
        var close=document.querySelector("#"+idmodal)

        if(close)
        {
            close.classList.add("hidde_control");
        }
        // views.hide_Allmodule(true);
        views.view_new(true);
    },
    module_newstage()
    {
        if(list_stages && module_newetapa)
            list_stages.appendChild(module_newetapa);
       
    },
     edit_view:function(data){
        if(data==null)
            return;

        var name = document.getElementById("txt_name");
        var sys_pk=document.getElementById("inpu_syspk");
        var probability=document.getElementById("pipeline_probability");
        if(data && data.length>0)
        {
            name.value=data[0].name;
            sys_pk.value=data[0].sys_pk;
            probability.checked=data[0].probability ?? false;
        }else
        {
            name.value=data.name;
            sys_pk.value=data.sys_pk;
            probability.checked=data.probability ?? false;
        }
        

        
    },
    clear_modal:function(){
        var name = document.getElementById("txt_name");
        var sys_pk=document.getElementById("inpu_syspk")
        var probability=document.getElementById("pipeline_probability");
        probability.checked=false;
        name.value="";
        sys_pk.value="";

    },
    disable_enable_stages:function(enable=false)
    {
        if(list_stages)
        {
            for (var i =0; i < list_stages.childNodes.length; i++) {
                var stage=list_stages.childNodes[i];
                if(stage.id!="" && stage.id!="new")
                {

                    var elements=document.querySelectorAll(`#${stage.id} input`);
                    var togle=document.querySelector(`#${stage.id} .switch2`);

                    if(enable)
                        togle.classList.remove("p-event-n");
                    else
                        togle.classList.add("p-event-n");

                    for (var j = 0; j<elements.length; j++) {
                        var inp=elements[j];
                        if(enable){
                            inp.classList.remove("p-event-n");
                             if(j==0)
                                inp.focus();
                        }
                        else
                            inp.classList.add("p-event-n");
                       
                    }
                    
                }
            }
        }
    },
    edit_stage:function(id,btn=null,cancel=false)
    {
        var elements=document.querySelectorAll(`#${id} input`);
        var togle=document.querySelector(`#${id} .switch2`);
        if(togle)
            togle.classList.remove("p-event-n");

        var btn_save=document.querySelector(`#${id} #stage-save`);
        var btn_cancel=document.querySelector(`#${id} #stage-cancel`);
        var btn_edit=document.querySelector(`#${id} #stage-edit`);
        var pipelines=document.querySelector(`#pipelines`);

        var btnedit=document.querySelector(`#btn-edit`);
        var btnadd=document.querySelector(`#btn-more`);
        var btndelte=document.querySelector(`.btn-delete`);

        if(elements)
        {
             for (var j = 0; j<elements.length; j++) 
             {
                var inp=elements[j];
                if(!cancel)
                    inp.classList.remove("p-event-n");
                else{
                    inp.classList.add("p-event-n");
                    if(togle) togle.classList.add("p-event-n");
                }
            }
            if(btn!=null)btn.classList.add("hidde_control");
            if(btn_save && !cancel)btn_save.classList.remove("hidde_control");
            if(btn_cancel && !cancel)btn_cancel.classList.remove("hidde_control");
            if(pipelines)pipelines.classList.add("p-event-n");
            if(btnedit)btnedit.classList.add("p-event-n")
            if(btnadd)btnadd.classList.add("p-event-n")
            if(btndelte)btndelte.classList.add("p-event-n")
            if(cancel)
            {
                if(btn_save)btn_save.classList.add("hidde_control");
                if(btn_cancel)btn_cancel.classList.add("hidde_control");
                if(btn_edit)btn_edit.classList.remove("hidde_control");
                if(pipelines)pipelines.classList.remove("p-event-n");

                if(btnedit)btnedit.classList.remove("p-event-n");
                if(btnadd)btnadd.classList.remove("p-event-n");
                if(btndelte)btndelte.classList.remove("p-event-n");
            }
        }
    },
    delete_stage:function(id)
    {
        remove(id);
        views.view_new();
    },
    view_new:function(visible=true)
    {
        var newelm=document.querySelector("#new");
        if(newelm)
        {
            if(visible)newelm.classList.remove("hidde_control");
            else
                newelm.classList.add("hidde_control");
        }
    },
    appendOption:function(id,data)
    {
        var select=document.querySelector(id);

        if(select)
            for (var i =0; i <data.length; i++) {
                var d=data[i];
                select.insertAdjacentHTML('afterbegin', `
                  <option value="${d.sys_pk}">${d.name}</option>
                `);
            }      
    },
    mostrarMensaje(uuid) 
    {
        var popup = document.getElementById(`popup${uuid}`);
        
        if(popup)
        popup.classList.toggle("show");
    },
    message:function(uuid,idf,text="", titulo="")
    {
    
        if (text==""&& titulo=="")
        {
            text=text_;
            titulo=tilte;

        }
        
        return `<icons class="ico popup"> 
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#888" onclick="views.mostrarMensaje('${idf+uuid}')" class="bi bi-question-circle-fill" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.496 6.033h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286a.237.237 0 0 0 .241.247zm2.325 6.443c.61 0 1.029-.394 1.029-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94 0 .533.425.927 1.01.927z">
                        </path>
                    </svg>
                        <span class="popuptext" id="popup${idf+uuid}">
                            <h4>${titulo}</h4>
                            ${text}
                            </span>
                </icons>`;
        
        
    }
    ,
    txtchange:function(e,uuid)
    {
        var input=document.getElementById(e);
        var lbl=document.querySelector(`#lbl${uuid}`);
        if(lbl)
            lbl.innerHTML=input.value;

        input.setAttribute("value",input.value);
      

    },
    addNewStagePosition:function(e,parent)
    {
        if(!e)
            return;

        var position=e.getAttribute("position");
        var parent=document.getElementById(parent);

        var postn="beforebegin";
        switch(position)
        {
            case "after":postn="afterend";break;
        }

        if(parent){
            parent.insertAdjacentHTML(postn,stage(null,false));
            views.view_new(false);
        }

    },
    parent_select:function(uuid)
    {
        if(uuid=="")
            return;

        var parent=document.querySelector(uuid);
        views.delete_itemhover();
        if(parent){
            parent.classList.add("item_hover");
        }


    },
    delete_itemhover:function()
    {
         if(list_stages)
        {
            for (var i =0; i < list_stages.childNodes.length; i++) {
                var stage=list_stages.childNodes[i];
                if(stage.id!="" && stage.id!="new")
                {
                    stage.firstElementChild.classList.remove("item_hover");
                }
            }
        }
    },
    delete_border:function()
    {
        if(list_stages)
        {
            for (var i = 0; i <list_stages.childNodes.length; i++) {
                var parent=list_stages.childNodes[i];
                if(parent.id!="" && parent.id!="new")
                {
                    var head=document.querySelector(`#${parent.id} #head`);
                    var container=document.querySelector(`#${parent.id} .container1`);
                    var controls=document.querySelector(`#${parent.id} .botn-delete`);

                    head.classList.remove("border-right");
                    container.classList.remove("border-right");
                    controls.classList.remove("border-right");
                    head.classList.remove("border-left");
                    container.classList.remove("border-left");
                    controls.classList.remove("border-left");
                }
            }
        }
    },
    save_secuences:function()
    {

        var list_secuences=[];
        if(list_stages)
        {
            for (var i = 0; i <list_stages.childNodes.length; i++) {
                var parent=list_stages.childNodes[i];
                if(parent.id!="" && parent.id!="new")
                {
                    var sys_pk=parent.childNodes[1].getAttribute("stage");
                    list_secuences.push(Number(sys_pk));
                }
                
            }
        }
        return list_secuences;
    },
    getpositionStageByid(id)
    {
        var list_secuences=[];
        if(list_stages)
        {
            for (var i = 0; i <list_stages.childNodes.length; i++) {
                var parent=list_stages.childNodes[i];
                if(parent.id!="" && parent.id!="new")
                {
                    var idstage=parent.childNodes[1].id;
                    if(id===idstage)
                        return i;
                }
                
            }
        }
    },
    hide_Allmodule:function(flag=false)
    {
        var m=document.querySelector("#body-first");
        var n=document.querySelector("#new");
        var nh=document.querySelector("#new h6");
        var nb=document.querySelector("#new button");
        if(flag)
        {
            nb.setAttribute("onclick","controller.view_modal(); controller.clear()");
            nh.innerHTML="Añadir pipeline";
            nb.innerHTML="Agregar pipeline";
            m.classList.add("hidde_control");
            n.setAttribute("pipeline",true);
            n.setAttribute("onclick","controller.view_modal(); controller.clear()");
        }else{
            nb.removeAttribute("onclick");
            nh.innerHTML="Añadir una etapa";
            nb.innerHTML="Nueva etapa";
            m.classList.remove("hidde_control");
            n.removeAttribute("pipeline");
            n.removeAttribute("onclick");
        }
        

    }
   

}