export interface MessageI {
  hasIcon?: boolean;
  dismissible?: boolean;
  timeout?: number | string;
  type: string;
  text: string;
  outlet?: string;
  customClass?: string;
}
