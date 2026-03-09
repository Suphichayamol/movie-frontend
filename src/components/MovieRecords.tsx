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

export default observer(function MovieManager() {

    const [movies, setMovies] = useState<Movie[]>([])
    const [title, setTitle] = useState("")
    const [year, setYear] = useState("")
    const [rating, setRating] = useState("G")
    const role = userStore.role
    const [addError, setAddError] = useState("")
    const [editingMovie, setEditingMovie] = useState<Movie | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [editYear, setEditYear] = useState("")
    const [editRating, setEditRating] = useState("G")
    const [editError, setEditError] = useState("")
    const [movieToDelete, setMovieToDelete] = useState<Movie | null>(null)


    const loadMovies = async () => {
        const res = await getMovies()
        setMovies(res.data)
    }

    useEffect(() => {
        loadMovies()
    }, [])

    const handleAddMovie = async () => {

        if (!title.trim()) {
            setAddError("Movie title is required")
            return
        }

        if (!year.trim()) {
            setAddError("Year is required")
            return
        }

        if (!/^\d{4}$/.test(year)) {
            setAddError("Year must be a 4-digit number")
            return
        }

        const yearNum = Number(year)
        const currentYear = new Date().getFullYear()

        if (yearNum < 1700 || yearNum > currentYear) {
            setAddError(`Year must be between 1888 and ${currentYear}`)
            return
        }

        const duplicate = movies.find(
            m => m.title.toLowerCase().trim() === title.toLowerCase().trim()
        )

        if (duplicate) {
            setAddError("Movie title already exists")
            return
        }

        setAddError("")

        const movie: Movie = {
            title,
            year: Number(year),
            rating: rating as any
        }

        await createMovie(movie)

        setTitle("")
        setYear("")
        setRating("G")

        loadMovies()
    }

    const openEditModal = (movie: Movie) => {
        setEditingMovie(movie)
        setEditTitle(movie.title)
        setEditYear(String(movie.year))
        setEditRating(movie.rating)
        setEditError("")
    }

    const closeEditModal = () => {
        setEditingMovie(null)
    }

    const handleEditMovie = async () => {

        if (!editTitle.trim()) {
            setEditError("Movie title is required")
            return
        }

        if (!editYear.trim()) {
            setEditError("Year is required")
            return
        }

        if (!/^\d{4}$/.test(editYear)) {
            setEditError("Year must be a 4 digit number")
            return
        }

        const yearNum = Number(editYear)
        const currentYear = new Date().getFullYear()

        if (yearNum < 1700 || yearNum > currentYear) {
            setEditError(`Year must be between 1888 and ${currentYear}`)
            return
        }
        const duplicate = movies.find(
            m =>
                m.title.toLowerCase().trim() === editTitle.toLowerCase().trim() &&
                m.id !== editingMovie?.id
        )

        if (duplicate) {
            setEditError("Movie title already exists")
            return
        }

        setEditError("")

        const movie: Movie = {
            title: editTitle,
            year: Number(editYear),
            rating: editRating as any
        }

        await updateMovie(editingMovie!.id!, movie)

        closeEditModal()
        loadMovies()
    }

    const handleDeleteMovie = async (id: number) => {
        await deleteMovie(id)
        loadMovies()
    }

    return (

        <div className="app-bg">
            <div className="container">
                <div className="card card-theme p-4">
                    <h2 className="text-center mb-4">Movie Records</h2>

                    <div className="row g-3 mb-4">
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Movie Title</label>
                            <input
                                className={`form-control ${addError.includes("title") ? "is-invalid" : ""}`}
                                placeholder="Movie Title"
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value)
                                    setAddError("")
                                }}
                            />
                            {addError.includes("title") && (
                                <div className="invalid-feedback d-block">
                                    {addError}
                                </div>
                            )}
                        </div>

                        <div className="col-md-3">
                            <label className="form-label fw-bold">Year</label>
                            <input
                                className={`form-control ${addError.toLowerCase().includes("year") ? "is-invalid" : ""}`}
                                placeholder="Year (e.g. 2023)"
                                value={year}
                                maxLength={4}
                                onChange={(e) => {
                                    setYear(e.target.value)
                                    setAddError("")
                                }}
                            />
                            {addError.toLowerCase().includes("year") && (
                                <div className="invalid-feedback d-block">
                                    {addError}
                                </div>
                            )}
                        </div>
                        <div className="col-md-3">
                            <label className="form-label fw-bold">Rating</label>
                            <select className="form-select" value={rating} onChange={(e) => setRating(e.target.value)}>
                                <option>G</option>
                                <option>PG</option>
                                <option>M</option>
                                <option>MA</option>
                                <option>R</option>
                            </select>
                        </div>

                        <div className="col-md-2 d-grid mt-4">
                            <label className="form-label fw-bold"></label>

                            <button
                                className="btn btn-success border border-dark shadow-sm fw-bold"
                                onClick={handleAddMovie}
                            >
                                Add
                            </button>

                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped table-theme">
                            <thead>

                                <tr>
                                    <th>Title</th>
                                    <th className="text-center">Year</th>
                                    <th className="text-center">Rating</th>
                                    <th className="text-center">Actions</th>
                                </tr>

                            </thead>

                            <tbody>
                                {movies.map(movie => (
                                    <tr key={movie.id}>
                                        <td>{movie.title}</td>
                                        <td className="text-center">{movie.year}</td>
                                        <td className="text-center">{movie.rating}</td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-sm btn-primary me-2"
                                                onClick={() => openEditModal(movie)}
                                            >
                                                Edit
                                            </button>

                                            {role === "MANAGER" && (

                                                <button
                                                    className="btn btn-sm btn-danger"
                                                    onClick={() => setMovieToDelete(movie)}
                                                >
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

                {editingMovie && (

                    <>
                        <div className="modal fade show d-block">

                            <div className="modal-dialog modal-dialog-centered">

                                <div className="modal-content">

                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Movie</h5>
                                        <button className="btn-close" onClick={closeEditModal}></button>
                                    </div>

                                    <div className="modal-body">
                                        <div className="mb-3">
                                            <label className="form-label">Movie Title</label>
                                            <input
                                                autoFocus
                                                className={`form-control ${editError.includes("title") ? "is-invalid" : ""}`}
                                                placeholder="Movie Title"
                                                value={editTitle}
                                                onChange={(e) => {
                                                    setEditTitle(e.target.value)
                                                    setEditError("")
                                                }}
                                            />
                                            {editError.includes("title") && (
                                                <div className="invalid-feedback d-block">
                                                    {editError}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Year</label>

                                            <input
                                                className={`form-control ${editError.toLowerCase().includes("year") ? "is-invalid" : ""}`}
                                                placeholder="Year (e.g. 2023)"
                                                value={editYear}
                                                maxLength={4}
                                                onChange={(e) => {
                                                    setEditYear(e.target.value)
                                                    setEditError("")
                                                }}
                                            />
                                            {editError.toLowerCase().includes("year") && (
                                                <div className="invalid-feedback d-block">
                                                    {editError}
                                                </div>
                                            )}
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label">Rating</label>
                                            <select
                                                className="form-select"
                                                value={editRating}
                                                onChange={(e) => setEditRating(e.target.value)}
                                            >
                                                <option>G</option>
                                                <option>PG</option>
                                                <option>M</option>
                                                <option>MA</option>
                                                <option>R</option>
                                            </select>
                                        </div>

                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            className="btn btn-secondary"
                                            onClick={closeEditModal}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            className="btn btn-success"
                                            onClick={handleEditMovie}
                                        >
                                            Update
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-backdrop fade show custom-backdrop"></div>
                    </>

                )}


                {movieToDelete && (
                    <>
                        <div className="modal fade show d-block">

                            <div className="modal-dialog modal-dialog-centered">

                                <div className="modal-content">

                                    <div className="modal-header">
                                        <h5 className="modal-title">Confirm Delete</h5>
                                        <button
                                            className="btn-close"
                                            onClick={() => setMovieToDelete(null)}
                                        ></button>
                                    </div>

                                    <div className="modal-body">

                                        <p>
                                            Are you sure you want to delete
                                            <strong> {movieToDelete.title} </strong> ?
                                        </p>

                                    </div>

                                    <div className="modal-footer">

                                        <button
                                            className="btn btn-secondary"
                                            onClick={() => setMovieToDelete(null)}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            className="btn btn-danger"
                                            onClick={async () => {
                                                await handleDeleteMovie(movieToDelete.id!)
                                                setMovieToDelete(null)
                                            }}
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                        <div className="modal-backdrop fade show"></div>
                    </>
                )}

            </div>
        </div>

    )

})