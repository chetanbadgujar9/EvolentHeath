export class Replace {
    public static replaceAll(value: any): any {
        for (const key in value) {
            if (value.hasOwnProperty(key) && typeof value[key] === 'string') {
                value[key] = value[key] ? value[key].replace(/'/g, "\\'").trim() : '';
            }
        }
        return value;
    }
}
