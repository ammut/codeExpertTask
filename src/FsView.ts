import FsMeta, {Key} from "types.ts";

const DIR_TYPE = 'inode/directory';
const ROOT_DIR = '.';

/**
 * Use like this:
 *
 * ```
 * const view = (new FsView(metaData, 'student')).toString();
 * ```
 */
export default class FsView {
    static readonly READONLY_SUFFIX = ' (r)';
    static readonly SINGLE_INDENT = '    ';

    private readonly keyIndex: Record<Key, FsMeta>
    private readonly rootKey: Key;

    public constructor(
        private readonly metaData: FsMeta[],
        private readonly role: string,
    ) {
        [this.keyIndex, this.rootKey] = this.buildIndex();
    }

    public toString() {
        const root = this.keyIndex[this.rootKey];
        return Array.from(this.formatDirectory(root, '')).join('\n');
    }

    private buildIndex(): [Record<Key, FsMeta>, Key] {
        const keyIndex: Record<Key, FsMeta> = {};
        let rootKey;

        for (const datum of this.metaData) {
            if (datum.current) {
                keyIndex[datum.key] = datum;

                if (datum.name === ROOT_DIR)
                    rootKey = datum.key;
            }
        }

        return [keyIndex, rootKey];
    }

    private static isDirectory(datum: FsMeta) {
        return datum.type === DIR_TYPE;
    }

    private static isFile(datum: FsMeta) {
        return !FsView.isDirectory(datum);
    }

    private* formatDirectory(directory: FsMeta, indent: string) {
        const children = directory.children
            .map(key => this.keyIndex[key])
            .filter(datum => this.readable(datum))
            .sort((a, b) => a.name.localeCompare(b.name));
        const subDirectories = children.filter(FsView.isDirectory);
        const files = children.filter(FsView.isFile);
        const nextIndent = indent + FsView.SINGLE_INDENT;

        yield indent + this.fsMetaToString(directory);

        for (const subDir of subDirectories)
            for (const format of this.formatDirectory(subDir, nextIndent))
                yield format;

        for (const file of files)
            yield nextIndent + this.fsMetaToString(file);
    }

    private fsMetaToString(file: FsMeta) {
        return file.name + this.readonlySuffix(file);
    }

    private readable(datum: FsMeta) {
        return datum.permissions.read.includes(this.role);
    }

    private writable(datum: FsMeta) {
        return datum.permissions.write.includes(this.role);
    }

    private readonlySuffix(datum: FsMeta) {
        return this.writable(datum) ? '' : FsView.READONLY_SUFFIX;
    }
}
