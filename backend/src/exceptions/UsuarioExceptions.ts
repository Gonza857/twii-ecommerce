export class CorreoExistenteException extends Error {
    constructor(props: string | undefined) {
        super(props);
    }
}