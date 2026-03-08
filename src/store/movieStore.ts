import { makeAutoObservable } from "mobx"
import { getMovies } from "../services/movieService"
import type { Movie } from "../types/Movie"

class MovieStore{

movies:Movie[]=[]

constructor(){
    makeAutoObservable(this)
}

async loadMovies(){

    const res = await getMovies()

    this.movies = res.data
}

}

export const movieStore = new MovieStore()