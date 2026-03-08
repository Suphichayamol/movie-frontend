import { observer } from "mobx-react-lite"
import { userStore } from "../store/userStore"
import { useNavigate } from "react-router-dom"

const Navbar = observer(()=>{

const navigate = useNavigate()

const handleLogout = ()=>{
    userStore.logout()
    navigate("/")
}

return(

<nav className="navbar navbar-dark bg-dark">
    <div className="container">
        <span className="navbar-brand">Managing Movie</span>

        <div>
            <span className="text-white me-3">
                Role: {userStore.role}
            </span>

            <button className="btn btn-sm btn-warning" onClick={handleLogout}>
                Logout
            </button>
        </div>

    </div>
</nav>

)

})

export default Navbar