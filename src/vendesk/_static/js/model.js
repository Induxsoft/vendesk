var model =
{
  sOrder: null,
  data_leads: null, filter_search: [], pipelines_stages: null, isrecord: false, isquit: false, next_contac: null, model_cbStatus: null, cmpipelines: null, isprospecto: false, cbStages: null, data_status: null, text_color_n: "Naranja",
  invoke_service: function (url, params, callback_success, callback_fail, http_method, reload = true, async = true, autorizations = "") {
    if (!http_method) http_method = "POST";

    request = {
      type: http_method,
      url: url,
      contentType: "application/json;charset=utf-8;",
      async: async,
      crossDomain: true,
      success: function (r, textStatus, xhr) {
        if (http_method == "DELETE" && (r == null || r == "undefined")) {
          callback_success(r)
          return;
        }
        var res = JSON.parse(JSON.stringify(r));
        if (res.success) {
          if (callback_success)
            callback_success(res.data);
        }
        else if (!res.success) {
          if (callback_fail)
            callback_fail(res);
        }
        else {
          if (xhr.status >= 200 && xhr.status < 300) {
            if (callback_success) callback_success(r)
          }
          else {
            if (callback_fail)
              callback_fail(res);
          }


        }
      },
      error: function (r) {
        model.alert("Ocurrió un error al invocar el servicio.\n\r" + JSON.stringify(r));
      }
    };

    if (autorizations) {
      request.headers = { 'Authorization': autorizations };
    }
    if (params) {
      request.dataType = "json";
      request.data = JSON.stringify(params);
    }

    $.ajax(request).always(function () {
      if (reload)
        location.reload();
    });
  },
  Init_prospecto: function () {

    model.model_cbStatus = document.querySelector("#cbStatus");
    model.cmpipelines = document.querySelector("#cbPipeline");
    model.cbStages = document.querySelector("#cbStages");



    if (model.cmpipelines) model.cmpipelines.addEventListener("change", function () {
      model.load_stages(this.value);
    });


    model.enabled_control_prospecto(true);

    if (model.model_cbStatus) model.model_cbStatus.addEventListener("change", function () {
      var t = this.value;
      if (t == 3) {

        model.enabled_control_prospecto(false);
        if (model.cmpipelines) model.cmpipelines.value = 0;
      }
      else {
        model.enabled_control_prospecto(true);
      }
    });

  },
  trigger: function (element, event) {
    var e = new Event(event);
    if (element) element.dispatchEvent(e);
  },
  load_boxes: function () {
    model.name = document.querySelector("#txtname");
    model.txtphone = document.querySelector("#txtphone");
    model.txtemail = document.querySelector("#txtemail");
    model.txtempresa = document.querySelector("#txtempresa");
    model.txtpuesto = document.querySelector("#txtpuesto");
    model.txtasunto = document.querySelector("#txtasunto");
    model.txtcomentarios = document.querySelector("#txtcomentarios");
    model.cbPropietario = document.querySelector("#cbPropietario");
    model.cbStatus = document.querySelector("#cbStatus");
    model.cbPipeline = document.querySelector("#cbPipeline");
    model.cbStages = document.querySelector("#cbStages");
    model.txtProbabilidad = document.querySelector("#txtProbabilidad");
    model.txtImporteTrato = document.querySelector("#txtImporteTrato");
    model.cbColor = document.querySelector("#cbColors");
  },
  enabled_control_prospecto: function (enabled) {
    var txtProbabilidad = document.querySelector("#txtProbabilidad");
    var txtImporteTrato = document.querySelector("#txtImporteTrato");
    if (enabled) {
      if (txtImporteTrato) txtImporteTrato.setAttribute("disabled", enabled);

      if (model.cbStages) model.cbStages.setAttribute("disabled", enabled);
      if (model.cmpipelines) model.cmpipelines.setAttribute("disabled", enabled);

      if (model.cmpipelines) model.cmpipelines.setAttribute("disabled", enabled);
      if (model.cbStages) model.cbStages.setAttribute("disabled", enabled);
      if (txtProbabilidad) txtProbabilidad.setAttribute("disabled", enabled);
    }
    else {
      if (txtImporteTrato) txtImporteTrato.removeAttribute("disabled");

      if (model.cbStages) model.cbStages.removeAttribute("disabled");
      if (model.cmpipelines) model.cmpipelines.removeAttribute("disabled");

      if (model.cmpipelines) model.cmpipelines.removeAttribute("disabled");
      if (model.cbStages) model.cbStages.removeAttribute("disabled");
      if (txtProbabilidad) txtProbabilidad.removeAttribute("disabled");
    }

  },

  getParameters: function () {
    var data = {
      ids: model.ids,
      source: model.source,
      storeid: model.sourceId
    }
    return data;
  },
  getDataFilters: function () {
    var cbAgentes = document.querySelector("#cbAgentes");
    var color = document.querySelector("#cbColors");
    var status = document.querySelector("#cbStatus");

    var params = {
      agent_filter: cbAgentes.value == "" ? "unassigned" : cbAgentes.value,
      color_filter: color.value,
      status_filter: status.value == "" ? "999" : status.value,
    }
    return params;
  },
  Init: function () {
    var data =
    {
      ids: model.ids,
      source: model.source,
      storeid: model.sourceId
    }

    model.load_agents();

    model.load_status(data);

    model.load_pipelines();

    model.load_colors();

    model.filters_leads(model.getDataFilters());

    model.sOrder = document.querySelector("#sOrderBy");
    if (model.sOrder) model.sOrder.addEventListener("change", function () {
      model.orderBy(this.value);
    });
  },
  load_agents: function (data = null, idsag = "#cbAgentes") {
    if (data == null) data = model.getParameters();

    model.invoke_service(model.url_vendesk + "leads/list-agents.dkl", data, function (data) {
      model.load_cb(data, "id", "name", idsag);
    },
      function (error) {
        model.alert(error.message);
      }, "POST", false);
  },
  load_status: function (data = null, async = true) {
    if (data == null) data = model.getParameters();

    model.invoke_service(model.url_vendesk + "leads/list-lead-status.dkl", data, function (data) {
      model.data_status = data;
      model.load_cb(data, "key", "caption", "#cbStatus");
      model.trigger(model.cbStatus, "change");
    },
      function (error) {
        model.alert(error.message);
      }, "POST", false, async);
  },
  _load_status_: function () {
    if (model.data_status != null) {
      model.load_cb(model.data_status, "key", "caption", "#cbStatus");
      model.trigger(model.cbStatus, "change");
    }
  },
  load_pipelines: function () {
    var data = model.getParameters();
    model.invoke_service(model.url_vendesk + "leads/list-pipelines.dkl", data, function (data) {
      model.pipelines_stages = data;
      model.load_pipelines_();
    },
      function (error) {
        model.alert(error.message);
      }, "POST", false);
  },
  alert: function (caption = "") {
    alert(caption);
  },
  confirm: function (caption, callback) {
    return confirm(caption);
  },
  getTextPipelineStage: function (itm) {
    var ps = "";
    if (itm.leadstatus == 3) {
      var text_pilines = "";
      var text_stages = "";
      if (model.pipelines_stages != null) {
        for (var t = 0; t < model.pipelines_stages.length; t++) {
          var tm = model.pipelines_stages[t];
          if (itm.pipeline == tm.sys_pk) {

            text_pilines = tm.name;
            if (tm.stages != null) {
              for (var s = 0; s < tm.stages.length; s++) {
                var sg = tm.stages[s];
                if (itm.stage == sg.sys_pk) {
                  text_stages = sg.name;
                  break;
                }
              }
            }
            break;
          }
        }
      }
      ps = `<b></b><smal>${text_pilines + (text_stages != "" ? " -> " + text_stages : "")}</smal><br>`;
    }
    return ps;
  },
  getColor: function (color) {
    var clr = "";
    switch (color) {
      case 0: clr = "background:#FFFFFF !important"; break;
      case 1: clr = "background:#fd7e14 !important"; break;
      case 2: clr = "background:#28a745 !important"; break;
      case 3: clr = "background:#007bff !important;color:white !important;"; break;
      case 4: clr = "background:#6f42c1 !important;color:white !important;"; break;
      case 5: clr = "background:#ffc107 !important"; break;
    }
    return clr;
  },
  alertNextContact: function (next_contact) {
    if (next_contact == null && next_contact == "") return false;

    var dt = new Date();

    dt.setMinutes(dt.getMinutes() + 15);

    var nxtc = new Date(next_contact);

    if (nxtc.getTime() <= dt.getTime()) {
      return true;
    }
    return false;
  },
  load_table: function (data, idtable) {
    var table = document.querySelector(idtable);
    var body = "";


    model.filter_search = ["sys_dtcreated", "next_contact", "subject", "name", "phone", "email", "organization", "position", "remarks", "leadstatus_text", "agent_name"];
    for (var i = 0; i < data.length; i++) {
      var itm = data[i];
      var ps = "";
      if (itm.leadstatus == 3) {
        ps = model.getTextPipelineStage(itm);
      }
      var email = itm.email == null ? "" : itm.email;
      var org = itm.organization == null ? "" : itm.organization;
      var pos = itm.position == null ? "" : itm.position;

      var style = "";
      if (model.alertNextContact(itm.next_contact)) style = "background:red;";

      body += `<div class="card bg-white shadow shadow-sm">
              <div class="d-flex" id="dv-color_${itm.sys_pk}" style="padding-left: 1rem !important;padding-right: 1rem !important;${model.getColor(itm.color)}">
                <div class="flex-grow-1">
                  <h6>${itm.subject == null || itm.subject == "" ? "(Sin asunto)" : itm.subject}</h6>
                </div>
               <div><smal>${itm.leadstatus_text}</smal></div>
              </div>
                <hr style="margin: 0;"></hr>
                    <div class="card-body pointer" style="overflow:auto;display: flex;flex-direction: column;" onclick="model.redirec('./?cfg=1&lead=${itm.sys_pk}')">
                      <div class="justify-items-center pointer flex-grow-1" >
                        <b><smal>${itm.name}</smal> </b><br>
                        <smal>${itm.phone}</smal>${itm.phone == "" ? "" : "<br>"}
                        <smal>${email}</smal>${email == "" ? "" : "<br>"}
                        <smal>${org}</smal>${org == "" ? "" : "<br>"}
                        <smal>${pos}</smal>${pos == "" ? "" : "<br>"}
                        <smal>${itm.agent_name}</smal><br>
                        ${ps}
                      </div>

                      <div class="">
                         <div>
                            ${itm.next_contact == null || itm.next_contact == "" ? "" : `<svg xmlns="http://www.w3.org/2000/svg" class="" style="margin-right: 4px;" title="Próximo evento" width="25" height="25" fill="currentColor" viewBox="0 0 16 16">
                             <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"></path>
                             <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"></path>
                             <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"></path>
                           </svg><smal style="${style}">` + itm.next_contact}</smal>
                          </div>
                          <div class="d-flex justify-content-end">
                              <b><smal>${itm.agent_name}</smal></b><br>
                          </div>
                          <div class="d-flex justify-content-end">
                              <b></b><smal style="font-size: small;">${itm.sys_dtcreated}</smal>
                          </div>
                          <div class="card-footer header-items-center" style="padding: 0; cursor: default;">
                            <div class="btn-group d-inline-block flex-wrap mt-1 flex-grow-1" id="group-colors">
                              <button type="button" onclick="model.setColor(${itm.sys_pk},0,event);" style="background-color:#FFFFFF;" title="Sin color" class="color border"></button>
                              <button type="button" onclick="model.setColor(${itm.sys_pk},1,event);" style="background-color:#fd7e14;" title="${model.text_color_n}" class="color border"></button>
                              <button type="button" onclick="model.setColor(${itm.sys_pk},2,event);" style="background-color:#28a745;" title="Verde" class="color border"></button>
                              <button type="button" onclick="model.setColor(${itm.sys_pk},3,event);" style="background-color:#007bff;" title="Azul" class="color border border"></button>
                              <button type="button" onclick="model.setColor(${itm.sys_pk},4,event);" style="background-color:#6f42c1;" title="Morado" class="color border"></button>
                              <button type="button" onclick="model.setColor(${itm.sys_pk},5,event);" style="background-color:#ffc107;" title="Amarillo" class="color border"></button>
                            </div>
                            <a class="" href="./?prc=1&lead=${itm.sys_pk}" style="margin-right:5px;margin-left:5px">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"></path>
                                </svg>
                            </a>
                            <a class="" href="#" style="margin-right:5px;margin-left:5px;color:red" onclick="model.deleteLead(${itm.sys_pk})">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
                              </svg>
                            </a>
                          </div>
                        </div>

                      </div>
                     
                </div>`;
    }
    if (table) table.innerHTML = body;
  },
  deleteLead: function (sys_pk) {
    var r = model.confirm("¿Esta seguro de eliminar este prospecto?");
    if (!r) return;

    var lead = { sys_pk: sys_pk }
    var leads = [];
    leads.push(lead);
    var data = model.getParameters();
    data["action"] = "delete";
    data["leads"] = leads;

    model.invoke_service(model.url_vendesk + "leads/update-many.dkl", data, function (data) {
      model.filter_table();
    },
      function (error) {
        model.alert(error.message);
      }, "POST", false);
  },
  redirec: function (url) {
    window.location.href = url;
  },
  load_cb: function (data, key, value, idselect, attributes = "") {
    var select = document.querySelector(idselect);
    var options = "";
    if (idselect == "#cbAgentes") {
      options = `<option value="unassigned">(Sin asignar)</option><option value="all">(Todos los agentes)</option>`;
    }
    var slected = "";

    for (var i = 0; i < data.length; i++) {
      var itm = data[i];
      if (model.isprospecto && idselect == "#cbStatus" && eval("itm." + key) == 999) continue;
      if (idselect == "#cbPropietario") {
        if (itm.id == model.uid) { slected = "selected='true'" }
      }
      options += `<option ${attributes} value="${eval("itm." + key)}" ${slected}>${eval("itm." + value)}</option>`;
    }
    if (select) select.innerHTML = options;
  },
  load_colors: function (all = true) {
    var al = "";
    if (all) al = `<option value="-1">(Todos)</option>`;
    var cols = `${al}
      	<option value="0">Blanco</option>
      	<option value="1">${model.text_color_n}</option>
      	<option value="2">Verde</option>
      	<option value="3">Azul</option>
      	<option value="4">Morado</option>
      	<option value="5">Amarillo</option>`;

    var s = document.querySelector("#cbColors");
    if (s) s.innerHTML = cols;
  },
  filter_table: function () {
    model.filters_leads(model.getDataFilters());
  },
  loadSpinner: function (element) {
    if (element) {
      element.style.cssText = `min-height: 40%;position: relative;`;
      element.innerHTML = `<div class="d-flex placeholder-glow w-100" style=" position: absolute;width: 100% !important;height: 100% !important;">
                              <div class="placeholder" style="width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;background-color: lightgray;">
                              <div class="spinner-border text-primary" role="status">
                      <span class="sr-only">Loading...</span>
                    </div></div>`;
    }
  },
  filters_leads: function (params = null) {
    var data = model.getParameters();
    var tbl = document.querySelector("#prospectos");
    model.loadSpinner(tbl);
    if (params != null) {
      for (var key in params) {
        data[key] = params[key];
      }
    }
    model.invoke_service(model.url_vendesk + "leads/list-leads.dkl", data, function (data) {
      model.data_leads = data;
      model.load_table(data, "#prospectos");
    },
      function (error) {
        model.alert(error.message);
      }, "POST", false);
  },
  filter_table_text: function () {
    if (model.data_leads == null) return;

    var text = document.querySelector("#txtFilter");

    var result = null;

    if (text.value.trim() == "") result = model.data_leads;
    else { result = model.data_leads.filter(lead => model.filter_search.some(filter => new String(lead[filter]).toLowerCase().includes(text.value.toLowerCase()))); }

    model.load_table(result, "#prospectos");
  },
  save_workspace: function (operation = "update") {
    var idtienda = document.querySelector("#idtienda");
    var nametienda = document.querySelector("#nametienda");

    if (idtienda.value == "") {
      model.alert("El id de la tienda es requerido.");
      idtienda.focus();
      return;
    }
    // if(nametienda.value=="")
    // {
    //   model.alert("El id de la tienda es requerido.");
    //   return;
    // }
    var tienda = {
      plazamundial_id: idtienda.value,
      plazamundial_name: nametienda.value
    }
    var crm = { crm: tienda }
    var data = {
      ids: model.ids,
      operation: operation,
      id: model.ws,
      data: crm
    }
    model.invoke_service(model.url_workspace, data, function (data) {
      window.location.reload();
    },
      function (error) {
        model.alert(error.message);
      }, "POST", false);
  },
  get_prospecto: function (sys_pk, prospecto = false) {
    var data = model.getParameters();
    data["sys_pk"] = sys_pk;
    data["ids"] = model.ids;
    data["agent_filter"] = "all";
    data["color_filter"] = "-1";
    data["status_filter"] = "-1";

    model.invoke_service(model.url_vendesk + "leads/list-leads.dkl", data, function (data) {
      if (data == null) return;

      var logs = "";
      var elogs = document.querySelector("#logs");
      var lead = document.querySelector("#data_lead");

      model.data_leads = data;

      if (prospecto) {
        model.load_pipelines_();
        model.load_data_lead();
        return;
      }

      for (var i = 0; i < data.length; i++) {
        var itm = data[i];
        if (itm.sys_pk === Number(sys_pk)) {
          var email = itm.email == null ? "" : itm.email;
          var org = itm.organization == null ? "" : itm.organization;
          var pos = itm.position == null ? "" : itm.position;

          var dvcolor = document.querySelector("#dv-color");
          if (dvcolor) dvcolor.style.cssText = dvcolor.style.cssText + model.getColor(itm.color);

          var style = "";
          if (model.alertNextContact(itm.next_contact)) style = "background:red;";

          model.next_contac = itm.next_contact;
          if (lead) lead.innerHTML = `
                  <div class="d-flex" id="nextc_${itm.sys_pk}">
                    ${itm.next_contact == null || itm.next_contact == "" ? "" : `<svg xmlns="http://www.w3.org/2000/svg" class="" style="margin-right: 4px;" title="Próximo evento" width="25" height="25" fill="currentColor" viewBox="0 0 16 16">
                     <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"></path>
                     <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"></path>
                     <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"></path>
                   </svg><smal style="${style}">` + itm.next_contact}</smal>
                  </div>
                  <div><smal>${itm.leadstatus_text}</smal></div>
                        <b><smal>${itm.name}</smal> </b><br>
                        <smal>${itm.phone}</smal>${itm.phone == "" ? "" : "<br>"}
                        <smal>${email}</smal>${email == "" ? "" : "<br>"}
                        <smal>${org}</smal>${org == "" ? "" : "<br>"}
                        <smal>${pos}</smal>${pos == "" ? "" : "<br>"}
                        <smal>${itm.remarks}</smal>${itm.remarks == "" ? "" : "<br>"}
                        ${model.getTextPipelineStage(itm)}

                    <div class="d-flex justify-content-end">
                        <b><smal>${itm.agent_name}</smal></b><br>
                    </div>
                    <div class="d-flex justify-content-end">
                        <b></b><smal style="font-size: small;">${itm.sys_dtcreated}</smal>
                    </div>`;
          if (itm.log != null) {

            for (var l = 0; l < itm.log.length; l++) {
              var lg = itm.log[l];
              logs += model.add_logs(lg);
            }
            if (elogs) elogs.innerHTML = logs;
          }
          break;
        }
      }
    },
      function (error) {
        model.alert(error.message);
      }, "POST", false);
  },
  add_logs: function (lg) {
    return `<div class="d-flex justify-content-end text-end">
                        <button type="button" style="font-size: 0.8rem;color: black;pointer-events: none;" id="btn-log" class="btn btn-outline-primary mb-1">
                          <h6>${lg.note}</h6>
                          <label style="display: flex;width: 100%;justify-content: end;">${lg.uname}</label>
                          <small style="display: flex;width: 100%;justify-content: end;">${lg.sys_dtcreated}</small>
                        </button>
                      </div>`;
  },
  showModal: function (idmodal, module = "notas") {
    var title = document.querySelector("#textomdl");
    var rcord = document.querySelector("#recordatorio");
    var mdl = document.querySelector("#mdl-registro");
    var etnotas = document.querySelector("#et-notas");
    var nts = document.querySelector("#txtNotas");
    var ntcont = document.querySelector("#newt_contact_hours");
    var btn = document.querySelector("#btnAceptardml");
    if (btn && btn.innerHTML != "Aceptar") btn.innerHTML = 'Aceptar';

    if (nts) nts.value = "";

    title.innerHTML = "Registro";
    etnotas.innerHTML = "Notas:";


    switch (module) {
      case "notas":
        model.isquit = false;
        model.isrecord = false;
        rcord.classList.add("hide");
        mdl.classList.remove("grid-modal");
        break;
      case "record":
        model.isquit = false;
        model.isrecord = true;
        if (ntcont) ntcont.selectedIndex = 36;//="09:00";
        rcord.classList.remove("hide");
        mdl.classList.add("grid-modal");
        break;
      case "quit_record":
        if (model.next_contac == null || model.next_contac == "") {
          model.alert("No hay recordatorio de próximo contacto establecido para este prospecto.");
          return;
        }
        if (btn) btn.innerHTML = "Quitar recordatorio";
        model.isquit = true;
        model.isrecord = false;
        title.innerHTML = "Recordatorio";
        etnotas.innerHTML = "Motivo:";
        rcord.classList.add("hide");
        mdl.classList.remove("grid-modal");
        break;

    }
    //quitar esto si quiere que se afecte la modal columna de 2
    mdl.classList.remove("grid-modal");

    $(idmodal).modal("show");
  },
  hideModal: function (idmodal) {
    $(idmodal).modal("hide");
  },
  addHours: function (minuteInterval = 15, start = 0, end = 23) {
    var hours = document.querySelector("#newt_contact_hours");
    var options = "";
    for (var i = start; i <= end; i++) {
      for (var j = 0; j < 60; j += minuteInterval) {
        var v = ((i * 100) + j);
        var h = parseInt(Math.trunc(v / 100));
        var m = parseInt((((Number(v) / 100) - Math.trunc(Number(v) / 100)) * 100));

        if (model.pad(h, m) != "")
          options += `<option value="${model.pad(h, m)}">${model.pad(h, m)}</option>`;
      }
    }
    if (hours) {
      hours.innerHTML = options;
    }
  },
  pad: function (h, m) {
    m = m.toString();
    h = h.toString();

    var num = "";
    if (h.length == 1) {
      if (m.length == 1) num = "0" + h + ":0" + m;
      else num = "0" + h + ":" + m;
    }
    else {
      if (m.length == 1) num = h + ":0" + m;
      else num = h + ":" + m;
    }
    return num;
  },
  cut: function (cad, size) {
    if (size > cad.length) return cad;

    cad = cad.substr(cad.length, size)
  },
  save_registro: function () {
    var nota = document.querySelector("#txtNotas");
    var next_contact = document.querySelector("#next_contact");
    var next_contact_hours = document.querySelector("#newt_contact_hours");
    var mdlrec = document.querySelector("#nextc_" + model.lead_sys_pk);

    var data = model.getParameters();

    var ntcont = "";
    if (nota.value == "" && !model.isquit) {
      model.alert("Debe escribir una nota");
      return;
    }
    if (model.isquit) {
      if (nota.value == "") {
        model.alert("Debe indicar un motivo");
        return;
      }
      ntcont = "Se quitó recordatorio"
      data["next_contact"] = null;
      model.next_contac = null;
    }

    var ntrec = "";
    var style = "";
    if (model.isrecord) {
      if (next_contact_hours.value == "") {
        model.alert("Seleccione una hora");
        return;
      }
      var nextc = next_contact.value + "T" + next_contact_hours.value + ":00";
      var dt = new Date();
      var ndt = new Date(nextc);

      if (ndt.getTime() < dt.getTime()) {
        model.alert("No puedes programar un evento en el pasado");
        return;
      }
      ntcont = "Próximo contacto: " + nextc;
      data["next_contact"] = nextc;
      model.next_contac = nextc;

      if (model.alertNextContact(model.next_contac)) style = "background:red;"
    }


    data["text"] = nota.value + " " + ntcont;
    if (model.isquit) {
      data["text"] = ntcont + " " + nota.value;
    }
    data["lead_sys_pk"] = model.lead_sys_pk;
    model.invoke_service(model.url_vendesk + "leads/add-entry.dkl", data, function (data) {
      if (model.isquit) {
        if (mdlrec) mdlrec.remove();
      }

      if (model.isrecord) {
        if (mdlrec) {
          mdlrec.innerHTML = ` ${model.next_contac == null || model.next_contac == "" ? "" : `<svg xmlns="http://www.w3.org/2000/svg" class="" style="margin-right: 4px;" title="Próximo evento" width="25" height="25" fill="currentColor" viewBox="0 0 16 16">
                     <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022l-.074.997zm2.004.45a7.003 7.003 0 0 0-.985-.299l.219-.976c.383.086.76.2 1.126.342l-.36.933zm1.37.71a7.01 7.01 0 0 0-.439-.27l.493-.87a8.025 8.025 0 0 1 .979.654l-.615.789a6.996 6.996 0 0 0-.418-.302zm1.834 1.79a6.99 6.99 0 0 0-.653-.796l.724-.69c.27.285.52.59.747.91l-.818.576zm.744 1.352a7.08 7.08 0 0 0-.214-.468l.893-.45a7.976 7.976 0 0 1 .45 1.088l-.95.313a7.023 7.023 0 0 0-.179-.483zm.53 2.507a6.991 6.991 0 0 0-.1-1.025l.985-.17c.067.386.106.778.116 1.17l-1 .025zm-.131 1.538c.033-.17.06-.339.081-.51l.993.123a7.957 7.957 0 0 1-.23 1.155l-.964-.267c.046-.165.086-.332.12-.501zm-.952 2.379c.184-.29.346-.594.486-.908l.914.405c-.16.36-.345.706-.555 1.038l-.845-.535zm-.964 1.205c.122-.122.239-.248.35-.378l.758.653a8.073 8.073 0 0 1-.401.432l-.707-.707z"></path>
                     <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0v1z"></path>
                     <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5z"></path>
                   </svg><smal style="${style}">` + model.next_contac}</smal>`;
        }
      }

      var elogs = document.querySelector("#logs");
      if (elogs) elogs.innerHTML = model.add_logs(data) + elogs.innerHTML;
      model.hideModal("#modal_notas_recordatorio");

    },
      function (error) {
        model.alert(error.message);
      }, "POST", false);
  },
  save_prospecto: function () {
    var name = document.querySelector("#txtname");
    var txtphone = document.querySelector("#txtphone");
    var txtemail = document.querySelector("#txtemail");
    var txtempresa = document.querySelector("#txtempresa");
    var txtpuesto = document.querySelector("#txtpuesto");
    var txtasunto = document.querySelector("#txtasunto");
    var txtcomentarios = document.querySelector("#txtcomentarios");
    var cbPropietario = document.querySelector("#cbPropietario");
    var cbStatus = document.querySelector("#cbStatus");
    var cbPipeline = document.querySelector("#cbPipeline");
    var cbStages = document.querySelector("#cbStages");
    var txtProbabilidad = document.querySelector("#txtProbabilidad");
    var txtImporteTrato = document.querySelector("#txtImporteTrato");
    var cbColor = document.querySelector("#cbColors");

    if (name.value.trim().length < 5) {
      model.alert("El nombre del prospecto debe ser mayor a 5 caracteres.");
      return;
    }
    if (cbPropietario.value == "") {
      model.alert("Debe indicar el agente propietario");
      return;
    }

    var data = {}
    if (model.data_leads != null) {
      for (var i = 0; i < model.data_leads.length; i++) {
        var itm = model.data_leads[i];
        if (Number(itm.sys_pk) == Number(model.sys_pk)) {
          if (itm.name != name.value) data["name"] = name.value;
          if (itm.phone != txtphone.value) data["phone"] = txtphone.value;
          if (itm.email != txtemail.value) data["email"] = txtemail.value;
          if (itm.organization != txtempresa.value) data["organization"] = txtempresa.value;
          if (itm.position != txtpuesto.value) data["position"] = txtpuesto.value;
          if (itm.subject != txtasunto.value) data["subject"] = txtasunto.value;
          if (itm.remarks != txtcomentarios.value) data["remarks"] = txtcomentarios.value;
          if (itm.agent_id != cbPropietario.value) data["agent_id"] = cbPropietario.value;
          if (itm.leadstatus != cbStatus.value) data["leadstatus"] = cbStatus.value;
          if (itm.color != cbColor.value) data["color"] = cbColor.value;
        }
      }
    }
    else {
      var data =
      {
        name: name.value,
        email: txtemail.value,
        phone: txtphone.value,
        organization: txtempresa.value,
        position: txtpuesto.value,
        subject: txtasunto.value,
        remarks: txtcomentarios.value,
        color: cbColor.value,
        leadstatus: cbStatus.value,
        agent_id: cbPropietario.value,

      }
    }
    data["sys_pk"] = Number(model.sys_pk);

    var dt = model.getParameters();
    for (var key in dt) {
      data[key] = dt[key];
    }
    //si es oportunidad
    if (Number(cbStatus.value) == 3) {

      if (cbPipeline.value.trim() == "") {
        model.alert("Debe indicar un pipeline");
        return;
      }
      if (cbStages.value.trim() == "") {
        model.alert("Debe indicar un pipeline");
        return;
      }
      //si es oportunidad
      data["pipeline"] = cbPipeline.value;
      data["stage"] = cbStages.value;
      data["probability"] = txtProbabilidad.value;
      data["amount"] = txtImporteTrato.value;
    }
    model.invoke_service(model.url_vendesk + "leads/post-lead.dkl", data, function (data) {
      window.location.href = "./?vnts=1";
    },
      function (error) {
        model.alert(error.message);
      }, "POST", false);

  },
  load_stages: function (sys_pk) {
    if (model.pipelines_stages != null) {
      for (var i = 0; i < model.pipelines_stages.length; i++) {
        var itm = model.pipelines_stages[i];
        if (itm.sys_pk == sys_pk) {
          model.load_cb(itm.stages, "sys_pk", "name", "#cbStages");
          break;
        }
      }
    }
  },
  load_pipelines_: function () {
    if (model.pipelines_stages != null) {
      model.load_cb(model.pipelines_stages, "sys_pk", "name", "#cbPipeline");
    }
    if (model.cmpipelines) model.cmpipelines.value = 0;
  },
  load_module_prospecto: function () {
    model.isprospecto = true;
    model.load_colors(false);
    model.Init_prospecto();

    if (model.model_cbStatus != null) {
      for (var i = 0; i < model.model_cbStatus.length; i++) {
        if (model.model_cbStatus.options[i].value == '999')
          model.model_cbStatus.remove(i);
      }
    }

  },
  load_data_lead: function () {
    if (Number(model.sys_pk) <= 0) return;

    if (model.data_leads != null) {
      model.load_boxes();
      if (model.model_cbStatus != null && model.model_cbStatus.childNodes.length <= 0) { model._load_status_(); }
      if (model.cmpipelines != null && model.cmpipelines.childNodes.length <= 0) { model.load_pipelines_(); }

      for (var i = 0; i < model.data_leads.length; i++) {
        var itm = model.data_leads[i];

        if (Number(itm.sys_pk) == Number(model.sys_pk)) {
          if (itm.leadstatus == 3) {
            model.enabled_control_prospecto(false);
          }
          var dvcolor = document.querySelector("#dv-color");
          if (dvcolor) dvcolor.style.cssText = dvcolor.style.cssText + model.getColor(itm.color);

          model.name.value = itm.name;
          model.txtphone.value = itm.phone;
          model.txtemail.value = itm.email;
          model.txtempresa.value = itm.organization;
          model.txtpuesto.value = itm.position;
          model.txtasunto.value = itm.subject;
          model.txtcomentarios.value = itm.remarks;
          model.cbPropietario.value = itm.agent_id;
          model.cbStatus.value = itm.leadstatus;
          model.trigger(model.cbStatus, "change");
          model.cbPipeline.value = itm.pipeline;
          model.trigger(model.cbPipeline, "change");
          model.cbStages.value = itm.stage;
          model.txtProbabilidad.value = itm.probability;
          model.txtImporteTrato.value = itm.amount;
          model.cbColor.value = itm.color;
        }
      }
    }
  },
  setColor: function (sys_pk, color, e) {
    e.stopPropagation();

    var data = model.getParameters();
    var lead = { sys_pk: sys_pk }
    var ld = [];
    ld.push(lead);

    data["action"] = "update";
    data["lead_color"] = color;
    data["leads"] = ld;


    model.invoke_service(model.url_vendesk + "leads/update-many.dkl", data, function (data) {
      var dv = document.querySelector("#dv-color_" + sys_pk);
      if (dv) { dv.style = dv.style.cssText + model.getColor(color); }

    },
      function (error) {
        model.alert(error.message);
      }, "POST", false);

  },
  filterFloat: function (evt, input) {
    // Backspace = 8, Enter = 13, ‘0′ = 48, ‘9′ = 57, ‘.’ = 46, ‘-’ = 43
    var key = window.Event ? evt.which : evt.keyCode;
    var chark = String.fromCharCode(key);
    var tempValue = input.value + chark;
    if (key >= 48 && key <= 57) {
      if (model.filter(tempValue) === false) {
        return false;
      } else {
        return true;
      }
    } else {
      if (key == 8 || key == 13 || key == 0) {
        return true;
      } else if (key == 46) {
        if (model.filter(tempValue) === false) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
  },
  fieldsOrder: function () {
    var fields =
    {
      agent_name: "Agente",
      amount: "Monto",
      color: "Color",
      customer_id: "",
      email: "Correo electrónico",
      last_attempt: "",
      last_contact: "",
      leadstatus: "Status",
      name: "Nombre",
      next_contact: "Prox. contacto",
      organization: "Empresa",
      phone: "Teléfono",
      pipeline: "Pipeline",
      stage: "Stage",
      position: "Puesto",
      probability: "Probabilidad",
      recived: "Recibido",
      remarks: "Mensaje",
      subject: "Asunto",

    }

    if (model.sOrder) {
      var options = "";
      for (var key in fields) {
        if (fields[key] == "") continue;

        options += `<option value="${key}">${fields[key]}</option>`;
      }
      model.sOrder.innerHTML = options;
    }

  },
  orderBy: function (field) {
    if (model.data_leads == null) return;

    var data = model.data_leads.sort((a, b) => {
      if (eval("a." + field) == eval("b." + field)) return 0;
      if (eval("a." + field) < eval("b." + field)) return -1;
      return 1;
    });

    model.load_table(data, "#prospectos");
  },
  filter: function (__val__) {
    var preg = /^([0-9]+\.?[0-9]{0,6})$/;
    if (preg.test(__val__) === true) {
      return true;
    } else {
      return false;
    }

  }
}