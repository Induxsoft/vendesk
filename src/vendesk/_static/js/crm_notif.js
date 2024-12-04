document.addEventListener("DOMContentLoaded",()=>{crm_notif.init();});


var crm_notif=
{
    source:"",
    init()
    {
        this.destino=document.getElementById("destino");
        this.id_destino=document.getElementById("id_destino");
        this.lbl_id_destino=document.getElementById("lbl_id_destino");
        this.mod_id_destino=document.getElementById("mod_id_destino");

        if(this.destino)this.destino.addEventListener("change",()=>{crm_notif.ChangeDestino();});

        this.trigger(this.destino,"change");
    },
    ChangeDestino()
    {   
        if(!this.destino || !this.mod_id_destino)return;

        this.mod_id_destino.classList.remove("d-none");
        let src=this.id_destino.getAttribute("data-source") ??"";
        
        if(src.trim()!="")
        {
            this.id_destino.setValue({});
        }
        switch (this.destino.value.trim()) 
        {
            case "user":
                this.id_destino.setAttribute("required",true);
                this.id_destino.setAttribute("data-source",this.source.replace("@_view","users"));
                this.lbl_id_destino.textContent="Usuario:";
                break;
            case "group":
                this.id_destino.setAttribute("required",true);
                this.id_destino.setAttribute("data-source",this.source.replace("@_view","groups"));
                this.lbl_id_destino.textContent="Grupo:";
                break;
            default:
                this.id_destino.removeAttribute("required");
                this.mod_id_destino.classList.add("d-none");
                break;
        }
    },
    trigger:function(element,event)
	{
		var e=new Event(event);
       if(element)element.dispatchEvent(e);
	},
}