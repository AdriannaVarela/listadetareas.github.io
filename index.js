const tarea = document.querySelector('#Tarea');
const btnAdd = document.querySelector('#add');
const form   = document.querySelector('#main-tareas');
const list = document.querySelector('#Lista');

tarea.addEventListener('input', () => {
    if (tarea.value === '') {
        btnAdd.disabled = true;
    }
    else {
        btnAdd.disabled = false;
    }
});

const tareasManager = () => {
    let tareas = [];
    const publicApi = {
        añadirTarea: (nuevaTarea) => {
            tareas = tareas.concat(nuevaTarea);
        },
        guardarNavegador: () => {
            localStorage.setItem("listaTareas", JSON.stringify(tareas));
        },
        renderTareas: ()=> {
            //borrar el contenido de la lista
            list.innerHTML = '';

            tareas.forEach(tarea => {

                const ListItem = document.createElement('li');
                ListItem.classList.add('tarea-container');
                ListItem.id = tarea.id;

                const contenido = tarea.tarea;

                let btnStatus = '';
                if (tarea.estado === 'chequeada') {
                    btnStatus = 'btnCheck';
                } else {
                    btnStatus = '';
                }
                ListItem.innerHTML = `<p class="list-element ${tarea.estado}">
                    ${contenido}
                    </p>
                    <button class="check ${btnStatus}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="check-btn">
                            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
            
                    </button>
                    <button class="delete">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                            stroke="currentColor" class="eliminar-btn">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>`;

                //5 agregar el li a la ul (como un hijo)
                list.append(ListItem);

            })
            
            
        },
        eliminarTarea: (id) => {
            tareas = tareas.filter(tarea => {
                if (id !== tarea.id) {
                    return tarea;
                }
            });
        },
        editarTarea: (tareaEditada) => {
            tareas = tareas.map(tarea => {
                
                if (tareaEditada.id === tarea.id) {
                    
                    return tareaEditada;
                } else {
                    
                    return tarea;
                }
            })
        },
        reemplazarTareas: (tareasLocales) => {
            tareas = tareasLocales;
        },
        contadorTareas: () => {
            let contadorTotal = 0;
            let contadorChequeadas = 0;
            let contadorNoChequeadas = 0;
            tareas.forEach(tarea => {
        
                if (tarea.estado === 'chequeada') {
                    contadorChequeadas ++;
                    contadorTotal ++;
                } else {
                    contadorNoChequeadas ++;
                    contadorTotal ++;
                }
            })
        
            const inputTotal = document.querySelector('#total');
            const inputChequeadas = document.querySelector('#completed');
            const inputNochequeadas = document.querySelector('#incompleted');
        
            inputTotal.value = `Total: ${contadorTotal}`;
            inputChequeadas.value = `Completadas: ${contadorChequeadas}`;
            inputNochequeadas.value = `Incompletas: ${contadorNoChequeadas}`;
        }
    }
    return publicApi;
}

const manager = tareasManager();

const chequear = (identificacion, valor, estado) => {

    const tareaEditada = {
        id: identificacion,
        tarea: valor,
        estado: estado
        }
        

        manager.editarTarea(tareaEditada);

        manager.guardarNavegador();
}

list.addEventListener('click', e => {

    const eliminarbtn = e.target.closest('.delete');
    const chequearbtn = e.target.closest('.check');

    if (eliminarbtn) {
        const li = eliminarbtn.parentElement;
        const id = li.id;

        manager.eliminarTarea(id);
        manager.guardarNavegador();

        manager.renderTareas();

        manager.contadorTareas();
    }
    if (chequearbtn) {
        const li = chequearbtn.parentElement;
        const tareaInput = li.children[0];
        const valorP = tareaInput.textContent;
        
        if (tareaInput.classList.contains('chequeada')) {
            tareaInput.classList.remove('chequeada');
            chequearbtn.classList.remove('btnCheck');
            
            chequear(li.id, valorP,'noChequeada');
            manager.contadorTareas();
            
        }else {
            tareaInput.classList.add('chequeada');
            chequearbtn.classList.add('btnCheck');
            chequear(li.id, valorP,'chequeada');

            manager.contadorTareas();
        }
    }
})

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nuevaTarea = {
        id: crypto.randomUUID(),
        tarea: tarea.value,
        estado: "noChequeado"
    }

    manager.añadirTarea(nuevaTarea)

    manager.guardarNavegador()

    manager.renderTareas();

    manager.contadorTareas();

});

window.onload = () => {
    const obtenerTarea = localStorage.getItem("listaTareas");
    const  tareasLocales = JSON.parse(obtenerTarea);
    if (!tareasLocales) {
        manager.reemplazarTareas([]);
    }else {

        manager.reemplazarTareas(tareasLocales);
    }

    manager.renderTareas();

    manager.contadorTareas();
}