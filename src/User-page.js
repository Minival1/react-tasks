import {withAuthRedirect} from "./hoc/auth-redirect";

const UserPage = () => {
    return (
        <h1>User Page</h1>
    )
}
export default withAuthRedirect(UserPage)
