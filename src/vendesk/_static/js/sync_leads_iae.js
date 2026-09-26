// sync_leads_iae.js
// Sincroniza el "lote" de conversaciones con el endpoint de asignación humana del agente IAE
// y refleja el resultado en pantalla sin recargar la página.

async function Sincronizar() {
    const btn = document.querySelector('button[onclick="Sincronizar()"]');
    const agentIdInput = document.getElementById("agent_id");
    const agentTokenInput = document.getElementById("agent_token");

    const agent_id = agentIdInput ? agentIdInput.value.trim() : "";
    const agent_token = agentTokenInput ? agentTokenInput.value.trim() : "";

    if (!agent_id || !agent_token) {
        mostrarError("Debe indicar el Id de Agente y el Token de autorización.");
        return;
    }

    if (!Array.isArray(lote) || lote.length === 0) {
        mostrarError("No hay elementos en el lote para sincronizar.");
        return;
    }

    if (btn) {
        btn.disabled = true;
        btn.dataset.originalText = btn.textContent;
        btn.textContent = "Sincronizando...";
    }
    ocultarError();

    try {
        const url = `https://agent.induxsoft.net/svc/${encodeURIComponent(agent_id)}/assign-human/`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": agent_token
            },
            body: JSON.stringify(lote)
        });

        let data;
        try {
            data = await response.json();
        } catch (parseErr) {
            throw new Error("La respuesta del servidor no es un JSON válido.");
        }

        if (!response.ok) {
            throw new Error((data && data.message) || `Error HTTP ${response.status}`);
        }

        if (!data || !data.success) {
            mostrarError((data && data.message) || "La sincronización no fue exitosa.");
            // Aun con success:false, si vienen resumen/resultados los pintamos
            if (data && (data.resumen || data.resultados)) {
                actualizarPantalla(data);
            }
            return;
        }

        actualizarPantalla(data);

    } catch (err) {
        mostrarError(err.message || "Ocurrió un error al sincronizar.");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = btn.dataset.originalText || "Sincronizar";
        }
    }
}

function mostrarError(mensaje) {
    let alertBox = document.querySelector("#work_area .alert-danger");
    if (!alertBox) {
        alertBox = document.createElement("div");
        alertBox.className = "alert alert-danger alert-dismissible fade show my-2 pb-1";
        alertBox.setAttribute("role", "alert");
        alertBox.innerHTML = `
            <div class="w-100 overflow-auto pb-2" id="error_text"></div>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        `;
        const workArea = document.getElementById("work_area");
        workArea.insertBefore(alertBox, workArea.firstChild.nextSibling);
    }
    const textDiv = alertBox.querySelector("#error_text") || alertBox.firstElementChild;
    textDiv.textContent = mensaje;
    alertBox.classList.remove("d-none");
}

function ocultarError() {
    const alertBox = document.querySelector("#work_area .alert-danger");
    if (alertBox) alertBox.classList.add("d-none");
}

function actualizarPantalla(data) {
    actualizarResumen(data.resumen);
    actualizarTablaResultados(data.resultados);
}

function actualizarResumen(resumen) {
    if (!resumen) return;

    const filas = {
        "Conversaciones consultadas": "conversaciones_consultadas",
        "Prospectos encontrados": "prospectos_encontrados",
        "Chats a modificar": "chats_a_modificar",
        "Sin prospecto V12": "sin_prospecto",
        "Asignados": "asignados",
        "Errores": "errores"
    };

    document.querySelectorAll("#work_area table.table-bordered tbody tr").forEach(tr => {
        const label = tr.children[0]?.textContent.trim();
        const key = filas[label];
        if (key && resumen[key] !== undefined) {
            tr.children[1].textContent = resumen[key];
        }
    });
}

function actualizarTablaResultados(resultados) {
    if (!Array.isArray(resultados)) return;

    // Busca la segunda tabla (detalle de asignaciones); si no existe la tabla completa aún, la crea.
    let detailSection = Array.from(document.querySelectorAll("#work_area h5"))
        .find(h => h.textContent.trim() === "Detalle de asignaciones enviadas");

    let tbody;
    if (detailSection) {
        tbody = detailSection.parentElement.querySelector("table tbody");
    }

    if (!tbody) {
        // Crear el bloque completo si no existía (primera sincronización exitosa)
        const workArea = document.getElementById("work_area");
        const container = document.createElement("div");
        container.className = "mt-3";
        container.innerHTML = `
            <h5>Detalle de asignaciones enviadas</h5>
            <table class="table table-sm table-striped w-100">
                <thead>
                    <tr>
                        <th>Estado</th>
                        <th>Chat</th>
                        <th>Humano</th>
                        <th>Mensaje</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        `;
        workArea.appendChild(container);
        tbody = container.querySelector("tbody");
    }

    tbody.innerHTML = "";
    resultados.forEach(row => {
        const ok = !!row.success;
        const tr = document.createElement("tr");
        tr.className = ok ? "table-success" : "table-danger";
        tr.innerHTML = `
            <td>${ok ? "✓" : "✗"}</td>
            <td></td>
            <td></td>
            <td></td>
        `;
        tr.children[1].textContent = row.chat_id ?? "";
        tr.children[2].textContent = row.human ?? "";
        tr.children[3].textContent = row.message ?? "";
        tbody.appendChild(tr);
    });
}