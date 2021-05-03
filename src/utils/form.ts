type Field = {
    name: string;
    value: string;
};

export const getValues = <T>(form: (T & Field)[]): Record<string, string> =>
    form.reduce((values, field) => ({ ...values, [field.name]: field.value }), {});
