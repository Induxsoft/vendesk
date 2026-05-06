var stage_notif = {
    
    form_id: "",
    urlexit: "..",
    
    init()
    {
        const form = document.getElementById(this.form_id);
        const pipeline = document.getElementById('pipeline');
        const channel = document.getElementById('snd_channel');

        form.addEventListener('submit', e => {
            e.preventDefault();
            this._submit(e.target);
        });

        pipeline.addEventListener('change', e => this.reload());
        channel.addEventListener('change', e => this.reload());

        this.initTableVars();
        this.initSuggestMarks();
    },

    initTableVars()
    {
        const table = document.getElementById('table-vars');
        if (!table) return;

        const input = document.querySelector('input[name="tempvars"]');
        table.DataArray = JSON.parse(input.value || "[]");
        table._printRows();

        document.getElementById('btn-add-var')
        .addEventListener('click', () => table.AddRow());
        
        document.getElementById('btn-del-var')
        .addEventListener('click', () => table.DeleteCurrentRow());

        table.Events['rowdeleted'] = function(e) {
            input.value = JSON.stringify(e.sender.DataArray);
        }
        table.Events['fieldupdated'] = function(e) {
            input.value = JSON.stringify(e.sender.DataArray);
        }
    },

    initSuggestMarks()
    {
        macros.vars = {
            lead_name: {
                label: "Nombre del prospecto"
            },
            lead_email: {
                label: "Correo del prospecto"
            },
            lead_phone: {
                label: "Teléfono del prospecto"
            },
            lead_subject: {
                label: "Asunto/Interes del prospecto"
            },
            lead_organization: {
                label: "Empresa del prospecto"
            },
            lead_position: {
                label: "Posición/Puesto del prospecto en su empresa",
            },
            exec_name: {
                label: "Nombre del ejecutivo asignado al prospecto"
            },
            pipeline_name: {
                label: "Nombre/Descripción del pipeline actual del prospecto",
            },
            stage_name: {
                label: "Nombre/Descripción del stage actual del prospecto"
            }
        };
        macros.suggest("#form-params");
    },

    formObj(formOrId) {
        const form = (typeof formOrId === "string") ? document.getElementById(formOrId) : formOrId;
        return Object.fromEntries(new FormData(form).entries());
    },

    reload()
    {
        let url = window.location.href.split('?')[0];
        let qry = (new URLSearchParams(this.formObj(this.form_id))).toString();

        window.location.href = url + '?' + qry;
    },

    _submit(form)
    {
        const formParams = document.getElementById('form-params');
        if (!formParams.reportValidity()) return;
        
        const unit_time = document.getElementById('unit_time')?.value || 'minutes';
        const intervals = {
            minutes: 1,
            hours: 60,
            days: 1440
        };
        let payload = this.formObj(form);
        let method = (Number(payload.sys_pk) > 0) ? 'PATCH' : 'POST';
        
        payload.waiting_minutes = Math.floor(payload.waiting_minutes * intervals[unit_time]);
        payload.params = this.formObj(formParams);

        InduxsoftCrudlModel.InvokeService('.', payload,
            (data) => {
                window.location.href = this.urlexit;
            },
            (error) => { alert(error.message) },
            method, false
        );
    }
};