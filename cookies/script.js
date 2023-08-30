let ajustes = {
  mute: false,
}

function play(){
  if(!ajustes.mute){
    let sound = document.getElementById("sound");
    sound.currentTime = 0;
    sound.play();
  } 
}

function playCompra(){
  if(!ajustes.mute){
    let sound = document.getElementById("compra");
    sound.currentTime = 0;
    sound.play();
  } 
}

function mute(){
  ajustes.mute = !ajustes.mute; 
   document.getElementById("volumen").innerHTML = ajustes.mute ? 'Audio <i class="bi bi-volume-mute-fill"></i>':
                                                                 'Audio <i class="bi bi-volume-up"></i>'
}

let logros = {};
let precios = {};
let sumaGalletas = {};

function iniciarContadores(){
  logros = {
  galletasAutomaticas:0,
  galletas:0,
  puntero:0,
  abuela:0,
  granja:0,
  }
  
  precios = {
    cantidadCompra:1,
    aumentoPrecio: 1.20,
    puntero:10,
    abuela: 100,
    granja:1005,
  }
  
  sumaGalletas = {
    puntero:0.2,
    abuela: 1.3,
    granja:10.4,
  }
}

function count(){
  logros.galletas++;
}

function mostrar(){
  document.getElementById("contador").innerHTML = `${logros.galletas.toFixed(0)}`;
  document.getElementById("galletasSegundo").innerHTML = `${logros.galletasAutomaticas.toFixed(2)}`;
}

function aumentar(){
  play();
  count();
  mostrar();
  activarCompras();
}

function trampa(){
  logros.galletas += 999;
  aumentar();
}

function reiniciar(){
   Swal.fire({
    title: 'Seguro que quieres borrar tu progreso?',
    text: "Se eliminará permanentemente!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, renuncio a mis galletas!'
  }).then((result) => {
    if (result.isConfirmed) {
        localStorage.removeItem("logros");
        location.reload();
    }
  })
}

function ponerPrecios(){
  document.getElementById("precioPuntero").innerHTML = (precios.puntero * precios.cantidadCompra).toFixed(0);
  document.getElementById("contadorPunteros").innerHTML = logros.puntero;
  document.getElementById("precioAbuela").innerHTML = (precios.abuela  * precios.cantidadCompra).toFixed(0);
  document.getElementById("contadorAbuelas").innerHTML = logros.abuela;
  document.getElementById("precioGranja").innerHTML = (precios.granja * precios.cantidadCompra).toFixed(0);
  document.getElementById("contadorGranjas").innerHTML = logros.granja;
}

function calculoAutomatico(){
    logros.galletasAutomaticas =  (logros.puntero * sumaGalletas.puntero) 
                              + (logros.abuela * sumaGalletas.abuela)
                              + (logros.granja * sumaGalletas.granja)
}

function totalCompras(cantidad) {
  precios.cantidadCompra = cantidad;
  pintarBotones(cantidad);
  ponerPrecios();
}

function pintarBotones(cantidad){
  document.getElementById(`comprar1`).className = "";
  document.getElementById(`comprar10`).className = "";
  document.getElementById(`comprar100`).className = "";
  document.getElementById(`comprar${cantidad}`).className = "pulsado";
}

function activarCompras(){

  document.getElementById("bCompraPuntero").disabled = (logros.galletas >= (precios.puntero * precios.cantidadCompra)) ?  false:true;
  document.getElementById("bCompraAbuela").disabled = (logros.galletas >= (precios.abuela * precios.cantidadCompra)) ?  false:true;
  document.getElementById("bCompraGranja").disabled = (logros.galletas >= (precios.granja * precios.cantidadCompra)) ?  false:true;
}

function comprar(producto) {
  const precioProducto = precios[producto] * precios.cantidadCompra;

  if (logros.galletas >= precioProducto) {
    logros[producto] += precios.cantidadCompra;
    logros.galletas -= precioProducto;
    precios[producto] *= precios.aumentoPrecio * precios.cantidadCompra;
    ponerPrecios();
    calculoAutomatico();
    activarCompras();
    playCompra();
    mostrar();
  }
}

function guardar() {
 localStorage.setItem("logros", JSON.stringify(logros));
}

function cargar(){
  let tmp = localStorage.getItem("logros");
  console.log(tmp)
  if (tmp){
    logros = JSON.parse(tmp);
    iniciarPrecios();
    mostrar();
  }  
}

function aumentoAutomatico(){
  logros.galletas += logros.galletasAutomaticas;
  activarCompras();
  mostrar();
}

function iniciarPrecios(){
  if (logros.puntero > 0) precios.puntero = precios.puntero * (logros.puntero * precios.aumentoPrecio);
  if (logros.abuela > 0)  precios.abuela = precios.abuela * (logros.abuela * precios.aumentoPrecio);
  if (logros.granja > 0)  precios.granja = precios.granja * (logros.granja * precios.aumentoPrecio);
}

iniciarContadores();
cargar();

ponerPrecios();
activarCompras();

setInterval(aumentoAutomatico, 100);
setInterval(guardar, 64000);