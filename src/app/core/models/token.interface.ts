export interface tokenInterface {
    token: string;
    exp: string | Date;
    username?: string;
    user?: {
        email?: string;
        firstname?: string;
        id?: string;
        lastname?: string;
    };
    company?: {
        companyName?: string;
        companyType?: string;
        id?: Number | string;
    };
    roles?: Array<any> | string;
}