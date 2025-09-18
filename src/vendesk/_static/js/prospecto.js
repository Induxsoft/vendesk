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

        let url = "/!/pim/events/_new/"
        url += "?calendar=" + selectCalendar.value
        url += "&description=" + fields['txtasunto'].value
        url += "&detsrc=DET0AF"
        url += "&srcid=" + model.sys_pk

        window.location.href = url
    }
}
