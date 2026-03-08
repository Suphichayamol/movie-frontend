import { useEffect, useState } from "react"
import type { Movie } from "../types/Movie"
import { userStore } from "../store/userStore"
import { observer } from "mobx-react-lite"
import {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie
} from "../services/movieService"

export default observer(function MovieManager(){

const [movies,setMovies] = useState<Movie[]>([])
const [title,setTitle] = useState("")
const [year,setYear] = useState("")
const [rating,setRating] = useState("G")
const [editingId,setEditingId] = useState<number|null>(null)
const role = userStore.role
const [error,setError] = useState("")

const loadMovies = async ()=>{
const res = await getMovies()
    setMovies(res.data)
}

useEffect(()=>{
    loadMovies()
},[])

const handleSubmit = async () => {

    if(!title.trim()){
        setError("Movie title is required")
        return
    }

    if(!year.trim()){
        setError("Year is required")
        return
    }

    if(!/^\d{4}$/.test(year)){
        setError("Year must be a 4-digit number")
        return
    }

    const yearNum = Number(year)
    const currentYear = new Date().getFullYear()

    if(yearNum < 1700 || yearNum > currentYear){
        setError(`Year must be between 1888 and ${currentYear}`)
        return
    }

    const duplicate = movies.find(
        m => 
        m.title.toLowerCase() === title.toLowerCase() &&
        m.id !== editingId
    )

    if(duplicate){
        setError("Movie title already exists")
        return
    }

    setError("")

    const movie:Movie={
        title,
        year:Number(year),
        rating:rating as any
    }

    if(editingId){
        await updateMovie(editingId,movie)
        setEditingId(null)
    }else{
        await createMovie(movie)
    }

    setTitle("")
    setYear("")
    setRating("G")

    loadMovies()
}

const handleEdit=(movie:Movie)=>{
    setEditingId(movie.id!)
    setTitle(movie.title)
    setYear(String(movie.year))
    setRating(movie.rating)
}

const handleDelete=async(id:number)=>{
    await deleteMovie(id)
    loadMovies()
}

return(

<div className="app-bg">
    <div className="container">
        <div className="card card-theme p-4">
            <h2 className="text-center mb-4">Your Role {userStore.role}</h2>
            
                <div className="mb-4">
                <label className="form-label fw-bold">User Role</label>
                <span className="badge bg-secondary fs-6 ms-2">
                    {role}
                </span>
                </div>
                {error && (
                <div className="alert alert-danger">
                {error}
                </div>
                )}
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Movie Title</label>
                        <input className="form-control" placeholder="Movie Title" value={title} 
                            onChange={(e)=>{setTitle(e.target.value) 
                            setError("")}}/>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Year</label>
                        <input className="form-control" placeholder="Year (e.g. 2023)" value={year} maxLength={4}
                        onChange={(e)=>{
                            setYear(e.target.value)
                            setError("")
                        }}/>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Rating</label>
                        <select className="form-select" value={rating} onChange={(e)=>setRating(e.target.value)}>
                            <option>G</option>
                            <option>PG</option>
                            <option>M</option>
                            <option>MA</option>
                            <option>R</option>
                        </select>
                    </div>

                    <div className="col-md-2 d-grid mt-4">
                    <label className="form-label fw-bold"></label>

                    <button className={`btn border border-dark shadow-sm fw-bold ${editingId ? "btn-warning" : "btn-success"}`}
                    onClick={handleSubmit}>
                    {editingId ? "Update" : "Add"}
                    </button>

                    </div>
                </div>

        <div className="table-responsive">
            <table className="table table-striped table-theme">
                <thead>

                <tr>
                <th>Title</th>
                <th>Year</th>
                <th>Rating</th>
                <th>Actions</th>
                </tr>

                </thead>

                <tbody> 
                    {movies.map(movie=>(
                    <tr key={movie.id}>
                        <td>{movie.title}</td>
                        <td>{movie.year}</td>
                        <td>{movie.rating}</td>
                        <td>
                    <button className="btn btn-sm btn-primary me-2"
                    onClick={()=>handleEdit(movie)}>
                        Edit
                    </button>

                    {role==="MANAGER" && (

                    <button className="btn btn-sm btn-danger"
                    onClick={()=>handleDelete(movie.id!)}>
                    Delete
                    </button>

                    )}
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </div>
    </div>
</div>

)

})