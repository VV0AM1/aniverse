import {api} from "./api"

export const animeServices = {
    all: () => {
        return api.get("/anime")
    }
}