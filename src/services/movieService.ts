import axios from "axios"
import { type Movie } from "../types/Movie"
import { userStore } from "../store/userStore"

const API = "http://localhost:5000/api/movies"

export const getMovies = () => {
  return axios.get(API)
}

export const createMovie = (movie: Movie) => {
  return axios.post(API, movie)
}

export const updateMovie = (id: number, movie: Movie) => {
  return axios.put(`${API}/${id}`, movie)
}

export const deleteMovie = (id: number) => {
  return axios.delete(`${API}/${id}`, {
    headers: {
      role: userStore.role
    }
  })
}