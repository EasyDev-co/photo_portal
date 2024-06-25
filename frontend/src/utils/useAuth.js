import { useSelector } from "react-redux";

export function useAuth(){
    const {access,refresh} = useSelector(state => state.user);

    return{
        isAuth: !!access,
        access,
        refresh
    }
}