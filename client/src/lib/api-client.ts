
const API_URL =
    import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

type ApiErrorBody = {
    success?: false
    error?: {
        code?: string
        message?: string
    }
}

export class ApiRequestError extends Error {
    public readonly status: number
    public readonly code?: string

    constructor(
        message: string,
        status: number,
        code?: string,
    ) {
        super(message)
        this.name = 'ApiRequestError'
        this.status = status
        this.code = code
    }
}

export async function apiRequest<T>(
    path: string,
    init: RequestInit = {},
): Promise<T> {
    const headers = new Headers(init.headers)

    if (init.body && !headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json')
    }

    const response = await fetch(`${API_URL}${path}`, {
        ...init,
        headers,
        credentials: 'include',
    })

    const payload: unknown = await response
        .json()
        .catch(() => null)

    if (!response.ok) {
        const body = payload as ApiErrorBody | null

        throw new ApiRequestError(
            body?.error?.message ??
            `Request failed with status ${response.status}.`,
            response.status,
            body?.error?.code,
        )
    }

    const body = payload as {
        success?: boolean
        data?: T
    } | null

    if (!body || body.success !== true) {
        throw new ApiRequestError(
            'The server returned an invalid response.',
            response.status,
        )
    }

    return body.data as T
}
