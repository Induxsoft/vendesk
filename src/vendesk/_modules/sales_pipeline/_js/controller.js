var is_modify=false;
window.addEventListener("load", (event) => {
  controller.init();
  if(idpipeline)
  {
  	let lastSelectedIndex =idpipeline.selectedIndex;
  	idpipeline.addEventListener("click", function () {
        lastSelectedIndex = idpipeline.selectedIndex;
    });
  	idpipeline.addEventListener("change",function(e){
    	if(controller.verify_modify()){
    		idpipeline.selectedIndex=lastSelectedIndex;
    		e.stopPropagation();
    		return;
    	}
      controller.get_pipeline();
    });
  }
    
});

var controller={
  idpipeline:null,list_stages:null,
  init:function()
  {
    idpipeline=document.querySelector("#pipelines");
    list_stages=document.getElementById("conten-padre");
  },
	get_pipelines:function(id,data) {
		var uri=`${url}crm/sales/pipeline/`;
        model.invoke_service(uri,null,function(data) {

          views.select("#pipelines",data);
          views.print_stages(data[0]);
          views.edit_view(data[0]);
          views.disable_enable_stages();

          if(data[0]==null)
          {
            views.hide_Allmodule(true);
          }
        },
        function(error) {
          alert(error.message);
        },"GET",false);
	},
  get_pipeline:function()
  {
    var uri=`${url}crm/sales/pipeline/${idpipeline.value}`;
        model.invoke_service(uri,null,function(data) {
          views.print_stages(data[0]);
          views.edit_view(data[0]);
          views.view_new(true);
          views.disable_enable_stages();
        },
        function(error) {
          alert(error.message);
        },"GET",false);
  },
  save_pieline:function()
  {

	var name = document.getElementById("txt_name");
	 var pipeline_id= document.getElementById("inpu_syspk");
		 
		 if(name.value=="")
		 {
			alert("El campo nombre es requerido.");
			return;
		 }
	var data={
		name:name.value,
		probability:document.querySelector("#pipeline_probability").checked
	}
	var method="POST";
	if(pipeline_id.value!="")method="PATCH";
	
	var uri=`${url}crm/sales/pipeline/${pipeline_id.value}`;
	        model.invoke_service(uri,data,function(data) {
	          controller.close_modal();
            if(method=="POST")
	           views.appendOption("#pipelines",data);
           views.hide_Allmodule();
	          views.edit_view(data[0]);
	        },
	        function(error) {
	          alert(error.message);
	        },method,false);
	},
  view_modal:function(id="user_modal",edit=false)
  {
    if(edit)
    {
      if(idpipeline.value=="")
      {
        alert("Seleccione un pipeline.");
        return;
      }
    }
    controller.show_modal(id);
  },
  show_modal:function(idmodal)
  {
    views.show_modal(idmodal);
  },
	
  close_modal:function(){
    views.close_modal("user_modal")
  },
   guid:function()
   {
        //guid con - //[1e7]+-1e3+-4e3+-8e3+-1e11
        //guid sin - //[1e7]+1e3+4e3+8e3+1e11
        return ([1e7]+1e3+4e3+8e3+1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    },
    clear:function(){
      views.clear_modal()
     
    },
    delete:function()
    {
      if(idpipeline.value=="")
      {
        alert("Seleccione un pipeline.");
        return;
      }

      if (!confirm('Este proceso eliminará todos sus dependencias ¿Continuar?'))
      return;

      var uri=`${url}crm/sales/pipeline/${idpipeline.value}`;
      model.invoke_service(uri,null,function(data) {
      	views.select("#pipelines",data);
      	if(data!=null)
      	{
      		views.print_stages(data[0]);
        	views.edit_view(data[0]);
          if(data[0]==null)
          {
            views.hide_Allmodule(true);
          }
      	}
        
      },
      function(error) {
        alert(error.message);
      },"DELETE",false);
      
    },
    reload:function()
    {
    	window.location.reload();
    },
    redirect:function(params="")
    {
    	window.location.href="./"+params;
    },
    getParams:function()
    {
      var params=`?token=${token}&ws=${ws}&namews=${namews}`;
      return params;
    },
    save_pieline_stages:function()
    {
    	if(idpipeline.value=="")
    	{
    		alert("Seleccione un pipeline.");
    		return;
    	}

    	var data_pipeline=
    	{
    		probability:document.querySelector("#pipeline_probability").checked
    	}
    	var pipeline_list_stages=[];
    	if(list_stages)
    	{
    		for (var i =0; i < list_stages.childNodes.length; i++) {
    			var stage=list_stages.childNodes[i];
    		
    			if(stage.id!="" && stage.id!="new")
    			{
    				var stg=stage.getAttribute("stage");
    				var elements=document.querySelectorAll(`#${stage.id} input`);
    				var input=elements[0];
    				var inp_prob=elements[1];
    				var check=elements[2];
    				var data=
    				{
    					sequence:i,
    					name:input.value,
    					probability:inp_prob.value,
    					stuck_in_days:check.checked
    				}
    				if(Number(stg)==0)
    					pipeline_list_stages.push(data);
    				
    			}
    		}
    		
    	}
    	else
    		alert("Falta agregar stages.");

    	data_pipeline["stages"]=pipeline_list_stages;

    	if(pipeline_list_stages.length==0)
    	{
    		alert("No hay nuevos stages.");
    		return;
    	}

    	var uri=`${url}crm/sales/pipeline/${idpipeline.value}/stages/`;
    	var data=data_pipeline;
    	
        model.invoke_service(uri,data,function(data) {
          // views.select("#pipelines",data);
        },
        function(error) {
          alert(error.message);
        },"POST",false);
    	
    },
    edit_stage:function(id,btn=null,event,cancel=false)
    {
    	// if(event)
    	// 	event.stopPropagation();

    	if(!cancel && controller.verify_modify()){
    		return;
    	}

    	 views.edit_stage(id,btn,cancel);
    	views.view_new(cancel);

    	if(!cancel)
    		controller.in_modify(true);
    },
    save_stage:function(id,sys_pk)
    {
    	if(id=="")
    		return;

    	if(idpipeline.value=="")
    	{
    		alert("Seleccione un pipeline.");
    		return;
    	}
    	var stage=document.querySelector(`#${id}`);

    	var pipeline_list_stages=[];

    	var stg=stage.getAttribute("stage");
		var elements=document.querySelectorAll(`#${stage.id} input`);
		var input=elements[0];
		var inp_prob=elements[1];
		var check=elements[2];
		var data=
		{
			sequence:views.getpositionStageByid(stage.id),
			name:input.value,
			probability:inp_prob.value,
			stuck_in_days:check.checked
		}
			
    	var data_pipeline=
    	{
    		probability:document.querySelector("#pipeline_probability").checked,
    		stages:data
    	}
    	
    	var method="POST";
    	var idstg="";
		if(Number(sys_pk)!=0)
		{
			method="PATCH";
			idstg=sys_pk;
		}
		
		var uri=`${url}crm/sales/pipeline/${idpipeline.value}/stages/${idstg}`;
		var data=data_pipeline;
        
        model.invoke_service(uri,data,function(data) {
          controller.save_secuences(true);
          
          views.edit_view(data[0]);
          views.edit_stage(id,null,true);
          views.view_new(true);
          controller.in_modify(false);
        },
        function(error) {
          alert(error.message);
        },method,false);
    },
    delete_stage_bd:function(id,sys_pk)
    {
    	if(idpipeline.value=="")
    	{
    		alert("Seleccione un pipeline.");
    		return;
    	}

    	var uri=`${url}crm/sales/pipeline/${idpipeline.value}/stages/${sys_pk}`;
    	model.invoke_service(uri,null,function(data) {
         	controller.delete_stage(id,0,false);
        },
        function(error) {
          alert(error.message);
        },"DELETE",false);
    },
    delete_stage(id,sys_pk,conf=true)
    {
    	if (conf && !confirm("¿Estas seguro de eliminar?"))
    		return;

    	if(Number(sys_pk)<=0){
    		views.delete_stage(id);
    		controller.in_modify(false);
    	}
    	else
    	{
    		controller.delete_stage_bd(id,sys_pk);
    	}
    },
    parent_select:function(uuid,e)
    {
    	if(e){
    		e.stopPropagation();
    	}
    	if(controller.verify_modify()){
    		return;
    	}
    	views.parent_select(uuid);
    },
    in_modify:function(value=false){is_modify=value;},
    save_secuences:function(struc=false)
    {
      if(!struc)
      {
         if (!is_sequence_dirty) return;
          if (timeout_save_sequence>0)
          {
              timeout_save_sequence--;
              return;
          }
      }
     
      if(idpipeline.value=="")
      {
        alert("Seleccione un pipeline.");
        return;
      }
      var data={
        dataSecuences:views.save_secuences(),
        secuences:true
      }
      var uri=`${url}crm/sales/pipeline/${idpipeline.value}/stages/`;
      model.invoke_service(uri,data,function(data) {
          
        },
        function(error) {
          alert(error.message);
        },"PATCH",false);

      timeout_save_sequence=max_tmss;
      is_sequence_dirty=false;
    },
    verify_modify:function(){
    	// if(is_modify)
    	// 	alert("Inicio un proceso pero no fue finalizada, debe terminar el proceso.");
    	// return is_modify;
    }
}