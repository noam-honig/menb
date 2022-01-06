import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { InputField, openDialog } from '@remult/angular';
import { Remult } from 'remult';
import { Users } from './users/users';
import { InputAreaComponent } from './common/input-area/input-area.component';
import { terms } from './terms';
import { PasswordControl } from './users/PasswordControl';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    showSignIn() {
        let user = new InputField<string>({ caption: terms.username });
        let password = new PasswordControl();
        openDialog(InputAreaComponent, i => i.args = {
            title: terms.signIn,
            fields: () => [
                user,
                password
            ],
            ok: async () => {
                this.signIn(user.value, password.value);
            }
        });
    }
    async signIn(username: string, password: string) {
        this.setAuthToken(await Users.signIn(username, password));
    }

    setAuthToken(token: string) {
        this.remult.setUser(new JwtHelperService().decodeToken(token));
        sessionStorage.setItem(AUTH_TOKEN_KEY, token);
    }

    signOut() {
        this.remult.setUser(undefined!);
        sessionStorage.removeItem(AUTH_TOKEN_KEY);
    }

    static fromStorage(): string {
        return sessionStorage.getItem(AUTH_TOKEN_KEY)!;
    }

    constructor(private remult: Remult) {
        let token = AuthService.fromStorage();
        if (token) {
            this.setAuthToken(token);
        }
    }
}
const AUTH_TOKEN_KEY = "authToken";