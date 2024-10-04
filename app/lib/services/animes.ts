import {api} from "./api"

export const animeServices = {
    all: () => {
        return api.get("/anime");
    },
    getByIdFull: (anime_id:string)=>{
        return api.get(`/anime/${anime_id}/full`);
    },
    getById: (anime_id:string)=>{
        return api.get(`/anime/${anime_id}`);
    },
    getAnimeGenres: () => {
        return api.get("/genres/anime");
    }
}