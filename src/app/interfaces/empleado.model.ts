export interface Empleado {
    claveEmpleado: string;
    nombreCompleto: string;
    area: string;
    puesto: string;
    correo: string;
    rfc: string;
    nss: string;
}


// *************************** Sistemas Asignados ********************************
export interface Sistema {
    id: number;
    nombre: string;
    url:string;
  }
  
  export interface EmpleadoSistemas {
    idusuario: number;
    claveEmpledado: string;
    sistemas: Sistema[];
  }
  
  