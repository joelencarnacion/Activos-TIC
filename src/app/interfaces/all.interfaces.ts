export interface ResponseI {
  ok: boolean,
  statusCode: number,
  detail: string,
  data: []
  message: string
  token?: string
  pagination: PaginationI
}

export interface LoginI {
  correoElectronico: string,
  claveAcceso: string
}

export interface UserI {
  id: number,
  cedula: string,
  nombre: string,
  apellidos: string,
  correoElectronico: string,
  recinto: string,
  token: string
  rol:RolesI
}

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export interface MarcaI {
  id?: number,
  nombre: string
}

export interface CategoriaI {
  id?: number,
  nombre: string
}
export interface ModeloI {
  id: number,
  marca?: MarcaI,
  nombre: string,
  idMarca?: number
}

export interface LaboratorioI {
  id: number,
  edificio: string,
  recinto?: string,
  aula: string,
  capacidad: number
}

export interface TiposPerifericoI {
  id: number,
  nombre: string
}

export interface EquipoI {
  id: number,
  nombre: string,
  numeroSerial?: string,
  codigoActivoFijo: string,
  esPeriferico: boolean,
  modelo?: ModeloI,
  categoria?: CategoriaI,
  estado?: EstadosI,
  laboratorio?: LaboratorioI,
  tipoPeriferico?: TiposPerifericoI,
  proveedor: ProveedorI,
  recinto?: RecintoI,
  modeloId: number,
  tipoPerifericoId: number,
  categoriaId: number,
  garantia:number,
  estadoId: number,
  idLaboratorio: number,
  proveedorId: number,
  recintoId: number,
  descripcion: string,
  historial:HistorialI[]
}

export interface EquipoAdministrativoI {
  id: number,
  nombre: string,
  codigoActivoFijo: string,
  codigoBienesNacionales: string,
  numeroSerial: string,
  procesador: string,
  memoriaRamGb: number,
  almacenamientoGb: number,
  ubicacion: string,
  fechaCompra: string,
  fechaGarantiaFin:string,
  esPeriferico: boolean,
  tipoPerifericoId?: number,
  categoriaId: number,
  modeloId: number,
  proveedorId: number,
  recintoId: number,
  historial:HistorialI[]
  modelo?: ModeloI,
  categoria?: CategoriaI,
  estado?: EstadosI,
  laboratorio?: LaboratorioI,
  tipoPeriferico?: TiposPerifericoI,
  proveedor: ProveedorI,
  recinto?: RecintoI,
}
export interface EstadosI {
  id: number,
  nombre: string
}

export interface UsuariosI {
  nombre: string,
  idUsuario: number,
  IdRecinto: number,
  IdUnidad: number,
  Lastname: string,
  Position: string,
  RecintoSigla: string,
  username: string,
  exp: number,
  ist: number,
  nbf: number,
  rol: RolesI,
}
export interface UsuariosGetI {
  idUsuario:number
  usuario: string,
  persona: PersonasI,
  rol: RolesI,
}

export interface PersonasI {
  apellidos: number,
  nombre: string
  idDepartamento: number,
  idDivision: number,
  idCargo: number,
  idRecinto: number,
}

export interface UsuariosPostI {
  Id:number
  usuario: string,
  nombre: string,
  apellidos: string,
  idRol: number,
  idDepartamento: number,
  idDivision: number,
  idCargo: number,
  idRecinto: number,
  idSistema: number
}


export interface EstudianteI {
  id: number,
  nombre: string,
  apellido: string,
  cedula: string,
  matricula: string,
  direcccion:string,
  correoElectronico: string,
  celular: string,
  carrera:string
  recinto: RecintoI,
  equipoAsignado: EquipoI
}

export interface RecintoI {
  id: number,
  nombre: string,
  siglas: string,
  direccion: string,
  telefono: string,
  ciudad:string,
  vicerretor:string
}

export interface HistorialI {
  id: number,
  accionRealizadaPor: string,
  accion: string,
  comentario: string,
  fecha: string
}
export interface RolesI {
  idRol: number,
  nombre: string,
  idSistema:number
}
export interface AsignacionI {
  id?: number,
  estudiante: string,
  equipo: string
}

export interface DepartamentoI {
  idDepartamento: number,
  nombre: string,
  divisiones: DivisionI[]
}

export interface DivisionI {
  id:number,
  nombre:string,
  departamentos:DepartamentoI[]
}
export interface CargoI {
  idCargo:number,
  nombre:string,
}

export interface JWTPayload {
  id: number,
  recinto: number,
  roles?: string[] | string,
  exp: number;
}

export interface ProveedorI {
  id: number,
  nombre: string,
  rnc: string
}
export interface PaginationI {
  currentPage: number,
  totalPages: number,
  totalCount: number,
  pageSize: number,
  totalItems: number
}


export interface UsuarioI {
  idUsuario: number;
  usuario: string;
  persona: {
    nombre: string;
    apellidos: string;
    cedula: string;
  };
  rol: {
    idRol: number;
    nombre: string;
  };
  recinto: {
    siglas: string;
  };


}



export interface ProveedorI {
  id: number;
  nombre: string;
  rnc: string;
}

