import {api} from "./api"

export const animeServices = {
    all: (page = 1) => {
        return api.get(`/anime?page=${page}`);
    },
    character: (id: string) => {
        return api.get(`/anime/${id}/characters`);
    },
    characterFull: (id: any) => {
        return api.get(`/characters/${id}/full`);
    },
    top: (page = 1) => {
        return api.get(`/top/anime?page=${page}`);
    },
    getByIdFull: (anime_id:string)=>{
        return api.get(`/anime/${anime_id}/full`);
    },
    getById: (anime_id:string)=>{
        return api.get(`/anime/${anime_id}`);
    },
    getGenreAnimes: (genre_id: any, page = 1) => {
        return api.get(`/anime?page=${page}&genres=${genre_id}`);
    },
    getAnimeGenres: () => {
        return api.get("/genres/anime");
    },
    getAnimeByName: (name:any) => {
        return api.get(`https://api.jikan.moe/v4/anime?q=${name}`);
    },
    getAnimeUpcoming: (page = 1) => {
        return api.get(`/seasons/upcoming?page=${page}`)
    },
    getAnimeAiring: (page = 1) => {
        return api.get(`/seasons/now?page=${page}`)
    },
    getTopCharacters: (page = 1) => {
        return api.get(`/top/characters?page=${page}`)
    },
    getTopManga: (page = 1) => {
        return api.get(`/top/manga?page=${page}`)
    },
    geManga: (page = 1) => {
        return api.get(`/manga?page=${page}`)
    },
    getReviews: (mal_id: string) => {
        return api.get(`anime/${mal_id}/reviews`)
    },    
    getMangaById: (mal_id: string) => {
        return api.get(`manga/${mal_id}`)
    },   
    getMangaCharacters: (mal_id: string) => {
        return api.get(`manga/${mal_id}/characters`)
    },  

}
