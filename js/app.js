// Variables
const btnActiveCart = document.getElementById('btn-cart')
const carrito = document.getElementById('carrito')
const cursos = document.getElementById('lista-cursos')
const listaCursos = document.querySelector('#lista-carrito tbody')
const vaciarCarritoBtn = document.getElementById('vaciar-carrito')
const divMessage = document.getElementById('message')

// Listeners

cargarEnventListeners()

function cargarEnventListeners(){
    // Cuando se hace click en el boton del carrito
    btnActiveCart.addEventListener('click', e => {
        carrito.classList.toggle('show')
        if(e.target.id === 'btn-cart') {
            e.target.classList.toggle('active')
        }else {
            e.target.parentElement.classList.toggle('active')
        }
    })

    // Dispara cuando se presiona "Agregar Carrito"
    cursos.addEventListener('click', comprarCurso)

    // Cuando se leimina un Curso del Carrito
    carrito.addEventListener('click', eliminarCurso)

    // Al vaciar el carrito
    vaciarCarritoBtn.addEventListener('click', vaciarCarrito)

    // Al cargar el document, mostrar Local Storage
    document.addEventListener('DOMContentLoaded', leerLocalStorage)
}

// Funciones

// funcion que añade el curso al carrito
function comprarCurso(e){
    e.preventDefault()
    
    // Delegation para agregar-carrito
    if(e.target.classList.contains('agregar-carrito')){
        const curso = e.target.parentElement.parentElement
        // Enviamos el curso seleccionado para tomar sus Datos
        leerDatosCurso(curso)
    }
}

// Lee los Datos del Curso

function leerDatosCurso(curso){

    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id')
    }

    insertarCarrito(infoCurso)
}

// Muestra el curso Seleccionado en el Carrito

function insertarCarrito(curso){
    const row = document.createElement('tr')
    row.innerHTML = `
    
        <td>
            <img src="${curso.imagen}" width="100">
        </td>
        <td>
            ${curso.titulo}
        </td>
        <td>
            ${curso.precio}
        </td>
        <td class="text-center text-light">
            <a fref="#" class="borrar-curso btn btn-danger" data-id="${curso.id}"><i class="fa fa-times"></i></a>
        </td>
    
    `
    listaCursos.appendChild(row)

    guardarCursoLocalStorage(curso)
    showMessage('Se Agrego Correctamente')
}

// Mostrar el mensaje
function showMessage(message) {
    const alert = document.createElement('div')
    alert.style.position = 'fixed'
    alert.style.bottom = '10px'
    alert.style.left = '10px'
    alert.classList.add('alert', 'alert-success', 'shadow')
    alert.textContent = message
    divMessage.appendChild(alert)
    setTimeout(() => {
        alert.remove()
    }, 1000)

}

// Elimina el curso del carrito en el DOM
function eliminarCurso(e){
    e.preventDefault()

    let curso,
        cursoId

    if(e.target.classList.contains('borrar-curso') || e.target.parentElement.classList.contains('borrar-curso')){
        if(e.target.classList.contains('fa')) {
            e.target.parentElement.parentElement.parentElement.remove()
            curso = e.target.parentElement.parentElement.parentElement
            cursoId = curso.querySelector('a').getAttribute('data-id')
        }else {
            e.target.parentElement.parentElement.remove()
            curso = e.target.parentElement.parentElement
            cursoId = curso.querySelector('a').getAttribute('data-id')
        }
    }
    // La ventaja de este Metodo(delegate), es que podemos interactuar con elementos insertados en el DOM dinamicamente

    eliminarCursoLocalStorage(cursoId)
}

// Elimina los cursos del carrito en el DOM
function vaciarCarrito(){
    // listaCursos.innerHTML = ''

    // forma rapida (recomendada)

    while(listaCursos.firstChild){
        listaCursos.removeChild(listaCursos.firstChild)
    }

    // vaciar Local Storage
    vaciarLocalStorage()

    return false;
}

// Almacena Cursos del Carrito en Local Storage

function guardarCursoLocalStorage(curso){
    let cursos

    // Toma el valor de un arreglo con datos del lS o vacio
    cursos = obtenerCursosLocalStorage()

    // El curso seleccionado se agrega al arreglo
    cursos.push(curso)

    localStorage.setItem('cursos', JSON.stringify(cursos))
}

// Comprueba que haya elementos en Local Storage
function obtenerCursosLocalStorage(){
    let obtenerCursosLocalStorage

    // Comprobamos si hay algo en el Local Storage
    if(localStorage.getItem('cursos') === null){
        cursosLS = []
    }else{
        cursosLS = JSON.parse(localStorage.getItem('cursos'))
    }
    return cursosLS
}

// Imprime los cursos de Local Storage en el carrito

function leerLocalStorage(){
    let cursosLS

    cursosLS = obtenerCursosLocalStorage()

    cursosLS.forEach(function(curso){
        // Construir el template
        const row = document.createElement('tr')
    row.innerHTML = `
    
        <td>
            <img src="${curso.imagen}" width="100">
        </td>
        <td>
            ${curso.titulo}
        </td>
        <td>
            ${curso.precio}
        </td>
        <td class="text-center text-light">
            <a fref="#" class="borrar-curso btn btn-danger" data-id="${curso.id}"><i class="fa fa-times"></i></a>
        </td>
    
    `
    listaCursos.appendChild(row)
    })

    console.log(cursosLS)
}

// Elimina curso por el ID en Local Storage

function eliminarCursoLocalStorage(curso){
    let cursosLS
    // Obtenemos el arreglo de cursos
    cursosLS = obtenerCursosLocalStorage()
    // Iteramos comparando el ID del curso borrado con los del LS
    cursosLS.forEach(function(cursoLS, index){
        if(cursoLS.id === curso){
            cursosLS.splice(index, 1)
        }
    })
    // Añadimos el arreglo al storage
    localStorage.setItem('cursos', JSON.stringify(cursosLS))
}

// elimina todos los cursos del local storage

function vaciarLocalStorage(){
    localStorage.clear()
}