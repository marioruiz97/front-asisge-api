export interface NavItem {
  name: string;
  url: string;
  icon: string;
  children?: NavItem[];
  isDisabled?: boolean;
}

export class AppMenu {

  /**
   * TODO agregar boolean isDisabled?
   */
  private $menu = [{
    name: 'Maestros', url: '/maestros', icon: 'work_outline',
    children: [
      { name: 'Gestionar Maestros', url: '/maestros', icon: 'work_outline' },
      { name: 'Gestión de Estados', url: '/estados', icon: 'supervisor_account' },
      { name: 'Tipos de Documento', url: '/tipo-documento', icon: 'featured_video' },
      { name: 'Tipos de Servicio', url: '/tipoServicio', icon: 'room_service' },
      { name: 'Tipos de Cierre', url: '/tipoCierre', icon: 'emoji_events' },
    ]
  },
  {
    name: 'Usuarios', url: '/usuarios', icon: 'assignment_ind',
    children: [
      { name: 'Gestionar Usuarios', url: '/usuarios', icon: 'assignment_ind' },
      { name: 'Perfiles', url: '/perfiles', icon: 'supervisor_account' },
      { name: 'Inactivaciones', url: '/', icon: 'pan_tool' },
    ]
  },
  {
    name: 'Clientes', url: '/clientes', icon: 'people_outline',
    children: [
      { name: 'Gestionar Clientes', url: '/clientes', icon: 'people_outline' },
      { name: 'Representantes Legales', url: '/', icon: 'person' },
      { name: 'Adjuntos', url: '/', icon: 'attachment' },
    ]
  },
  {
    name: 'Proyectos', url: '/proyectos', icon: 'dashboard',
    children: [
      { name: 'Gestionar Plan de Trabajo', url: '', icon: 'dashboard' },
      { name: 'Tablero del Proyecto', url: '', icon: 'next_week' },
      { name: 'Vista de Avances', url: '', icon: 'assessment' },
      { name: 'Próximas Actividades', url: '', icon: 'schedule' }
    ]
  },
  { name: 'Informes', url: '/', icon: 'assessment' }
  ];

  private $settings = [
    { name: 'Mi Perfil', url: '/micuenta', icon: 'account_circle' },
    { name: 'Acerca de', url: '/acerca', icon: 'account_tree' },
    { name: 'Contacto', url: '/contacto', icon: 'contacts' },
    { name: 'Manual de Usuario', url: '/', icon: 'import_contacts' },
  ];


  get menu() {
    return this.$menu.slice();
  }

  get settings() {
    return this.$settings.slice();
  }
}
