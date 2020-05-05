export interface NavItem {
  name: string;
  url: string;
  icon: string;
  children?: NavItem[];
}

export class AppMenu {


  private $admin: NavItem[] = [
    {
      name: 'Administración', url: '/', icon: 'work_outline',
      children: [
        { name: 'Gestionar Maestros', url: '/maestros', icon: 'work_outline' },
        { name: 'Estados de Proyecto', url: '/estado-proyecto', icon: 'emoji_events' },
        { name: 'Tipos de Documento', url: '/tipo-documento', icon: 'featured_video' },
        { name: 'Auditoría', url: '/audit', icon: 'supervisor_account' },
        /* { name: 'Tipos de Cierre', url: '/tipo-cierre', icon: 'room_service' }, */
      ]
    }
  ];

  private $asesor: NavItem[] = [
    {
      name: 'Terceros', url: '/', icon: 'assignment_ind',
      children: [
        { name: 'Gestionar Usuarios', url: '/usuarios', icon: 'supervisor_account' },
        { name: 'Gestionar Clientes', url: '/clientes', icon: 'people_outline' },
        /* { name: 'Perfiles', url: '/perfiles', icon: 'supervisor_account' }, */
        { name: 'Inactivaciones', url: '/', icon: 'pan_tool' },
        { name: 'Adjuntos', url: '/', icon: 'attachment' }
      ]
    }
  ];

  private $cliente: NavItem[] = [
    {
      name: 'Proyectos', url: '/', icon: 'dashboard',
      children: [
        { name: 'Ver Planes de Trabajo', url: '/plantillas', icon: 'next_week' },
        { name: 'Tablero de Proyectos', url: '/proyectos', icon: 'dashboard' },
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


  get menuAdmin() {
    return this.$admin.concat(this.$asesor).concat(this.$cliente);
  }

  get menuAsesor() {
    return this.$asesor.concat(this.$cliente);
  }

  get menuCliente() {
    const menu: NavItem[] = [{
      name: 'Terceros', url: '/', icon: 'assignment_ind',
      children: [{ name: 'Gestionar Clientes', url: '/clientes', icon: 'people_outline' }]
    }];
    this.$cliente.map(padre => {
      if (padre.children && padre.children.length > 0) {
        padre.children = padre.children.filter(hijo => hijo.url !== '/plantillas');
      }
    });
    return menu.concat(this.$cliente);
  }


  get settings() {
    return this.$settings.slice();
  }
}

// TODO: ELIMINAR CÓDIGO VIEJO
/*  get menu() {
    return this.$menu.slice();
  } */

/*
  private $menu = [{
    name: 'Administración', url: '/', icon: 'work_outline',
    children: [
      { name: 'Gestionar Maestros', url: '/maestros', icon: 'work_outline' },
      { name: 'Estados de Proyecto', url: '/estado-proyecto', icon: 'emoji_events' },
      { name: 'Tipos de Documento', url: '/tipo-documento', icon: 'featured_video' },
      { name: 'Auditoría', url: '/audit', icon: 'supervisor_account' },
      { name: 'Tipos de Cierre', url: '/tipo-cierre', icon: 'room_service' },
    ]
  },
  {
    name: 'Terceros', url: '/', icon: 'assignment_ind',
    children: [
      { name: 'Gestionar Usuarios', url: '/usuarios', icon: 'assignment_ind' },
      { name: 'Gestionar Clientes', url: '/clientes', icon: 'people_outline' },
      { name: 'Perfiles', url: '/perfiles', icon: 'supervisor_account' },
      { name: 'Inactivaciones', url: '/', icon: 'pan_tool' },
      { name: 'Adjuntos', url: '/', icon: 'attachment' }
    ]
  },
  {
    name: 'Proyectos', url: '/', icon: 'dashboard',
    children: [
      { name: 'Ver Planes de Trabajo', url: '', icon: 'next_week' },
      { name: 'Tablero de Proyectos', url: '/proyectos', icon: 'dashboard' },
      { name: 'Vista de Avances', url: '', icon: 'assessment' },
      { name: 'Próximas Actividades', url: '', icon: 'schedule' }
    ]
  },
  { name: 'Informes', url: '/', icon: 'assessment' }
  ]; */
