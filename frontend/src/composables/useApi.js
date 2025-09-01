import Cookies from "js-cookie";

export const useApi = () => {
    const config = {
        public: {
            backendUrl: "http://localhost:8000/api",
        },
    };
    let csrfFetched = false;

    const getCsrfCookie = async () => {
        await fetch("http://localhost:8000/sanctum/csrf-cookie", {
            credentials: "include",
        });
    };

    const fetchWithCsrf = async (url, options = {}) => {
        if (!csrfFetched || !Cookies.get("XSRF-TOKEN")) {
            await getCsrfCookie();
            csrfFetched = true;
        }

        const token = Cookies.get("XSRF-TOKEN");

        return await fetch(`${config.public.backendUrl}${url}`, {
            ...options,
            credentials: "include",
            headers: {
                Accept: "application/json",
                ...(options.body instanceof FormData
                    ? {}
                    : { "Content-Type": "application/json" }),
                "X-XSRF-TOKEN": token,
                ...(options.headers || {}),
            },
        }).then(async (res) => {
            if (!res.ok) {
                const error = await res.json().catch(() => ({}));
                throw { status: res.status, ...error };
            }
            return res.json().catch(() => ({}));
        });
    };

    const fetchPublic = async (url, options = {}) => {
        return await fetch(`${config.public.backendUrl}${url}`, {
            ...options,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...(options.headers || {}),
            },
        }).then(async (res) => {
            if (!res.ok) {
                const error = await res.json().catch(() => ({}));
                throw { status: res.status, ...error };
            }
            return res.json().catch(() => ({}));
        });
    };

    return { fetchWithCsrf, fetchPublic };
};
