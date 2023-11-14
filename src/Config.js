export const BASE_URL = "https://twittecolnebackend.onrender.com/api";
// export const BASE_URL = "http://localhost:5000/api";

const CONFIG_OBJ = {
    headers: {
        "Content-Type": "application/json",
        "Authorization": localStorage.getItem("veryfication-token")
    }
}

export default CONFIG_OBJ;