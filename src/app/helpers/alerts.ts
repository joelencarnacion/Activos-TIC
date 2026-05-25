import Swal from "sweetalert2"

export function alertIsSuccess(respuesta: boolean) {
  if (respuesta) {

    Swal.fire({
      icon: 'success',
      title: 'Guardado correctamente.',
      showConfirmButton: false,
      timer: 2000
    })

  } else {
    Swal.fire({
      icon: 'error',
      title: 'Ocurrio un error, No se pudo guardar el cambio.',
      text: 'Intente nuevamente.',
      showConfirmButton: true,
      confirmButtonColor: 'red',
    })
  }
}


export function alertRemoveSuccess() {
  Swal.fire({
    icon: 'success',
    title: 'Eliminado correctamente.',
    showConfirmButton: false,
    timer: 2000
  })
}

export function errorMessageAlert(message: string) {
  Swal.fire({
    position: 'center',
    icon: 'error',
    title: 'Error',
    text: message,
    showConfirmButton: false,
    timer: 1500
  })
}

export function successMessageAlert(message: string) {
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Success',
    text: message,
    showConfirmButton: false,
    timer: 1500
  })
}

export function alertRemoveSure(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    Swal.fire({
      title: '¡Alerta!',
      text: message,
      icon: 'warning',
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#004b8d',
      cancelButtonColor: '#aaa',
    }).then((result) => {

      if (result.isConfirmed) {
        resolve(true)
      } else {
        resolve(false)
      }
    });
  })
}

export function alertServerDown() {
  Swal.fire({
    icon: 'error',
    title: 'Se ha producido un error \n No se pudo conectar con el servidor.',
    text: 'Intente mas tarde, Si el error persiste consulte al ADMINISTRADOR.',
    showConfirmButton: true,
    confirmButtonColor: 'red',
  })
}

export function alertNoValidForm() {
  Swal.fire({
    icon: 'info',
    title: 'Completa los campos requeridos para realizar la acción ',
    showConfirmButton: false,
    timer: 2000
  })
}


export function showLoading()
{
  Swal.fire({
    didOpen : ()=>
    {
      Swal.showLoading();
    },
    width: '400px',
    text: "Cargando...",
    allowOutsideClick: false
  });
}

export function hideLoading(): void {
  setTimeout(() => {
    Swal.close();
  }, 500);
}
export function infoMessageAlert(message: string) {
  hideLoading();
  setTimeout(() => {
  Swal.fire({
    position: 'center',
    icon: 'info',
    title: 'Infomación',
    text: message,
    showConfirmButton: true, // Cambiar a true para mostrar el botón de confirmación
    confirmButtonText: 'Cerrar', // Texto del botón de confirmación
    timerProgressBar: true,
  });
}, 500);
}
