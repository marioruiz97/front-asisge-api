import { MatDialogConfig } from '@angular/material';

export class AppConstants {

  public static PATH_TIPO_DOCUMENTO = 'tipo-documento';
  public static PATH_ESTADO_PROYECTO = 'estado-proyecto';
  public static PATH_AUDIT = 'audit';

  public static PATH_AUTH = 'auth';
  public static PATH_DELETE_TOKENS = 'audit/delete-tokens';
  public static PATH_RECUPERAR = 'auth/cuenta/recuperar';

  public static PATH_MIS_PROYECTOS = 'usuarios/{id}/mis-proyectos';
  public static PATH_PROYECTOS = 'proyectos';

  public static PATH_USUARIO = 'usuarios';
  public static PATH_ESTADO_USUARIO = 'estado-usuario';
  public static PATH_ASESOR = 'usuarios/clientes';
  public static PATH_CLIENTE_ASESOR = 'clientes/usuarios';
  public static PATH_CLIENTE = 'clientes';
  public static PATH_CONTACTO = 'contactos';

  public static PATH_DASHBOARD = 'dashboard';
  public static PATH_POSIBLES_MIEMBROS = 'posibles-miembros';
  public static PATH_PROYECTO_MIEMBROS = 'proyectos/{idProyecto}/miembros';
  public static PATH_NOTIFICACIONES = 'notificaciones';
  public static PATH_PLANES_TRABAJO = 'proyectos/{idProyecto}/planes';
  public static PATH_PLAN_TRABAJO_ID = 'planes';
  public static PATH_ETAPA_PLAN = 'planes/{idPlan}/etapas';
}

export const DIALOG_CONFIG: MatDialogConfig = {
  disableClose: true,
  position: { right: '0px' },
  maxWidth: '100vw',
  minWidth: '50vw',
};

export const BASIC_DIALOG_CONFIG: MatDialogConfig = {
  maxHeight: '100vh',
  maxWidth: '100vw',
  minWidth: '50vw',
};
