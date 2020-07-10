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
        { name: 'Estados de Actividad', url: '/estado-actividad', icon: 'room_service' },
        { name: 'Tipos de Documento', url: '/tipo-documento', icon: 'featured_video' },
        { name: 'Auditoría', url: '/audit', icon: 'supervisor_account' }
      ]
    }
  ];

  private $asesor: NavItem[] = [
    {
      name: 'Terceros', url: '/', icon: 'assignment_ind',
      children: [
        { name: 'Gestionar Usuarios', url: '/usuarios', icon: 'supervisor_account' },
        { name: 'Gestionar Clientes', url: '/clientes', icon: 'people_outline' }
      ]
    }
  ];

  private $cliente: NavItem[] = [
    {
      name: 'Proyectos', url: '/', icon: 'dashboard',
      children: [
        { name: 'Ver Plantillas', url: '/plantillas', icon: 'next_week' },
        { name: 'Tablero de Proyectos', url: '/proyectos', icon: 'dashboard' }
      ]
    },
    { name: 'Informes', url: '/', icon: 'assessment' }
  ];

  private $settings = [
    { name: 'Mi Perfil', url: '/micuenta', icon: 'account_circle' },
    { name: 'Acerca de', url: '/acerca', icon: 'account_tree' },
    { name: 'Contacto', url: '/contacto', icon: 'contacts' }
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
