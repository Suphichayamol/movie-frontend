import { userStore } from "../store/userStore"
import { useNavigate } from "react-router-dom"

export default function LoginPage(){

const navigate = useNavigate()
const login = (role:string)=>{
  userStore.login(role)
  navigate("/movies")
}

return(

<div className="container d-flex justify-content-center align-items-center vh-100">

    <div className="card shadow-lg p-5 text-center" style={{maxWidth:"420px", width:"100%"}}>

        <h2 className="mb-3 fw-bold">Movie Management</h2>
        <p className="text-muted mb-4">Select your role to continue</p>

        <div className="d-grid gap-3">

            <button
            className="btn btn-purple fw-bold"
            onClick={()=>login("MANAGER")}
            >
            Manager
            </button>

            <button
            className="btn btn-pink fw-bold"
            onClick={()=>login("TEAMLEADER")}
            >
            Team Leader
            </button>

            <button
            className="btn btn-secondary fw-bold"
            onClick={()=>login("FLOORSTAFF")}
            >
            Floor Staff
            </button>

        </div>

    </div>

</div>

)

}