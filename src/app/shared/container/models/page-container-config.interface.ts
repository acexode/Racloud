export interface PageContainerConfig {
  closeButton?: boolean;
  shadow?: boolean;
  panelClasses?: {
    body?: string;
    header?: string;
    footer?: string;
  };
  theme?: 'transparent' | 'green' | 'lightGreen' | 'white';
}
