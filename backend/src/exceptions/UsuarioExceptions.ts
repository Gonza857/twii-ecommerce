export class CorreoExistenteException extends Error {
    constructor(props: string | undefined) {
        super(props);
    }
}

export class DatosIncorrectoException extends Error {
    constructor(props: string | undefined) {
        super(props);
    }
}

export class CuentaYaVerificadaException extends Error {
    constructor(props: string | undefined) {
        super();
    }
}
