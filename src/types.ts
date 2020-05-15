export default class FsMeta {
    public readonly type: string;
    public readonly name: string;
    public readonly current: boolean;
    public readonly key: Key;
    public readonly permissions: Permission;
    public readonly children: Key[];
}

export type Key = string;

class Permission {
    public readonly read: string[];
    public readonly write: string[];
}
