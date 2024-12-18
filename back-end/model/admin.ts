import { Expense } from './expense';
import { User } from './user';
import { Admin as AdminPrisma, User as UserPrisma } from '@prisma/client';

export class Admin {
    private id?: number;
    private name: string;
    private user: User;

    constructor(admin: { id?: number; user: User; name: string }) {
        this.validate(admin);

        this.id = admin.id;
        this.name = admin.name;
        this.user = admin.user;

        if (!this.userHasAdminRole()) {
            throw new Error('User does not have admin privileges.');
        }
    }

    getId(): number | undefined {
        return this.id;
    }

    getUser(): User {
        return this.user;
    }

    getName(): string {
        return this.name;
    }

    static from({ id, name, user }: AdminPrisma & { user: UserPrisma }) {
        return new Admin({
            id,
            name,
            user: User.from(user),
        });
    }

    validate(admin: { name: string; user: User }) {
        if (!admin.name?.trim()) {
            throw new Error('Name is required and cannot be empty.');
        }
        if (!admin.user.isAdmin()) {
            throw new Error('User must be admin.');
        }
    }

    equals(admin: Admin): boolean {
        return this.id === admin.getId() && this.user.equals(admin.getUser());
    }

    private userHasAdminRole(): boolean {
        return this.user.getRole() === 'admin';
    }
}
