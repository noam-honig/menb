
import { IdEntity, FieldOptions, BackendMethod, Filter, Entity, Field, Validators, isBackend, Allow, UserInfo } from "remult";
import { Remult, } from 'remult';
import { Roles } from './roles';
import { terms } from "../terms";
import * as jwt from 'jsonwebtoken';

@Entity<Users>("Users", {
    allowApiRead: Allow.authenticated,
    allowApiUpdate: Allow.authenticated,
    allowApiDelete: Roles.admin,
    allowApiInsert: Roles.admin
},
    (options, remult) => {
        options.apiPrefilter = !remult.isAllowed(Roles.admin) ? { id: remult.user.id } : {};
        options.saving = async (user) => {
            if (isBackend()) {
                if (user._.isNew()) {
                    user.createDate = new Date();
                    if ((await remult.repo(Users).count()) == 0)
                        user.admin = true;// If it's the first user, make it an admin
                }
            }
        }
    }
)
export class Users extends IdEntity {
    @Field({
        validate: [Validators.required, Validators.uniqueOnBackend],
        caption: terms.username
    })
    name: string = '';
    @Field({ includeInApi: false })
    password: string = '';
    @Field({
        allowApiUpdate: false
    })
    createDate: Date = new Date();

    @Field({
        allowApiUpdate: Roles.admin,
        caption: terms.admin
    })
    admin: Boolean = false;
    constructor(private remult: Remult) {
        super();
    }
    async hashAndSetPassword(password: string) {
        this.password = (await import('password-hash')).generate(password);
    }
    async passwordMatches(password: string) {
        return !this.password || (await import('password-hash')).verify(password, this.password);
    }
    @BackendMethod({ allowed: true })
    async create(password: string) {
        if (!this._.isNew())
            throw new Error(terms.invalidOperation);
        await this.hashAndSetPassword(password);
        await this._.save();
    }
    @BackendMethod({ allowed: Allow.authenticated })
    async updatePassword(password: string) {
        if (this._.isNew() || this.id != this.remult.user.id)
            throw new Error(terms.invalidOperation);
        await this.hashAndSetPassword(password);
        await this._.save();
    }
    @BackendMethod({ allowed: true })
    static async signIn(user: string, password: string, remult?: Remult) {
        let result: UserInfo;
        let u = await remult!.repo(Users).findFirst({ name: user });
        if (u)
            if (await u.passwordMatches(password)) {
                result = {
                    id: u.id,
                    roles: [],
                    name: u.name
                };
                if (u.admin) {
                    result.roles.push(Roles.admin);
                }
            }

        if (result!) {
            return (jwt.sign(result, getJwtTokenSignKey()));
        }
        throw new Error(terms.invalidSignIn);
    }

}
export function getJwtTokenSignKey() {
    if (process.env['NODE_ENV'] === "production")
        return process.env['TOKEN_SIGN_KEY']!;
    return "my secret key";
}