export interface TipoLicenciaI {
  id: number;
  nombre: string;
}

export interface SoftwareI{
id:number,
nombre:string,
version:string,
fabricante:string,
licencia: LicenciaI | null;
tipoSoftware: TipoSoftwareI;
equipos: EquipoI[];
licenciaId: number,
tipoSoftwareId: number
}

export interface TipoSoftwareI {
  id: number;
  nombre: string;
}
export interface ProveedorI {
  id: number;
  nombre: string;
  rnc: string;
}

export interface LicenciaI{
  id: number,
  nombre:string,
  numeroLicencia:string,
  costo:number,
  fechaIncio:string,
  fechaVencimiento: string,
  estado:string,
  proveedor: ProveedorI,
  tipoLicencia:TipoLicenciaI
  responsableEmailTo: string,
  responsableEmailCc: string,
  proveedorId: number,
  tipoLicenciaId: number,
}

export interface Software{
  id: number,
  nombre:string,
  verison:string,
  fabricante:string,
  licenciaId:number,
  tipoSoftwareId:number
  tipoSoftware: TipoSoftwareI
  LicenciaI:LicenciaI
}

// Interfaces
export interface ActivoI {
  // Control de UI
  expanded: boolean;
  seccionBasica: boolean;
  seccionUbicacion: boolean;
  seccionFacturacion: boolean;
  seccionPresupuesto: boolean;

  // Información Básica
  fechaAdquisicion: string;
  tipoActivo: string;
  estado: string;
  codigoPatrimonial: string;
  nombre:string;
  marca: string;
  modelo: string;
  numeroSerie: string;
  color: string;
  descripcion: string;

  // Ubicación y Asignación
  recinto: string;
  ubicacion: string;
  responsable: string;
  asignadoA: string;

  // Información de Facturación
  costo: number | null;
  numeroFactura: string;
  ordenCompra: string;
  proveedor: string;
  fechaPago: string;
  fechaVencimientoGarantia: string;

  // Información Presupuestaria y SIAB
  guiaPresupuestaria: string;
  codigoSIAB: string;
  numeroRegistroContable: string;
  cuentaContable: string;
  vidaUtil: number | null;
  valorResidual: number | null;

  donacion: any | null;
  movimientos: any[];
  reparacions: any[];
  traslados: any[];
}

export interface FormularioAdccionI {
  numeroFormulario: string;
  formaAdquisicion: string;
  recinto: string;
  area: string;
  factura: string;
  ordenCompra: string;
  proveedor: string;
  observaciones: string;
}

export interface GeneralI{
  id:string,
  nombre:string,
  descripcion:string
}


export interface TipoMovimientoI extends GeneralI{
  subtipos:GeneralI;
}

export interface MovimientoI{
  id:string,
  noFormulario:string,
  tipoMovimiento:GeneralI
  recinto:string,
  numeroFactura:string,
  area:string,
  observaciones:string,
  activos:number,
  activosIds:string[],
  tipoMovimientoId:string,
  subtipoMovimiento:GeneralI
}

export interface AdicionI{
  id: string,
  noFormulario: string,
  formaAdquisicion: GeneralI,
  recinto: string,
area: string,
numFactura: string,
ordenDeCompra: string,
proveedor: string,
costoTotal: number,
observaciones: string,
activos: number,
creadoPor:string
}

export interface DonacionI{
  id:string,
  noFormulario:string,
  tipoDonacion:GeneralI
  recinto:string,
  documentoIdentidad:string,
  area:string,
  observaciones:string,
  activos:number,
  activosIds:string[],
}


export interface ReparacionI{
  id:string,
  noFormulario:string,
  tipoReparacion:GeneralI
  recinto:string,
  documentoIdentidad:string,
  area:string,
  areaSuplidor:string,
  observaciones:string,
  activos:number,
  activosIds:string[],
}

export interface TrasladoI{
  id:string,
  noFormulario:string,
  tipoTraslado:GeneralI
  origenRecinto:string,
  destinoRecinto:string,
  origenarea:string,
  destinoarea:string,
  areaSuplidor:string,
  observaciones:string,
  activos:string,
  activosIds:string[],
}


export interface PermisosI {
  idPermiso: number;
  idModulo: number;
  crear: boolean;
  editar: boolean;
  eliminar: boolean;
  leer: boolean;
}

export interface ModulosI {
  idModulo: number;
  nombre: string;
  idSistema: number;
  permiso: PermisosI;
}

export interface RolesI {
  idRol: number;
  nombre: string;
  idSistema: number;
  modulos: ModulosI[];
}
export interface ComentarioI {
  id: number;
  comentario: string;
  visto: number;
  creadoPor: string;
  fechaCreacion: string;
}
export interface LevantamientoI {
  id: string;
  noFormulario: string;
  recinto: string;
  area: string;
  fechaCreacion: string;
  estado: string;
  creadoPor: string;
}

export interface LevantamientoGetI extends LevantamientoI{
  levantamientosHallazgos:number;
  levantamientosDetalles:number;
  inventarios:number;
}

export interface LevantamientoByIdI extends LevantamientoI{
  levantamientosHallazgos:[];
  levantamientosDetalles:[];
  inventarios:[];
}










