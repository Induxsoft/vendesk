var prospecto =
{
    showCalendarsDialog()
    {
        const selectCalendar = document.getElementById('calendar');
        
        if (!Number(selectCalendar.getAttribute('implemented-pim'))) {
            alert("Debe instalar el paquete 'pim' para continuar.");
            return;
        }
        if (!Number(selectCalendar.getAttribute('allowed-calendar'))) {
            alert("Denegado por falta de privilegio requerido: TF10");
            return;
        }
        if (selectCalendar.options.length < 1) {
            alert("Aun no cuenta con un calendario.")
            return;
        }
        if (selectCalendar.options.length == 1) {
            this.scheduleEvent();
            return;
        }

        const dialog = document.getElementById('dlg-choose-calendar');
        dialog.show();
    },

    closeCalendarsDialog()
    {
        const dialog = document.getElementById('dlg-choose-calendar');
        dialog.close();
    },

    scheduleEvent()
    {
        const selectCalendar = document.getElementById('calendar');
        const formProspecto = document.getElementById('form_prospecto');
        const fields = formProspecto.elements;

        let description = fields['txtasunto'].value + "\r\n\r\n";
        description += fields['txtname'].value + "\r\n";
        description += fields['txtphone'].value + "\r\n";
        description += fields['txtemail'].value;
        
        let context = {
            calendar: selectCalendar.value,
            caption: description.trim(),
            detsrc: "DET0AF",
            srcid: model.sys_pk
        };

        let url = "/!/pim/events/_new/?_context=" + tools.url_encode(JSON.stringify(context));
        window.location.href = url;
    }
}
