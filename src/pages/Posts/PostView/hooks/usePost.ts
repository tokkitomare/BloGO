import { useEffect, useState } from "react";
import type { Post } from "../../../../types";
import { getPostById } from "../services/postByIdService";
import axios from "axios";

type PostStatus = "loading" | "success" | "not-found" | "error";

export function usePost(id?: string) {
    const [post, setPost] = useState<Post | null>(null);
    const [status, setStatus] = useState<PostStatus>("loading");

    useEffect(() => {
        if (!id) {
            setStatus("not-found");
            return;
        }

        let cancelled = false;
        setStatus("loading");

        getPostById(id)
            .then((data) => {
                if (cancelled) return;
                setPost(data);
                setStatus("success");
            })
            .catch((err) => {
                if (cancelled) return;
                const isNotFound =
                    axios.isAxiosError(err) && err.response?.status === 404;
                setStatus(isNotFound ? "not-found" : "error");
            });

        return () => {
            cancelled = true;
        };
    }, [id]);

    return { post, status };
}